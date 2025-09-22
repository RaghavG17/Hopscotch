"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Calendar, Plus, Clock, MapPin, Target, Lightbulb, AlertCircle, X } from "lucide-react"
import { useAuth } from "@/lib/auth-context"

interface CalendarEvent {
  id: string
  title: string
  start: string | Date
  end: string | Date
  description?: string
  location?: string
  attendees?: string[]
}

interface SuggestedTask {
  id: string
  title: string
  description: string
  category: string
  estimatedTime: string
  priority: "high" | "medium" | "low"
}

interface CalendarModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CalendarModal({ isOpen, onClose }: CalendarModalProps) {
  const { currentUser } = useAuth()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [suggestedTasks, setSuggestedTasks] = useState<SuggestedTask[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [newEventTitle, setNewEventTitle] = useState("")
  const [newEventDescription, setNewEventDescription] = useState("")

  useEffect(() => {
    const checkConnection = async () => {
      if (!currentUser) return

      const storedAccessToken = localStorage.getItem("google_calendar_access_token")
      const storedRefreshToken = localStorage.getItem("google_calendar_refresh_token")
      const tokenExpiry = localStorage.getItem("google_calendar_token_expiry")

      if (storedAccessToken) {
        // Check if token is expired
        const isExpired = tokenExpiry && Date.now() > parseInt(tokenExpiry)

        if (isExpired && storedRefreshToken) {
          // Try to refresh the token
          try {
            const refreshedToken = await refreshAccessToken(storedRefreshToken)
            if (refreshedToken) {
              setAccessToken(refreshedToken)
              setIsConnected(true)
              await loadCalendarEvents(refreshedToken)
            } else {
              // Refresh failed, clear tokens
              localStorage.removeItem("google_calendar_access_token")
              localStorage.removeItem("google_calendar_refresh_token")
              localStorage.removeItem("google_calendar_token_expiry")
              setIsConnected(false)
            }
          } catch (error) {
            console.error("Token refresh failed:", error)
            setIsConnected(false)
          }
        } else if (!isExpired) {
          setAccessToken(storedAccessToken)
          setIsConnected(true)
          await loadCalendarEvents(storedAccessToken)
        } else {
          setIsConnected(false)
        }
      } else {
        setIsConnected(false)
      }
    }
    checkConnection()
  }, [currentUser])

  const refreshAccessToken = async (refreshToken: string): Promise<string | null> => {
    try {
      const response = await fetch("/api/google-auth?action=refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      })

      const data = await response.json()

      if (response.ok && data.access_token) {
        // Store the new token
        localStorage.setItem("google_calendar_access_token", data.access_token)
        localStorage.setItem("google_calendar_token_expiry", data.expiry_date || (Date.now() + 3600000).toString())
        return data.access_token
      }

      return null
    } catch (error) {
      console.error("Error refreshing token:", error)
      return null
    }
  }

  const loadCalendarEvents = async (token: string) => {
    try {
      const timeMin = new Date().toISOString()
      const timeMax = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      const refreshToken = localStorage.getItem("google_calendar_refresh_token")

      const response = await fetch(
        `/api/calendar?action=list-events&accessToken=${token}&refreshToken=${refreshToken || ''}&timeMin=${timeMin}&timeMax=${timeMax}`,
      )
      const data = await response.json()

      if (response.ok) {
        setEvents(data.events)
        setError(null)
      } else {
        setError(data.error || "Failed to load calendar events")
      }
    } catch (error) {
      console.error("Error loading calendar events:", error)
      setError("Failed to load calendar events")
    }
  }

  useEffect(() => {
    const mockSuggestedTasks: SuggestedTask[] = [
      {
        id: "1",
        title: "Update LinkedIn Profile",
        description: "Add your recent graduation and internship experience",
        category: "Career Development",
        estimatedTime: "30 minutes",
        priority: "high",
      },
      {
        id: "2",
        title: "Schedule Coffee Chat",
        description: "Network with professionals in your field",
        category: "Networking",
        estimatedTime: "1 hour",
        priority: "medium",
      },
      {
        id: "3",
        title: "Apply to 5 Jobs",
        description: "Continue your job search momentum",
        category: "Job Search",
        estimatedTime: "2 hours",
        priority: "high",
      },
      {
        id: "4",
        title: "Learn New Technology",
        description: "Pick up a trending skill in your field",
        category: "Skill Development",
        estimatedTime: "3 hours",
        priority: "medium",
      },
    ]
    setSuggestedTasks(mockSuggestedTasks)
  }, [])

  const connectToGoogleCalendar = async () => {
    if (!currentUser) {
      setError("Please sign in to connect your calendar")
      return
    }

    setIsConnecting(true)
    setError(null)

    try {
      const response = await fetch("/api/google-auth?action=auth-url")
      const data = await response.json()

      if (response.ok) {
        const popup = window.open(
          data.authUrl,
          "google-calendar-auth",
          "width=500,height=600,scrollbars=yes,resizable=yes",
        )

        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed)
            setIsConnecting(false)

            const token = localStorage.getItem("google_calendar_access_token")
            if (token) {
              setAccessToken(token)
              setIsConnected(true)
              loadCalendarEvents(token)
            } else {
              setError("Failed to connect to Google Calendar")
            }
          }
        }, 1000)
      } else {
        setError(data.error || "Failed to initiate Google Calendar connection")
        setIsConnecting(false)
      }
    } catch (error) {
      console.error("Error connecting to Google Calendar:", error)
      setError("Failed to connect to Google Calendar")
      setIsConnecting(false)
    }
  }

  const addTaskToCalendar = async (task: SuggestedTask) => {
    if (!selectedDate) {
      alert("Please select a date first")
      return
    }

    if (!accessToken) {
      setError("Please connect to Google Calendar first")
      return
    }

    try {
      const startTime = new Date(selectedDate.getTime())
      const endTime = new Date(selectedDate.getTime() + 60 * 60 * 1000)

      const response = await fetch("/api/calendar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "create-event",
          accessToken,
          title: task.title,
          description: task.description,
          start: startTime.toISOString(),
          end: endTime.toISOString(),
        }),
      })

      const data = await response.json()

      if (response.ok) {
        const newEvent: CalendarEvent = {
          id: data.event.id || Date.now().toString(),
          title: task.title,
          start: startTime,
          end: endTime,
          description: task.description,
        }

        setEvents((prev) => [...prev, newEvent])
        setSuggestedTasks((prev) => prev.filter((t) => t.id !== task.id))
        setError(null)
      } else {
        setError(data.error || "Failed to add task to calendar")
      }
    } catch (error) {
      console.error("Error adding task to calendar:", error)
      setError("Failed to add task to calendar")
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventStart = typeof event.start === "string" ? new Date(event.start) : event.start
      return eventStart.toDateString() === date.toDateString()
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />

      <div className="fixed inset-4 z-50 bg-background rounded-xl shadow-2xl border border-border flex flex-col">
        <div className="flex items-center justify-between p-8 border-b border-border flex-shrink-0">
          <div className="flex items-center gap-2">
            <Calendar className="w-6 h-6 text-accent" />
            <h1 className="text-2xl font-semibold">Monthly Milestone & Task Planner</h1>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 mx-8 mt-4 bg-red-50 border border-red-200 rounded-lg text-red-800 flex-shrink-0">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        <div className="flex flex-1 min-h-0">
          <div className="flex-1 p-8 border-r border-border overflow-auto">
            {!isConnected ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-semibold">Connect Your Google Calendar</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  Sync your existing events and seamlessly add new tasks to your calendar
                </p>
                <Button onClick={connectToGoogleCalendar} className="mt-4" disabled={isConnecting}>
                  <Plus className="w-4 h-4 mr-2" />
                  {isConnecting ? "Connecting..." : "Connect Google Calendar"}
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold">
                    {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                    >
                      ←
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                    >
                      →
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2 text-center">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="p-3 font-medium text-muted-foreground">
                      {day}
                    </div>
                  ))}

                  {getDaysInMonth(currentDate).map((date, index) => (
                    <div
                      key={index}
                      className={`
                        p-3 h-16 border border-border cursor-pointer hover:bg-muted/50 transition-colors rounded-lg
                        ${date ? "bg-background" : "bg-muted/20"}
                        ${selectedDate && date && selectedDate.toDateString() === date.toDateString()
                          ? "bg-accent text-accent-foreground"
                          : ""
                        }
                      `}
                      onClick={() => date && setSelectedDate(date)}
                    >
                      {date && (
                        <div className="space-y-1">
                          <div className="text-sm font-medium">{date.getDate()}</div>
                          {getEventsForDate(date).length > 0 && (
                            <div className="w-2 h-2 bg-accent rounded-full mx-auto"></div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {selectedDate && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Events for {selectedDate.toLocaleDateString()}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ScrollArea className="h-40">
                        {getEventsForDate(selectedDate).length > 0 ? (
                          <div className="space-y-3">
                            {getEventsForDate(selectedDate).map((event) => (
                              <div key={event.id} className="p-4 border border-border rounded-lg">
                                <div className="font-medium">{event.title}</div>
                                <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                  <Clock className="w-3 h-3" />
                                  {(typeof event.start === "string"
                                    ? new Date(event.start)
                                    : event.start
                                  ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                  {event.location && (
                                    <>
                                      <MapPin className="w-3 h-3 ml-2" />
                                      {event.location}
                                    </>
                                  )}
                                </div>
                                {event.description && (
                                  <div className="text-sm text-muted-foreground mt-2">{event.description}</div>
                                )}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center text-muted-foreground py-8">
                            No events scheduled for this date
                          </div>
                        )}
                      </ScrollArea>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>

          <div className="w-96 flex flex-col bg-muted/20">
            <div className="p-8 flex-1 overflow-hidden flex flex-col">
              <div className="space-y-6 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-accent" />
                  <h3 className="text-lg font-semibold">Suggested Tasks</h3>
                </div>

                <p className="text-sm text-muted-foreground">
                  Based on your timeline milestones, here are some recommended tasks to help you achieve your goals.
                </p>
              </div>

              <div className="flex-1 overflow-auto mt-6">
                <div className="space-y-4 pr-2">
                  {suggestedTasks.map((task) => (
                    <Card key={task.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium">{task.title}</h4>
                            <Badge variant="outline" className={`text-xs ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </Badge>
                          </div>

                          <p className="text-sm text-muted-foreground">{task.description}</p>

                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Target className="w-3 h-3" />
                              {task.category}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {task.estimatedTime}
                            </div>
                          </div>

                          <Button
                            size="sm"
                            className="w-full"
                            onClick={() => addTaskToCalendar(task)}
                            disabled={!selectedDate || !isConnected}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Add to Calendar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {!isConnected && (
                <div className="text-center p-4 bg-muted rounded-lg mt-4 flex-shrink-0">
                  <p className="text-sm text-muted-foreground mb-3">Connect your calendar to add tasks</p>
                  <Button size="sm" onClick={connectToGoogleCalendar}>
                    Connect Now
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
