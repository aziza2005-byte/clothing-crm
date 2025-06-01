"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  LogOut,
  Menu,
  X,
  Globe,
  ShirtIcon,
  Settings,
} from "lucide-react"
import { NotificationsDropdown } from "@/components/notifications-provider"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [language, setLanguage] = useState("en")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "en"
    setLanguage(savedLanguage)
  }, [])

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
    window.location.reload()
  }

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    router.push("/")
  }

  const translations = {
    en: {
      dashboard: "Dashboard",
      products: "Products",
      customers: "Customers",
      orders: "Orders",
      settings: "Settings",
      logout: "Logout",
      wholesaleClothing: "StyleCRM",
      notifications: "Notifications",
    },
    uz: {
      dashboard: "Boshqaruv paneli",
      products: "Mahsulotlar",
      customers: "Mijozlar",
      orders: "Buyurtmalar",
      settings: "Sozlamalar",
      logout: "Chiqish",
      wholesaleClothing: "StyleCRM",
      notifications: "Bildirishnomalar",
    },
    ru: {
      dashboard: "Панель управления",
      products: "Продукты",
      customers: "Клиенты",
      orders: "Заказы",
      settings: "Настройки",
      logout: "Выход",
      wholesaleClothing: "StyleCRM",
      notifications: "Уведомления",
    },
  }

  const t = translations[language as keyof typeof translations]

  const navigation = [
    { name: t.dashboard, href: "/dashboard", icon: LayoutDashboard, color: "from-blue-500 to-purple-500" },
    { name: t.products, href: "/products", icon: Package, color: "from-emerald-500 to-teal-500" },
    { name: t.customers, href: "/customers", icon: Users, color: "from-orange-500 to-red-500" },
    { name: t.orders, href: "/orders", icon: ShoppingCart, color: "from-pink-500 to-rose-500" },
    { name: t.settings, href: "/settings", icon: Settings, color: "from-gray-500 to-slate-500" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/10 backdrop-blur-xl border-r border-white/20 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg">
                <ShirtIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-xl">{t.wholesaleClothing}</h1>
                <p className="text-white/60 text-sm">Fashion Management</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-white hover:bg-white/10"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-6 space-y-3">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? `bg-gradient-to-r ${item.color} text-white shadow-lg transform scale-105`
                      : "text-white/70 hover:bg-white/10 hover:text-white hover:transform hover:scale-105"
                  }`}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <div
                    className={`p-2 rounded-lg ${isActive ? "bg-white/20" : "bg-white/10 group-hover:bg-white/20"} transition-colors`}
                  >
                    <item.icon className="h-5 w-5" />
                  </div>
                  {item.name}
                  {isActive && <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>}
                </Link>
              )
            })}
          </nav>

          {/* Language Selector */}
          <div className="p-6 border-t border-white/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white/10 rounded-lg">
                <Globe className="h-4 w-4 text-white/70" />
              </div>
              <span className="text-sm text-white/70 font-medium">Language</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {["en", "uz", "ru"].map((lang) => (
                <Button
                  key={lang}
                  size="sm"
                  variant={language === lang ? "default" : "outline"}
                  onClick={() => handleLanguageChange(lang)}
                  className={`text-xs font-semibold transition-all duration-300 ${
                    language === lang
                      ? "bg-white text-black border-none shadow-lg hover:bg-gray-100"
                      : "text-black bg-white/80 border-white/30 hover:bg-white hover:text-black"
                  }`}
                >
                  {lang.toUpperCase()}
                </Button>
              ))}
            </div>
          </div>

          {/* Logout */}
          <div className="p-6 border-t border-white/20">
            <Button
              onClick={handleLogout}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white border-none shadow-lg transition-all duration-300 transform hover:scale-105"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t.logout}
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <div className="sticky top-0 z-30 bg-white/10 backdrop-blur-xl border-b border-white/20 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden text-white hover:bg-white/10 p-2"
                onClick={() => setIsSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="hidden lg:block">
                <h2 className="text-xl font-semibold text-white">
                  {navigation.find((nav) => nav.href === pathname)?.name || "Dashboard"}
                </h2>
                <p className="text-white/60 text-sm">Welcome back, Admin</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <NotificationsDropdown />
              <Link href="/settings">
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 p-2">
                  <Settings className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3 pl-3 border-l border-white/20">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">A</span>
                </div>
                <Badge className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white border-none">Admin</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6 relative z-10">{children}</main>
      </div>
    </div>
  )
}
