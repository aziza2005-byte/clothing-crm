"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Download, Eye, ShoppingCart } from "lucide-react"
import * as XLSX from "xlsx"
import { useNotifications } from "@/components/notifications-provider"
import { DeleteDialog } from "@/components/delete-dialog"

interface Order {
  id: string
  customerName: string
  customerEmail: string
  products: string[]
  totalAmount: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  orderDate: string
  shippingAddress: string
}

const generateOrders = (): Order[] => {
  const customers = [
    "Fashion Store A",
    "Retail Chain B",
    "Boutique C",
    "Store D",
    "Clothing Hub E",
    "Style Center F",
    "Fashion Point G",
    "Trendy Shop H",
    "Modern Wear I",
    "Classic Store J",
  ]

  const products = [
    "Classic White T-Shirt",
    "Blue Denim Jeans",
    "Summer Floral Dress",
    "Leather Jacket",
    "Cotton Polo Shirt",
    "Black Hoodie",
    "Casual Shorts",
    "Evening Dress",
  ]

  const statuses: Order["status"][] = ["pending", "processing", "shipped", "delivered", "cancelled"]

  return Array.from({ length: 150 }, (_, i) => ({
    id: `ORD-${String(i + 1).padStart(3, "0")}`,
    customerName: customers[i % customers.length],
    customerEmail: `customer${(i % 10) + 1}@example.com`,
    products: Array.from(
      { length: Math.floor(Math.random() * 3) + 1 },
      () => products[Math.floor(Math.random() * products.length)],
    ),
    totalAmount: Math.floor(Math.random() * 5000) + 100,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    orderDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
      .toISOString()
      .split("T")[0],
    shippingAddress: `Uzbekistan, Tashkent, Street ${i + 1}`,
  }))
}

