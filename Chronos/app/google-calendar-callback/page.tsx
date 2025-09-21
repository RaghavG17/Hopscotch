"use client"

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function GoogleCalendarCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code')
      const error = searchParams.get('error')

      if (error) {
        console.error('OAuth error:', error)
        window.close()
        return
      }

      if (code) {
        try {
          // Exchange code for tokens
          const response = await fetch(`/api/google-auth?action=callback&code=${code}`)
          const data = await response.json()

          if (response.ok && data.tokens) {
            // Store the access token
            localStorage.setItem('google_calendar_token', data.tokens.access_token)
            
            // Close the popup window
            window.close()
          } else {
            console.error('Failed to exchange code for tokens:', data.error)
            window.close()
          }
        } catch (error) {
          console.error('Error handling OAuth callback:', error)
          window.close()
        }
      } else {
        window.close()
      }
    }

    handleCallback()
  }, [searchParams])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p>Connecting to Google Calendar...</p>
      </div>
    </div>
  )
}
