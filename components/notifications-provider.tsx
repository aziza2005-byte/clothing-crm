"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { Bell, X, Info, CheckCircle, AlertTriangle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "success" | "warning" | "error"
  read: boolean
  timestamp: Date
  autoClose?: boolean
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface NotificationsContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id" | "read" | "timestamp">) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAllNotifications: () => void
  showToast: (message: string, type?: Notification["type"], duration?: number) => void
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined)

export const useNotifications = () => {
  const context = useContext(NotificationsContext)
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationsProvider")
  }
  return context
}

const initialNotifications: Notification[] = [
  {
    id: "1",
    title: "New Order Received",
    message: "Order #ORD-123 has been placed by Fashion Store A",
    type: "info",
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
  },
  {
    id: "2",
    title: "Low Stock Alert",
    message: "Blue Denim Jeans is running low on stock (5 items remaining)",
    type: "warning",
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
  },
  {
    id: "3",
    title: "Payment Received",
    message: "Payment of $2,450 received for Order #ORD-001",
    type: "success",
    read: true,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
  },
  {
    id: "4",
    title: "System Update",
    message: "New features have been added to the dashboard",
    type: "info",
    read: false,
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
  },
]

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
  const [toasts, setToasts] = useState<Notification[]>([])

  const addNotification = (notification: Omit<Notification, "id" | "read" | "timestamp">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      read: false,
      timestamp: new Date(),
    }
    setNotifications((prev) => [newNotification, ...prev])

    // If autoClose is enabled, show as toast
    if (notification.autoClose !== false) {
      showToast(notification.message, notification.type, notification.duration)
    }
  }

  const showToast = (message: string, type: Notification["type"] = "info", duration = 5000) => {
    const toast: Notification = {
      id: Date.now().toString(),
      title: "",
      message,
      type,
      read: false,
      timestamp: new Date(),
      autoClose: true,
      duration,
    }

    setToasts((prev) => [...prev, toast])

    // Auto remove toast after duration
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== toast.id))
    }, duration)
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notification) => ({ ...notification, read: true })))
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id))
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  // Auto-generate random notifications for demo
  useEffect(() => {
    const interval = setInterval(() => {
      const randomNotifications = [
        {
          title: "New Customer Registered",
          message: `Customer ${Math.floor(Math.random() * 1000)} has joined the platform`,
          type: "success" as const,
        },
        {
          title: "Stock Alert",
          message: `Product ${Math.floor(Math.random() * 50)} is running low on stock`,
          type: "warning" as const,
        },
        {
          title: "Order Update",
          message: `Order #ORD-${Math.floor(Math.random() * 999)} has been shipped`,
          type: "info" as const,
        },
      ]

      if (Math.random() > 0.7) {
        // 30% chance to add a notification every 30 seconds
        const randomNotification = randomNotifications[Math.floor(Math.random() * randomNotifications.length)]
        addNotification(randomNotification)
      }
    }, 30000) // Every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAllNotifications,
        showToast,
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </NotificationsContext.Provider>
  )
}

// Toast Container Component
function ToastContainer({ toasts, onRemove }: { toasts: Notification[]; onRemove: (id: string) => void }) {
  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2 max-w-sm">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  )
}

// Individual Toast Component
function ToastItem({ toast, onRemove }: { toast: Notification; onRemove: (id: string) => void }) {
  const getIcon = () => {
    switch (toast.type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-emerald-400" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-400" />
      default:
        return <Info className="h-5 w-5 text-blue-400" />
    }
  }

  const getBorderColor = () => {
    switch (toast.type) {
      case "success":
        return "border-l-emerald-500"
      case "warning":
        return "border-l-yellow-500"
      case "error":
        return "border-l-red-500"
      default:
        return "border-l-blue-500"
    }
  }

  return (
    <Card
      className={`bg-gray-800/95 backdrop-blur-xl border-gray-700 border-l-4 ${getBorderColor()} shadow-lg animate-in slide-in-from-right-full duration-300`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">{getIcon()}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white font-medium">{toast.message}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-gray-400 hover:text-white flex-shrink-0"
            onClick={() => onRemove(toast.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export function NotificationsDropdown() {
  const { notifications, markAsRead, markAllAsRead, removeNotification } = useNotifications()
  const unreadCount = notifications.filter((notification) => !notification.read).length

  const getTypeStyles = (type: Notification["type"]) => {
    switch (type) {
      case "info":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "success":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
      case "warning":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
      case "error":
        return "bg-red-500/20 text-red-400 border-red-500/30"
    }
  }

  const getTypeIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4" />
      case "warning":
        return <AlertTriangle className="h-4 w-4" />
      case "error":
        return <XCircle className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)
    let interval = seconds / 31536000
    if (interval > 1) return Math.floor(interval) + " years ago"
    interval = seconds / 2592000
    if (interval > 1) return Math.floor(interval) + " months ago"
    interval = seconds / 86400
    if (interval > 1) return Math.floor(interval) + " days ago"
    interval = seconds / 3600
    if (interval > 1) return Math.floor(interval) + " hours ago"
    interval = seconds / 60
    if (interval > 1) return Math.floor(interval) + " minutes ago"
    return Math.floor(seconds) + " seconds ago"
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 p-2 relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs animate-pulse">
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-96 bg-gray-800 border-gray-700 text-white max-h-[500px]" align="end">
        <DropdownMenuLabel className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
            {unreadCount > 0 && <Badge className="bg-red-500 text-white text-xs">{unreadCount}</Badge>}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-blue-400 hover:text-blue-300 hover:bg-transparent h-auto p-1"
              onClick={markAllAsRead}
            >
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.length > 0 ? (
            <DropdownMenuGroup>
              {notifications.slice(0, 10).map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={`p-0 focus:bg-gray-700 cursor-pointer ${notification.read ? "opacity-70" : ""}`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="w-full p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className={`p-1 rounded ${getTypeStyles(notification.type)} border flex-shrink-0`}>
                          {getTypeIcon(notification.type)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium text-sm truncate">{notification.title}</h4>
                          <p className="text-xs text-gray-300 line-clamp-2">{notification.message}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                          onClick={(e) => {
                            e.stopPropagation()
                            removeNotification(notification.id)
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-400">{formatTimeAgo(notification.timestamp)}</p>
                      {notification.action && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-blue-400 hover:text-blue-300 h-auto p-1"
                          onClick={(e) => {
                            e.stopPropagation()
                            notification.action?.onClick()
                          }}
                        >
                          {notification.action.label}
                        </Button>
                      )}
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
              {notifications.length > 10 && (
                <DropdownMenuItem className="p-4 text-center text-gray-400 text-sm">
                  {notifications.length - 10} more notifications...
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
          ) : (
            <div className="py-8 text-center text-gray-400">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No notifications</p>
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