export default function OrdersPage() {
  const router = useRouter()
  const [language, setLanguage] = useState("en")
  const [orders, setOrders] = useState<Order[]>(generateOrders())
  const [searchTerm, setSearchTerm] = useState("")
  const { addNotification } = useNotifications()

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      router.push("/")
    }
    const savedLanguage = localStorage.getItem("language") || "en"
    setLanguage(savedLanguage)
  }, [router])

  const translations = {
    en: {
      orders: "Orders",
      orderManagement: "Order Management",
      exportData: "Export Data",
      search: "Search orders...",
      orderId: "Order ID",
      customer: "Customer",
      products: "Products",
      totalAmount: "Total Amount",
      status: "Status",
      orderDate: "Order Date",
      actions: "Actions",
      pending: "Pending",
      processing: "Processing",
      shipped: "Shipped",
      delivered: "Delivered",
      cancelled: "Cancelled",
      view: "View",
      delete: "Delete",
      cancel: "Cancel",
    },
    uz: {
      orders: "Buyurtmalar",
      orderManagement: "Buyurtmalarni boshqarish",
      exportData: "Ma'lumotlarni eksport qilish",
      search: "Buyurtmalarni qidirish...",
      orderId: "Buyurtma ID",
      customer: "Mijoz",
      products: "Mahsulotlar",
      totalAmount: "Umumiy summa",
      status: "Holat",
      orderDate: "Buyurtma sanasi",
      actions: "Amallar",
      pending: "Kutilmoqda",
      processing: "Qayta ishlanmoqda",
      shipped: "Jo'natildi",
      delivered: "Yetkazildi",
      cancelled: "Bekor qilindi",
      view: "Ko'rish",
      delete: "O'chirish",
      cancel: "Bekor qilish",
    },
    ru: {
      orders: "Заказы",
      orderManagement: "Управление заказами",
      exportData: "Экспорт данных",
      search: "Поиск заказов...",
      orderId: "ID заказа",
      customer: "Клиент",
      products: "Продукты",
      totalAmount: "Общая сумма",
      status: "Статус",
      orderDate: "Дата заказа",
      actions: "Действия",
      pending: "В ожидании",
      processing: "Обработка",
      shipped: "Отправлено",
      delivered: "Доставлено",
      cancelled: "Отменено",
      view: "Просмотр",
      delete: "Удалить",
      cancel: "Отмена",
    },
  }

  const t = translations[language as keyof typeof translations]

  const filteredOrders = orders.filter(
    (order) =>
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(
      orders.map((order) => ({
        ...order,
        products: order.products.join(", "),
      })),
    )
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Orders")
    XLSX.writeFile(workbook, "orders.xlsx")
  }

  const handleDeleteOrder = (orderId: string) => {
    const orderToDelete = orders.find((o) => o.id === orderId)
    setOrders(orders.filter((order) => order.id !== orderId))

    if (orderToDelete) {
      addNotification({
        title: "Order Deleted",
        message: `${orderToDelete.id} has been permanently removed from the system`,
        type: "success",
        autoClose: true,
        action: {
          label: "Undo",
          onClick: () => {
            setOrders((prev) => [...prev, orderToDelete])
            addNotification({
              title: "Order Restored",
              message: `${orderToDelete.id} has been restored to the system`,
              type: "success",
            })
          },
        },
      })

      // Notify customer about order cancellation
      addNotification({
        title: "Customer Notification",
        message: `Cancellation notice sent to ${orderToDelete.customerName}`,
        type: "info",
        autoClose: false,
        action: {
          label: "Send Refund",
          onClick: () => {
            addNotification({
              title: "Refund Initiated",
              message: `Refund of $${orderToDelete.totalAmount} initiated for ${orderToDelete.customerName}`,
              type: "info",
            })
          },
        },
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: "bg-yellow-600",
      processing: "bg-blue-600",
      shipped: "bg-purple-600",
      delivered: "bg-green-600",
      cancelled: "bg-red-600",
    }

    return <Badge className={statusColors[status as keyof typeof statusColors]}>{t[status as keyof typeof t]}</Badge>
  }

  // Add these functions to handle order status changes:
  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    const order = orders.find((o) => o.id === orderId)
    if (!order) return

    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)))

    const statusMessages = {
      pending: "Order is now pending review",
      processing: "Order is being processed",
      shipped: "Order has been shipped",
      delivered: "Order has been delivered",
      cancelled: "Order has been cancelled",
    }

    addNotification({
      title: "Order Status Updated",
      message: `${order.id}: ${statusMessages[newStatus]}`,
      type: newStatus === "delivered" ? "success" : newStatus === "cancelled" ? "error" : "info",
      autoClose: true,
      action:
        newStatus === "shipped"
          ? {
              label: "Track Package",
              onClick: () => {
                addNotification({
                  title: "Tracking Information",
                  message: `Tracking details sent to ${order.customerEmail}`,
                  type: "info",
                })
              },
            }
          : undefined,
    })

    // Send customer notification
    if (newStatus === "shipped" || newStatus === "delivered") {
      addNotification({
        title: "Customer Notification",
        message: `${newStatus === "shipped" ? "Shipping" : "Delivery"} notification sent to ${order.customerName}`,
        type: "info",
        autoClose: false,
      })
    }
  }

  // Add bulk operations with notifications:
  const handleBulkStatusUpdate = (orderIds: string[], newStatus: Order["status"]) => {
    setOrders((prev) => prev.map((order) => (orderIds.includes(order.id) ? { ...order, status: newStatus } : order)))

    addNotification({
      title: "Bulk Update Complete",
      message: `${orderIds.length} orders updated to ${newStatus} status`,
      type: "success",
      autoClose: true,
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">{t.orders}</h1>
            <p className="text-gray-300">{t.orderManagement}</p>
          </div>
          <Button
            onClick={handleExport}
            variant="outline"
            className="text-black bg-white border-gray-600 hover:bg-gray-100"
          >
            <Download className="h-4 w-4 mr-2" />
            {t.exportData}
          </Button>
        </div>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5 text-white" />
                <CardTitle className="text-white">{t.orders}</CardTitle>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t.search}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">{t.orderId}</TableHead>
                  <TableHead className="text-gray-300">{t.customer}</TableHead>
                  <TableHead className="text-gray-300">{t.products}</TableHead>
                  <TableHead className="text-gray-300">{t.totalAmount}</TableHead>
                  <TableHead className="text-gray-300">{t.status}</TableHead>
                  <TableHead className="text-gray-300">{t.orderDate}</TableHead>
                  <TableHead className="text-gray-300">{t.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} className="border-gray-700">
                    <TableCell className="text-white font-medium">{order.id}</TableCell>
                    <TableCell className="text-gray-300">
                      <div>
                        <p className="font-medium">{order.customerName}</p>
                        <p className="text-sm text-gray-400">{order.customerEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">
                      <div className="max-w-48">
                        {order.products.slice(0, 2).join(", ")}
                        {order.products.length > 2 && "..."}
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-300">${order.totalAmount}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-gray-300">{order.orderDate}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="text-white border-gray-600">
                          <Eye className="h-4 w-4 mr-1" />
                          {t.view}
                        </Button>
                        <DeleteDialog
                          itemName={order.id}
                          onDelete={() => handleDeleteOrder(order.id)}
                          translations={{
                            delete: t.delete,
                            confirmDelete: "Confirm Delete",
                            deleteDescription:
                              "Are you sure you want to delete {item}? This action cannot be undone and will cancel the order.",
                            cancel: t.cancel,
                            confirm: "Delete",
                            deleteSuccess: "Order deleted successfully",
                          }}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
