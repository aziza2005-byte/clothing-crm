"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Download, Edit, Users } from "lucide-react"
import * as XLSX from "xlsx"
import { useNotifications } from "@/components/notifications-provider"
import { DeleteDialog } from "@/components/delete-dialog"

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  city: string
  totalOrders: number
  totalSpent: number
  status: "active" | "inactive"
  joinDate: string
}

const generateCustomers = (): Customer[] => {
  const names = [
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

  const cities = ["Tashkent", "Samarkand", "Bukhara", "Andijan", "Namangan", "Fergana", "Nukus", "Termez"]

  return Array.from({ length: 60 }, (_, i) => ({
    id: (i + 1).toString(),
    name: i < names.length ? names[i] : `Customer ${i + 1}`,
    email: `customer${i + 1}@example.com`,
    phone: `+998 (${Math.floor(Math.random() * 90) + 10}) ${Math.floor(Math.random() * 900) + 100} - ${Math.floor(Math.random() * 90) + 10} - ${Math.floor(Math.random() * 90) + 10}`,
    address: `Street ${i + 1}, Building ${Math.floor(Math.random() * 50) + 1}`,
    city: cities[i % cities.length],
    totalOrders: Math.floor(Math.random() * 50) + 1,
    totalSpent: Math.floor(Math.random() * 10000) + 500,
    status: Math.random() > 0.1 ? "active" : "inactive",
    joinDate: new Date(2023, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
      .toISOString()
      .split("T")[0],
  }))
}

export default function CustomersPage() {
  const router = useRouter()
  const [language, setLanguage] = useState("en")
  const [customers, setCustomers] = useState<Customer[]>(generateCustomers())
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    status: "active",
  })

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
      customers: "Customers",
      customerManagement: "Customer Management",
      addCustomer: "Add Customer",
      exportData: "Export Data",
      search: "Search customers...",
      name: "Name",
      email: "Email",
      phone: "Phone",
      address: "Address",
      city: "City",
      totalOrders: "Total Orders",
      totalSpent: "Total Spent",
      status: "Status",
      actions: "Actions",
      active: "Active",
      inactive: "Inactive",
      joinDate: "Join Date",
      save: "Save",
      cancel: "Cancel",
      edit: "Edit",
      delete: "Delete",
      addNewCustomer: "Add New Customer",
      customerDetails: "Enter customer details",
    },
    uz: {
      customers: "Mijozlar",
      customerManagement: "Mijozlarni boshqarish",
      addCustomer: "Mijoz qo'shish",
      exportData: "Ma'lumotlarni eksport qilish",
      search: "Mijozlarni qidirish...",
      name: "Ism",
      email: "Email",
      phone: "Telefon",
      address: "Manzil",
      city: "Shahar",
      totalOrders: "Jami buyurtmalar",
      totalSpent: "Jami sarflangan",
      status: "Holat",
      actions: "Amallar",
      active: "Faol",
      inactive: "Nofaol",
      joinDate: "Qo'shilgan sana",
      save: "Saqlash",
      cancel: "Bekor qilish",
      edit: "Tahrirlash",
      delete: "O'chirish",
      addNewCustomer: "Yangi mijoz qo'shish",
      customerDetails: "Mijoz ma'lumotlarini kiriting",
    },
    ru: {
      customers: "Клиенты",
      customerManagement: "Управление клиентами",
      addCustomer: "Добавить клиента",
      exportData: "Экспорт данных",
      search: "Поиск клиентов...",
      name: "Имя",
      email: "Email",
      phone: "Телефон",
      address: "Адрес",
      city: "Город",
      totalOrders: "Всего заказов",
      totalSpent: "Всего потрачено",
      status: "Статус",
      actions: "Действия",
      active: "Активный",
      inactive: "Неактивный",
      joinDate: "Дата присоединения",
      save: "Сохранить",
      cancel: "Отмена",
      edit: "Редактировать",
      delete: "Удалить",
      addNewCustomer: "Добавить нового клиента",
      customerDetails: "Введите данные клиента",
    },
  }

  const t = translations[language as keyof typeof translations]

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.city.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddCustomer = () => {
    if (newCustomer.name && newCustomer.email && newCustomer.phone) {
      const customer: Customer = {
        id: (customers.length + 1).toString(),
        name: newCustomer.name,
        email: newCustomer.email,
        phone: newCustomer.phone,
        address: newCustomer.address || "",
        city: newCustomer.city || "",
        totalOrders: 0,
        totalSpent: 0,
        status: newCustomer.status as "active" | "inactive",
        joinDate: new Date().toISOString().split("T")[0],
      }
      setCustomers([...customers, customer])
      setNewCustomer({
        name: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        status: "active",
      })
      setIsAddDialogOpen(false)

      // Add comprehensive notifications
      addNotification({
        title: "New Customer Added",
        message: `${customer.name} has been successfully added to the customer database`,
        type: "success",
        autoClose: true,
        action: {
          label: "View Profile",
          onClick: () => {
            addNotification({
              title: "Customer Profile",
              message: `Viewing profile for ${customer.name}`,
              type: "info",
            })
          },
        },
      })

      // Welcome notification
      addNotification({
        title: "Welcome New Customer",
        message: `Send welcome email to ${customer.name} at ${customer.email}`,
        type: "info",
        autoClose: false,
        action: {
          label: "Send Email",
          onClick: () => {
            addNotification({
              title: "Welcome Email Sent",
              message: `Welcome email sent to ${customer.email}`,
              type: "success",
            })
          },
        },
      })
    }
  }

  const handleExport = () => {
    const worksheet = XLSX.utils.json_to_sheet(customers)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customers")
    XLSX.writeFile(workbook, "customers.xlsx")
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-600">{t.active}</Badge>
      case "inactive":
        return <Badge variant="secondary">{t.inactive}</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const handleEditCustomer = (customer: Customer) => {
    addNotification({
      title: "Editing Customer",
      message: `Opening edit form for ${customer.name}`,
      type: "info",
      autoClose: true,
    })
    // Add edit logic here
  }

  const handleDeleteCustomer = (customerId: string) => {
    const customerToDelete = customers.find((c) => c.id === customerId)
    setCustomers(customers.filter((customer) => customer.id !== customerId))

    if (customerToDelete) {
      addNotification({
        title: "Customer Deleted",
        message: `${customerToDelete.name} has been permanently removed from the database`,
        type: "success",
        autoClose: true,
        action: {
          label: "Undo",
          onClick: () => {
            setCustomers((prev) => [...prev, customerToDelete])
            addNotification({
              title: "Customer Restored",
              message: `${customerToDelete.name} has been restored to the database`,
              type: "success",
            })
          },
        },
      })
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">{t.customers}</h1>
            <p className="text-gray-300">{t.customerManagement}</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleExport}
              variant="outline"
              className="text-black bg-white border-gray-600 hover:bg-gray-100"
            >
              <Download className="h-4 w-4 mr-2" />
              {t.exportData}
            </Button>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  {t.addCustomer}
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 border-gray-700 text-white">
                <DialogHeader>
                  <DialogTitle>{t.addNewCustomer}</DialogTitle>
                  <DialogDescription className="text-gray-300">{t.customerDetails}</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t.name}</Label>
                      <Input
                        id="name"
                        value={newCustomer.name}
                        onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t.email}</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newCustomer.email}
                        onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t.phone}</Label>
                      <Input
                        id="phone"
                        value={newCustomer.phone}
                        onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                        placeholder="+998 (00) 000 - 00 - 00"
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">{t.city}</Label>
                      <Input
                        id="city"
                        value={newCustomer.city}
                        onChange={(e) => setNewCustomer({ ...newCustomer, city: e.target.value })}
                        placeholder="Uzbekistan, Tashkent"
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">{t.address}</Label>
                    <Input
                      id="address"
                      value={newCustomer.address}
                      onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                    {t.cancel}
                  </Button>
                  <Button onClick={handleAddCustomer} className="bg-blue-600 hover:bg-blue-700">
                    {t.save}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-white" />
                <CardTitle className="text-white">{t.customers}</CardTitle>
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
                  <TableHead className="text-gray-300">{t.name}</TableHead>
                  <TableHead className="text-gray-300">{t.email}</TableHead>
                  <TableHead className="text-gray-300">{t.phone}</TableHead>
                  <TableHead className="text-gray-300">{t.city}</TableHead>
                  <TableHead className="text-gray-300">{t.totalOrders}</TableHead>
                  <TableHead className="text-gray-300">{t.totalSpent}</TableHead>
                  <TableHead className="text-gray-300">{t.status}</TableHead>
                  <TableHead className="text-gray-300">{t.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id} className="border-gray-700">
                    <TableCell className="text-white font-medium">{customer.name}</TableCell>
                    <TableCell className="text-gray-300">{customer.email}</TableCell>
                    <TableCell className="text-gray-300">{customer.phone}</TableCell>
                    <TableCell className="text-gray-300">{customer.city}</TableCell>
                    <TableCell className="text-gray-300">{customer.totalOrders}</TableCell>
                    <TableCell className="text-gray-300">${customer.totalSpent}</TableCell>
                    <TableCell>{getStatusBadge(customer.status)}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-white border-gray-600"
                          onClick={() => handleEditCustomer(customer)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <DeleteDialog
                          itemName={customer.name}
                          onDelete={() => handleDeleteCustomer(customer.id)}
                          translations={{
                            delete: t.delete,
                            confirmDelete: "Confirm Delete",
                            deleteDescription: "Are you sure you want to delete {item}? This action cannot be undone.",
                            cancel: t.cancel,
                            confirm: "Delete",
                            deleteSuccess: "Customer deleted successfully",
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
