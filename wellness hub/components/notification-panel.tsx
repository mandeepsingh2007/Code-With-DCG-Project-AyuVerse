"use client"

import { useState, useEffect } from "react"
import { Bell, X, Calendar, Video, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function NotificationPanel() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<{ id: number; type: string; title: string; description: string; time: string; read: boolean }[]>([])

  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => setNotifications(data))

  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
  }

  const removeNotification = (id: number) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))
  }

  const getIcon = (type: string) => {
    switch (type) {
      case "appointment":
        return <Calendar className="h-5 w-5 text-blue-500" />
      case "video":
        return <Video className="h-5 w-5 text-purple-500" />
      case "ai":
        return <Bot className="h-5 w-5 text-green-500" />
      default:
        return <Bell className="h-5 w-5 text-slate-500" />
    }
  }

  return (
    <div className="relative z-50">
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "rounded-full h-12 w-12 bg-white dark:bg-slate-800 shadow-md",
          unreadCount > 0 && "ring-2 ring-purple-500",
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-[10px] text-white flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </Button>

      {isOpen && (
        <Card className="absolute bottom-16 right-0 w-80 md:w-96 shadow-xl animate-in slide-in-from-bottom-5">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Notifications</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
              >
                Mark all as read
              </Button>
            </div>
            <CardDescription>
              You have {unreadCount} unread notification{unreadCount !== 1 && "s"}
            </CardDescription>
          </CardHeader>
          <CardContent className="max-h-[400px] overflow-y-auto">
            {notifications.length > 0 ? (
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      "p-3 rounded-lg relative border",
                      notification.read
                        ? "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                        : "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800",
                    )}
                  >
                    <div className="flex gap-3">
                      <div className="mt-0.5">{getIcon(notification.type)}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-medium text-sm">{notification.title}</h4>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => removeNotification(notification.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300">{notification.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-slate-500">{notification.time}</span>
                          {!notification.read && (
                            <Badge
                              variant="outline"
                              className="text-[10px] h-5 bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300 cursor-pointer"
                              onClick={() => markAsRead(notification.id)}
                            >
                              Mark as read
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-500">
                <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No notifications</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
