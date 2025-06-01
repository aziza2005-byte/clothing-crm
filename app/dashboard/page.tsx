"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  Users,
  Package,
  DollarSign,
  ShoppingCart,
  AlertTriangle,
  LucidePieChart,
  ArrowUp,
  ArrowDown,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
} from "recharts"
import { useNotifications } from "@/components/notifications-provider"

const salesData = [
  { month: "Jan", sales: 45000, orders: 120 },
  { month: "Feb", sales: 52000, orders: 145 },
  { month: "Mar", sales: 48000, orders: 135 },
  { month: "Apr", sales: 61000, orders: 168 },
  { month: "May", sales: 55000, orders: 152 },
  { month: "Jun", sales: 67000, orders: 189 },
]

const categoryData = [
  { name: "T-Shirts", value: 35, color: "#10B981" },
  { name: "Jeans", value: 25, color: "#3B82F6" },
  { name: "Dresses", value: 20, color: "#F59E0B" },
  { name: "Jackets", value: 15, color: "#EF4444" },
  { name: "Others", value: 5, color: "#8B5CF6" },
]

export default function Dashboard() {
  const router = useRouter()
  const [language, setLanguage] = useState("en")
  const { addNotification } = useNotifications()

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      router.push("/")
    }
    const savedLanguage = localStorage.getItem("language") || "en"
    setLanguage(savedLanguage)
  }, [router])

  useEffect(() => {
    // Generate periodic business insights
    const insightInterval = setInterval(() => {
      const insights = [
        {
          title: "Sales Milestone",
          message: "Congratulations! You've reached $50,000 in monthly sales",
          type: "success" as const,
        },
        {
          title: "Inventory Alert",
          message: "5 products are running low on stock and need reordering",
          type: "warning" as const,
          action: {
            label: "View Items",
            onClick: () => router.push("/products"),
          },
        },
        {
          title: "Customer Growth",
          message: "10 new customers joined this week",
          type: "info" as const,
        },
        {
          title: "Payment Reminder",
          message: "3 invoices are overdue and require attention",
          type: "warning" as const,
        },
      ]

      if (Math.random() > 0.8) {
        const randomInsight = insights[Math.floor(Math.random() * insights.length)]
        addNotification(randomInsight)
      }
    }, 45000) // Every 45 seconds

    return () => clearInterval(insightInterval)
  }, [addNotification, router])

  // Add performance notifications
  useEffect(() => {
    // Simulate performance monitoring
    const performanceCheck = setInterval(() => {
      const metrics = [
        {
          title: "System Performance",
          message: "All systems running optimally",
          type: "success" as const,
        },
        {
          title: "Backup Complete",
          message: "Daily data backup completed successfully",
          type: "success" as const,
        },
        {
          title: "Security Scan",
          message: "Weekly security scan completed - no issues found",
          type: "success" as const,
        },
      ]

      if (Math.random() > 0.9) {
        const randomMetric = metrics[Math.floor(Math.random() * metrics.length)]
        addNotification(randomMetric)
      }
    }, 60000) // Every minute

    return () => clearInterval(performanceCheck)
  }, [addNotification])

  const translations = {
    en: {
      dashboard: "Dashboard",
      overview: "Business Overview",
      totalRevenue: "Total Revenue",
      totalOrders: "Total Orders",
      totalCustomers: "Total Customers",
      totalProducts: "Total Products",
      salesTrend: "Sales Trend",
      productCategories: "Product Categories",
      recentOrders: "Recent Orders",
      lowStock: "Low Stock Alert",
      orderStatus: "Order Status",
      pending: "Pending",
      processing: "Processing",
      shipped: "Shipped",
      delivered: "Delivered",
      thisMonth: "This month",
      vsLastMonth: "vs last month",
    },
    uz: {
      dashboard: "Boshqaruv paneli",
      overview: "Biznes ko'rinishi",
      totalRevenue: "Umumiy daromad",
      totalOrders: "Umumiy buyurtmalar",
      totalCustomers: "Umumiy mijozlar",
      totalProducts: "Umumiy mahsulotlar",
      salesTrend: "Sotuv tendentsiyasi",
      productCategories: "Mahsulot toifalari",
      recentOrders: "So'nggi buyurtmalar",
      lowStock: "Kam qoldiq ogohlantirishi",
      orderStatus: "Buyurtma holati",
      pending: "Kutilmoqda",
      processing: "Qayta ishlanmoqda",
      shipped: "Jo'natildi",
      delivered: "Yetkazildi",
      thisMonth: "Bu oy",
      vsLastMonth: "o'tgan oyga nisbatan",
    },
    ru: {
      dashboard: "Панель управления",
      overview: "Обзор бизнеса",
      totalRevenue: "Общий доход",
      totalOrders: "Общие заказы",
      totalCustomers: "Общие клиенты",
      totalProducts: "Общие продукты",
      salesTrend: "Тенденция продаж",
      productCategories: "Категории продуктов",
      recentOrders: "Недавние заказы",
      lowStock: "Предупреждение о низком запасе",
      orderStatus: "Статус заказа",
      pending: "В ожидании",
      processing: "Обработка",
      shipped: "Отправлено",
      delivered: "Доставлено",
      thisMonth: "В этом месяце",
      vsLastMonth: "по сравнению с прошлым месяцем",
    },
  }

  const t = translations[language as keyof typeof translations]

  const statsCards = [
    {
      title: t.totalRevenue,
      value: "$328,000",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      gradient: "from-emerald-500 to-teal-500",
      bgGradient: "from-emerald-500/20 to-teal-500/20",
    },
    {
      title: t.totalOrders,
      value: "1,209",
      change: "+8.2%",
      trend: "up",
      icon: ShoppingCart,
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/20 to-cyan-500/20",
    },
    {
      title: t.totalCustomers,
      value: "60",
      change: "+5.0%",
      trend: "up",
      icon: Users,
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-500/20 to-pink-500/20",
    },
    {
      title: t.totalProducts,
      value: "50",
      change: "-2.1%",
      trend: "down",
      icon: Package,
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-500/20 to-red-500/20",
    },
  ]

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">{t.dashboard}</h1>
          <p className="text-white/70 text-lg">{t.overview}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((card, index) => (
            <Card
              key={index}
              className="bg-white/10 backdrop-blur-xl border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-white/80">{card.title}</CardTitle>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${card.bgGradient}`}>
                  <card.icon className="h-5 w-5 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white mb-2">{card.value}</div>
                <div className="flex items-center gap-2">
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      card.trend === "up" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {card.trend === "up" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                    {card.change}
                  </div>
                  <span className="text-white/60 text-xs">{t.vsLastMonth}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                </div>
                {t.salesTrend}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(17, 24, 39, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "12px",
                      color: "#F9FAFB",
                      backdropFilter: "blur(12px)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="sales"
                    stroke="url(#salesGradient)"
                    strokeWidth={3}
                    dot={{ fill: "#3B82F6", strokeWidth: 2, r: 6 }}
                  />
                  <defs>
                    <linearGradient id="salesGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="100%" stopColor="#8B5CF6" />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-lg">
                  <LucidePieChart className="h-5 w-5 text-emerald-400" />
                </div>
                {t.productCategories}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RechartsPieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(17, 24, 39, 0.8)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      borderRadius: "12px",
                      color: "#F9FAFB",
                      backdropFilter: "blur(12px)",
                    }}
                  />
                </RechartsPieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders and Low Stock */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
                  <ShoppingCart className="h-5 w-5 text-purple-400" />
                </div>
                {t.recentOrders}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { id: "ORD-001", customer: "Fashion Store A", amount: "$2,450", status: "pending" },
                  { id: "ORD-002", customer: "Retail Chain B", amount: "$5,200", status: "processing" },
                  { id: "ORD-003", customer: "Boutique C", amount: "$1,800", status: "shipped" },
                  { id: "ORD-004", customer: "Store D", amount: "$3,100", status: "delivered" },
                ].map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-white">{order.id}</p>
                      <p className="text-sm text-white/70">{order.customer}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-white">{order.amount}</p>
                      <Badge
                        className={`${
                          order.status === "delivered"
                            ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
                            : order.status === "shipped"
                              ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                              : order.status === "processing"
                                ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                : "bg-gray-500/20 text-gray-400 border-gray-500/30"
                        } border`}
                      >
                        {t[order.status as keyof typeof t]}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                {t.lowStock}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Classic White T-Shirt", stock: 5, total: 100 },
                  { name: "Blue Denim Jeans", stock: 8, total: 50 },
                  { name: "Summer Dress", stock: 3, total: 30 },
                  { name: "Leather Jacket", stock: 2, total: 20 },
                ].map((item, index) => (
                  <div key={index} className="space-y-3 p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="flex justify-between text-sm">
                      <span className="text-white font-medium">{item.name}</span>
                      <span className="text-white/70">
                        {item.stock}/{item.total}
                      </span>
                    </div>
                    <Progress value={(item.stock / item.total) * 100} className="h-2 bg-white/10" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
