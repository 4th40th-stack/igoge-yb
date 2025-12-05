"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { ArrowLeft } from "lucide-react"

export function BackButton() {
  const [isLoading, setIsLoading] = useState(false)
  
  const handleClick = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    if (typeof window !== "undefined") {
      window.history.back()
    }
  }
  
  return (
    <Button
      variant="outline"
      onClick={handleClick}
      disabled={isLoading}
      className="bg-[#010147] hover:bg-[#0063ff] text-white border-0 px-8 py-6 min-w-[140px] disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <>
          <Spinner className="w-5 h-5 mr-2" />
          LOADING...
        </>
      ) : (
        <>
      <ArrowLeft className="w-5 h-5 mr-2" />
      BACK
        </>
      )}
    </Button>
  )
}


