"use client"

import { useEffect } from 'react'

export default function GoogleCalendarCallback() {
  useEffect(() => {
    console.log('Callback page loaded')
    
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const error = urlParams.get('error')

    console.log('Code:', code)
    console.log('Error:', error)

    if (error) {
      console.error('OAuth error:', error)
      window.close()
      return
    }

    if (code) {
      console.log('Processing code:', code)
      
      // Exchange code for tokens
      fetch(`/api/google-auth?action=callback&code=${code}`)
        .then(response => response.json())
        .then(data => {
          console.log('Token response:', data)
          
          if (data.tokens) {
            localStorage.setItem('google_calendar_token', data.tokens.access_token)
            console.log('Token stored')
            window.close()
          } else {
            console.error('No tokens received:', data)
            window.close()
          }
        })
        .catch(error => {
          console.error('Error:', error)
          window.close()
        })
    } else {
      console.log('No code found')
      window.close()
    }
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p>Connecting to Google Calendar...</p>
      </div>
    </div>
  )
}