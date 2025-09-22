"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, CheckCircle, XCircle, RefreshCw } from "lucide-react"

export default function TestCalendarPage() {
    const [testResults, setTestResults] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(false)

    const clearOldTokens = () => {
        localStorage.removeItem("google_calendar_token")
        localStorage.removeItem("google_calendar_access_token")
        localStorage.removeItem("google_calendar_refresh_token")
        localStorage.removeItem("google_calendar_token_expiry")
        setTestResults(prev => [...prev, {
            test: "Clear Old Tokens",
            status: "success",
            message: "Old tokens cleared from localStorage"
        }])
    }

    const testAuthUrl = async () => {
        setIsLoading(true)
        try {
            const response = await fetch("/api/google-auth?action=auth-url")
            const data = await response.json()

            if (response.ok) {
                setTestResults(prev => [...prev, {
                    test: "Generate Auth URL",
                    status: "success",
                    message: `Auth URL generated: ${data.authUrl.substring(0, 100)}...`
                }])
            } else {
                setTestResults(prev => [...prev, {
                    test: "Generate Auth URL",
                    status: "error",
                    message: data.error || "Failed to generate auth URL"
                }])
            }
        } catch (error) {
            setTestResults(prev => [...prev, {
                test: "Generate Auth URL",
                status: "error",
                message: `Error: ${error.message}`
            }])
        }
        setIsLoading(false)
    }

    const testCalendarAPI = async () => {
        setIsLoading(true)
        try {
            const accessToken = localStorage.getItem("google_calendar_access_token")
            const refreshToken = localStorage.getItem("google_calendar_refresh_token")

            if (!accessToken) {
                setTestResults(prev => [...prev, {
                    test: "Test Calendar API",
                    status: "error",
                    message: "No access token found. Please connect to Google Calendar first."
                }])
                setIsLoading(false)
                return
            }

            const timeMin = new Date().toISOString()
            const timeMax = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

            const response = await fetch(
                `/api/calendar?action=list-events&accessToken=${accessToken}&refreshToken=${refreshToken || ''}&timeMin=${timeMin}&timeMax=${timeMax}`
            )
            const data = await response.json()

            if (response.ok) {
                setTestResults(prev => [...prev, {
                    test: "Test Calendar API",
                    status: "success",
                    message: `Found ${data.events?.length || 0} events in your calendar`
                }])
            } else {
                setTestResults(prev => [...prev, {
                    test: "Test Calendar API",
                    status: "error",
                    message: data.error || "Failed to fetch calendar events"
                }])
            }
        } catch (error) {
            setTestResults(prev => [...prev, {
                test: "Test Calendar API",
                status: "error",
                message: `Error: ${error.message}`
            }])
        }
        setIsLoading(false)
    }

    const testTokenRefresh = async () => {
        setIsLoading(true)
        try {
            const refreshToken = localStorage.getItem("google_calendar_refresh_token")

            if (!refreshToken) {
                setTestResults(prev => [...prev, {
                    test: "Test Token Refresh",
                    status: "error",
                    message: "No refresh token found. Please connect to Google Calendar first."
                }])
                setIsLoading(false)
                return
            }

            const response = await fetch("/api/google-auth?action=refresh", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ refreshToken }),
            })

            const data = await response.json()

            if (response.ok) {
                setTestResults(prev => [...prev, {
                    test: "Test Token Refresh",
                    status: "success",
                    message: "Token refreshed successfully"
                }])
            } else {
                setTestResults(prev => [...prev, {
                    test: "Test Token Refresh",
                    status: "error",
                    message: data.error || "Failed to refresh token"
                }])
            }
        } catch (error) {
            setTestResults(prev => [...prev, {
                test: "Test Token Refresh",
                status: "error",
                message: `Error: ${error.message}`
            }])
        }
        setIsLoading(false)
    }

    const runAllTests = async () => {
        setTestResults([])
        clearOldTokens()
        await testAuthUrl()
        await testTokenRefresh()
        await testCalendarAPI()
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "success":
                return <CheckCircle className="w-4 h-4 text-green-500" />
            case "error":
                return <XCircle className="w-4 h-4 text-red-500" />
            default:
                return <RefreshCw className="w-4 h-4 text-blue-500" />
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "success":
                return <Badge className="bg-green-100 text-green-800">Success</Badge>
            case "error":
                return <Badge className="bg-red-100 text-red-800">Error</Badge>
            default:
                return <Badge className="bg-blue-100 text-blue-800">Pending</Badge>
        }
    }

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-4">Google Calendar Integration Test</h1>
                    <p className="text-muted-foreground">
                        This page helps you test the Google Calendar integration step by step.
                    </p>
                </div>

                <div className="grid gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="w-5 h-5" />
                                Test Controls
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-wrap gap-4">
                                <Button onClick={clearOldTokens} variant="outline">
                                    Clear Old Tokens
                                </Button>
                                <Button onClick={testAuthUrl} disabled={isLoading}>
                                    Test Auth URL
                                </Button>
                                <Button onClick={testTokenRefresh} disabled={isLoading}>
                                    Test Token Refresh
                                </Button>
                                <Button onClick={testCalendarAPI} disabled={isLoading}>
                                    Test Calendar API
                                </Button>
                                <Button onClick={runAllTests} disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
                                    Run All Tests
                                </Button>
                            </div>

                            <div className="mt-4 p-4 bg-muted rounded-lg">
                                <h3 className="font-semibold mb-2">Instructions:</h3>
                                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                                    <li>Click "Clear Old Tokens" to remove any expired tokens</li>
                                    <li>Click "Test Auth URL" to verify OAuth URL generation</li>
                                    <li>Go to your main app and connect to Google Calendar</li>
                                    <li>Come back here and click "Test Calendar API" to verify it works</li>
                                    <li>Use "Test Token Refresh" to verify refresh functionality</li>
                                </ol>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Test Results</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {testResults.length === 0 ? (
                                <p className="text-muted-foreground">No tests run yet. Click a test button above to get started.</p>
                            ) : (
                                <div className="space-y-3">
                                    {testResults.map((result, index) => (
                                        <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                                            {getStatusIcon(result.status)}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-medium">{result.test}</span>
                                                    {getStatusBadge(result.status)}
                                                </div>
                                                <p className="text-sm text-muted-foreground">{result.message}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Current Token Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Access Token:</span>
                                    <span className={localStorage.getItem("google_calendar_access_token") ? "text-green-600" : "text-red-600"}>
                                        {localStorage.getItem("google_calendar_access_token") ? "Present" : "Missing"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Refresh Token:</span>
                                    <span className={localStorage.getItem("google_calendar_refresh_token") ? "text-green-600" : "text-red-600"}>
                                        {localStorage.getItem("google_calendar_refresh_token") ? "Present" : "Missing"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Token Expiry:</span>
                                    <span className="text-muted-foreground">
                                        {localStorage.getItem("google_calendar_token_expiry")
                                            ? new Date(parseInt(localStorage.getItem("google_calendar_token_expiry")!)).toLocaleString()
                                            : "Unknown"
                                        }
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
