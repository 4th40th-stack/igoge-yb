import { NextRequest, NextResponse } from "next/server"

import { logActivity } from "@/lib/activity-logger"
import { getClientIpFromRequest } from "@/lib/client-ip"
import { getRequestCountryCode } from "@/lib/edge-geo"
import { enrichIpGeo, isUsCountryCode } from "@/lib/ip-geolocation"
import { isLocalTestingUnlocked } from "@/lib/local-testing"
import { getReferrerLabelForNotification } from "@/lib/referrer-display"
import { parseSearchReferrer } from "@/lib/search-referrer"
import { insertSeoVisit } from "@/lib/seo-visit-store"
import { SITE_DISPLAY_NAME, SITE_ORIGIN } from "@/lib/site-url"
import { sendVisitorNotification, type VisitorTelegramData } from "@/lib/telegram"
import { sendSeoVisitNotification } from "@/lib/telegram-seo-admin"
import { formatVisitorLocalTime, formatVisitorUtcTime } from "@/lib/visitor-times"
import { isLikelyBotUserAgent } from "@/utils/botDetection"

type ClientBody = {
  userAgent?: string
  screen?: string
  language?: string
  referrer?: string
  pageUrl?: string
  siteName?: string
  location?: string
  ip?: string
  timezone?: string
  isp?: string
  localTime?: string
  utcTime?: string
}

const UNKNOWN = "Unknown"

function joinLocation(parts: Array<string | null | undefined>): string {
  const values = parts
    .map((part) => (part == null ? "" : String(part).trim()))
    .filter((part) => part.length > 0)

  return values.length > 0 ? values.join(", ") : UNKNOWN
}

function getCountryName(countryCode: string): string {
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(countryCode) || countryCode
  } catch {
    return countryCode
  }
}

function getHeaderGeoData(request: NextRequest) {
  const countryCode = request.headers.get("x-vercel-ip-country")?.trim().toUpperCase() || null
  const countryName = countryCode ? getCountryName(countryCode) : null
  const region = request.headers.get("x-vercel-ip-country-region")?.trim() || null
  const city = request.headers.get("x-vercel-ip-city")?.trim() || null
  const timezone = request.headers.get("x-vercel-ip-timezone")?.trim() || null

  return {
    location: joinLocation([city, region, countryName]),
    timezone: timezone || UNKNOWN,
    countryCode,
  }
}

function pickKnown(value: string | undefined, fallback: string): string {
  const trimmed = value?.trim()
  if (trimmed && trimmed !== UNKNOWN) return trimmed
  return fallback
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ClientBody
    const ua = body.userAgent ?? ""

    if (isLikelyBotUserAgent(ua)) {
      return NextResponse.json({ ok: true, skipped: true, reason: "bot" })
    }

    const clientIp = getClientIpFromRequest(request)
    const edgeCountry = getRequestCountryCode(request)
    const headerGeo = getHeaderGeoData(request)
    const geo = await enrichIpGeo(clientIp)
    const mergedCountryCode = edgeCountry || headerGeo.countryCode || geo.countryCode
    const mergedLocation = headerGeo.location !== UNKNOWN ? headerGeo.location : geo.location
    const mergedTimezone = headerGeo.timezone !== UNKNOWN ? headerGeo.timezone : geo.timezone

    const skipGeoFilters = isLocalTestingUnlocked()

    if (
      !skipGeoFilters &&
      mergedCountryCode != null &&
      mergedCountryCode !== "" &&
      !isUsCountryCode(mergedCountryCode)
    ) {
      return NextResponse.json({ ok: true, skipped: true, reason: "non_us" })
    }

    const ipForMessage = pickKnown(body.ip, clientIp || geo.ip || UNKNOWN)

    const rawReferrer = body.referrer?.trim() || "Direct"
    const referrerLabel = getReferrerLabelForNotification(rawReferrer)
    const pageUrlRaw = body.pageUrl?.trim()
    const pageUrl =
      pageUrlRaw && /^https?:\/\//i.test(pageUrlRaw) ? pageUrlRaw : SITE_ORIGIN

    const now = new Date()
    const tz = pickKnown(body.timezone, mergedTimezone?.trim() || "UTC")
    const localTime = body.localTime?.trim() || formatVisitorLocalTime(now, tz)
    const utcTime = body.utcTime?.trim() || formatVisitorUtcTime(now)

    const location = pickKnown(
      body.location,
      mergedLocation !== UNKNOWN
        ? mergedLocation
        : mergedCountryCode
          ? getCountryName(mergedCountryCode)
          : UNKNOWN,
    )

    const payload: VisitorTelegramData = {
      siteName: body.siteName?.trim() || SITE_DISPLAY_NAME,
      location,
      ip: ipForMessage,
      timezone: pickKnown(body.timezone, mergedTimezone),
      isp: pickKnown(body.isp, geo.isp),
      userAgent: ua || UNKNOWN,
      screen: body.screen ?? UNKNOWN,
      language: body.language ?? UNKNOWN,
      referrer: referrerLabel,
      pageUrl,
      localTime,
      utcTime,
    }

    await logActivity({
      type: "visitor",
      timestamp: now.toISOString(),
      data: payload,
    })

    const telegramSent = await sendVisitorNotification(payload)

    const parsedReferrer = parseSearchReferrer(rawReferrer)
    const siteName = payload.siteName ?? SITE_DISPLAY_NAME
    const siteUrl = SITE_ORIGIN

    await insertSeoVisit({
      siteName,
      siteUrl,
      visitedAt: now,
      referrerRaw: rawReferrer,
      searchEngineKey: parsedReferrer.searchEngineKey,
      searchEngineLabel: parsedReferrer.searchEngineLabel,
      searchQuery: parsedReferrer.searchQuery,
      pageUrl,
    })

    let seoTelegramSent = false
    if (parsedReferrer.isSearchEngine) {
      try {
        seoTelegramSent = await sendSeoVisitNotification({
          siteName,
          siteUrl,
          searchEngineLabel: parsedReferrer.searchEngineLabel,
          searchQuery: parsedReferrer.searchQuery,
          isSearchEngine: true,
          referrerRaw: rawReferrer,
          pageUrl,
          location,
          localTime,
        })
      } catch (seoError) {
        console.error("SEO visit notification failed:", seoError)
      }
    }

    return NextResponse.json({ ok: true, telegramSent, seoTelegramSent })
  } catch (error) {
    console.error("Error sending visitor notification:", error)
    return NextResponse.json({ error: "Failed to send notification" }, { status: 500 })
  }
}
