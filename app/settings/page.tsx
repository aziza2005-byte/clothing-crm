"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useNotifications } from "@/components/notifications-provider"
import { SettingsIcon, User, Bell, Globe, Shield, Save } from "lucide-react"

export default function SettingsPage() {
  const router = useRouter()
  const { addNotification } = useNotifications()
  const [language, setLanguage] = useState("en")
  const [formState, setFormState] = useState({
    profile: {
      name: "Admin",
      email: "admin@stylecrm.com",
      phone: "+998 (90) 123-45-67",
      company: "StyleCRM",
      position: "Administrator",
      bio: "System administrator for the StyleCRM wholesale clothing management system.",
    },
    notifications: {
      emailNotifications: true,
      orderNotifications: true,
      stockAlerts: true,
      paymentNotifications: true,
      systemUpdates: false,
      marketingEmails: false,
    },
    system: {
      language: "en",
      timezone: "Asia/Tashkent",
      dateFormat: "DD/MM/YYYY",
      currency: "USD",
      theme: "dark",
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: "30",
      passwordExpiry: "90",
    },
  })

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated")
    if (!isAuthenticated) {
      router.push("/")
    }
    const savedLanguage = localStorage.getItem("language") || "en"
    setLanguage(savedLanguage)
    setFormState((prev) => ({
      ...prev,
      system: {
        ...prev.system,
        language: savedLanguage,
      },
    }))
  }, [router])

  const translations = {
    en: {
      settings: "Settings",
      systemSettings: "System Settings",
      profile: "Profile",
      notifications: "Notifications",
      system: "System",
      security: "Security",
      personalInfo: "Personal Information",
      name: "Name",
      email: "Email",
      phone: "Phone",
      company: "Company",
      position: "Position",
      bio: "Bio",
      notificationPreferences: "Notification Preferences",
      emailNotifications: "Email Notifications",
      orderNotifications: "Order Notifications",
      stockAlerts: "Stock Alerts",
      paymentNotifications: "Payment Notifications",
      systemUpdates: "System Updates",
      marketingEmails: "Marketing Emails",
      systemPreferences: "System Preferences",
      language: "Language",
      timezone: "Timezone",
      dateFormat: "Date Format",
      currency: "Currency",
      theme: "Theme",
      securitySettings: "Security Settings",
      twoFactorAuth: "Two-Factor Authentication",
      sessionTimeout: "Session Timeout (minutes)",
      passwordExpiry: "Password Expiry (days)",
      saveChanges: "Save Changes",
      settingsSaved: "Settings saved successfully",
    },
    uz: {
      settings: "Sozlamalar",
      systemSettings: "Tizim sozlamalari",
      profile: "Profil",
      notifications: "Bildirishnomalar",
      system: "Tizim",
      security: "Xavfsizlik",
      personalInfo: "Shaxsiy ma'lumotlar",
      name: "Ism",
      email: "Email",
      phone: "Telefon",
      company: "Kompaniya",
      position: "Lavozim",
      bio: "Bio",
      notificationPreferences: "Bildirishnoma sozlamalari",
      emailNotifications: "Email bildirishnomalari",
      orderNotifications: "Buyurtma bildirishnomalari",
      stockAlerts: "Qoldiq ogohlantirishlari",
      paymentNotifications: "To'lov bildirishnomalari",
      systemUpdates: "Tizim yangilanishlari",
      marketingEmails: "Marketing emaillar",
      systemPreferences: "Tizim sozlamalari",
      language: "Til",
      timezone: "Vaqt mintaqasi",
      dateFormat: "Sana formati",
      currency: "Valyuta",
      theme: "Mavzu",
      securitySettings: "Xavfsizlik sozlamalari",
      twoFactorAuth: "Ikki faktorli autentifikatsiya",
      sessionTimeout: "Sessiya muddati (daqiqa)",
      passwordExpiry: "Parol muddati (kun)",
      saveChanges: "O'zgarishlarni saqlash",
      settingsSaved: "Sozlamalar muvaffaqiyatli saqlandi",
    },
    ru: {
      settings: "Настройки",
      systemSettings: "Системные настройки",
      profile: "Профиль",
      notifications: "Уведомления",
      system: "Система",
      security: "Безопасность",
      personalInfo: "Личная информация",
      name: "Имя",
      email: "Email",
      phone: "Телефон",
      company: "Компания",
      position: "Должность",
      bio: "Биография",
      notificationPreferences: "Настройки уведомлений",
      emailNotifications: "Email уведомления",
      orderNotifications: "Уведомления о заказах",
      stockAlerts: "Оповещения о запасах",
      paymentNotifications: "Уведомления о платежах",
      systemUpdates: "Обновления системы",
      marketingEmails: "Маркетинговые письма",
      systemPreferences: "Системные настройки",
      language: "Язык",
      timezone: "Часовой пояс",
      dateFormat: "Формат даты",
      currency: "Валюта",
      theme: "Тема",
      securitySettings: "Настройки безопасности",
      twoFactorAuth: "Двухфакторная аутентификация",
      sessionTimeout: "Тайм-аут сессии (минуты)",
      passwordExpiry: "Срок действия пароля (дни)",
      saveChanges: "Сохранить изменения",
      settingsSaved: "Настройки успешно сохранены",
    },
  }

  const t = translations[language as keyof typeof translations]

  const handleInputChange = (section: keyof typeof formState, field: string, value: string | boolean) => {
    setFormState((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const handleSaveChanges = () => {
    // Save language to localStorage
    localStorage.setItem("language", formState.system.language)

    // Show success notification
    addNotification({
      title: t.settingsSaved,
      message: new Date().toLocaleTimeString(),
      type: "success",
    })

    // If language changed, reload the page
    if (language !== formState.system.language) {
      setLanguage(formState.system.language)
      setTimeout(() => {
        window.location.reload()
      }, 500)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">{t.settings}</h1>
          <p className="text-gray-300">{t.systemSettings}</p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-gray-800/50 border border-gray-700">
            <TabsTrigger value="profile" className="data-[state=active]:bg-gray-700 text-white">
              <User className="h-4 w-4 mr-2" />
              {t.profile}
            </TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-gray-700 text-white">
              <Bell className="h-4 w-4 mr-2" />
              {t.notifications}
            </TabsTrigger>
            <TabsTrigger value="system" className="data-[state=active]:bg-gray-700 text-white">
              <SettingsIcon className="h-4 w-4 mr-2" />
              {t.system}
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-gray-700 text-white">
              <Shield className="h-4 w-4 mr-2" />
              {t.security}
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg">
                    <User className="h-5 w-5 text-blue-400" />
                  </div>
                  {t.personalInfo}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Update your personal information and profile details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">
                      {t.name}
                    </Label>
                    <Input
                      id="name"
                      value={formState.profile.name}
                      onChange={(e) => handleInputChange("profile", "name", e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">
                      {t.email}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formState.profile.email}
                      onChange={(e) => handleInputChange("profile", "email", e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-white">
                      {t.phone}
                    </Label>
                    <Input
                      id="phone"
                      value={formState.profile.phone}
                      onChange={(e) => handleInputChange("profile", "phone", e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-white">
                      {t.company}
                    </Label>
                    <Input
                      id="company"
                      value={formState.profile.company}
                      onChange={(e) => handleInputChange("profile", "company", e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position" className="text-white">
                      {t.position}
                    </Label>
                    <Input
                      id="position"
                      value={formState.profile.position}
                      onChange={(e) => handleInputChange("profile", "position", e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-white">
                    {t.bio}
                  </Label>
                  <Textarea
                    id="bio"
                    value={formState.profile.bio}
                    onChange={(e) => handleInputChange("profile", "bio", e.target.value)}
                    className="bg-white/10 border-white/20 text-white"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg">
                    <Bell className="h-5 w-5 text-purple-400" />
                  </div>
                  {t.notificationPreferences}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Configure which notifications you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  {[
                    { id: "emailNotifications", label: t.emailNotifications },
                    { id: "orderNotifications", label: t.orderNotifications },
                    { id: "stockAlerts", label: t.stockAlerts },
                    { id: "paymentNotifications", label: t.paymentNotifications },
                    { id: "systemUpdates", label: t.systemUpdates },
                    { id: "marketingEmails", label: t.marketingEmails },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <Label htmlFor={item.id} className="text-white cursor-pointer">
                        {item.label}
                      </Label>
                      <Switch
                        id={item.id}
                        checked={formState.notifications[item.id as keyof typeof formState.notifications] as boolean}
                        onCheckedChange={(checked) => handleInputChange("notifications", item.id, checked)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system">
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-lg">
                    <Globe className="h-5 w-5 text-emerald-400" />
                  </div>
                  {t.systemPreferences}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Configure system-wide settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="language" className="text-white">
                      {t.language}
                    </Label>
                    <Select
                      value={formState.system.language}
                      onValueChange={(value) => handleInputChange("system", "language", value)}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="uz">Uzbek</SelectItem>
                        <SelectItem value="ru">Russian</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone" className="text-white">
                      {t.timezone}
                    </Label>
                    <Select
                      value={formState.system.timezone}
                      onValueChange={(value) => handleInputChange("system", "timezone", value)}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        <SelectItem value="Asia/Tashkent">Asia/Tashkent (UTC+5)</SelectItem>
                        <SelectItem value="Europe/Moscow">Europe/Moscow (UTC+3)</SelectItem>
                        <SelectItem value="Europe/London">Europe/London (UTC+0)</SelectItem>
                        <SelectItem value="America/New_York">America/New_York (UTC-5)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dateFormat" className="text-white">
                      {t.dateFormat}
                    </Label>
                    <Select
                      value={formState.system.dateFormat}
                      onValueChange={(value) => handleInputChange("system", "dateFormat", value)}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select date format" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-white">
                      {t.currency}
                    </Label>
                    <Select
                      value={formState.system.currency}
                      onValueChange={(value) => handleInputChange("system", "currency", value)}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select currency" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        <SelectItem value="USD">USD ($)</SelectItem>
                        <SelectItem value="UZS">UZS (сўм)</SelectItem>
                        <SelectItem value="EUR">EUR (€)</SelectItem>
                        <SelectItem value="RUB">RUB (₽)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="theme" className="text-white">
                      {t.theme}
                    </Label>
                    <Select
                      value={formState.system.theme}
                      onValueChange={(value) => handleInputChange("system", "theme", value)}
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700 text-white">
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-lg">
                    <Shield className="h-5 w-5 text-orange-400" />
                  </div>
                  {t.securitySettings}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Configure security settings and access controls
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="twoFactorAuth" className="text-white cursor-pointer">
                      {t.twoFactorAuth}
                    </Label>
                    <Switch
                      id="twoFactorAuth"
                      checked={formState.security.twoFactorAuth}
                      onCheckedChange={(checked) => handleInputChange("security", "twoFactorAuth", checked)}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeout" className="text-white">
                        {t.sessionTimeout}
                      </Label>
                      <Select
                        value={formState.security.sessionTimeout}
                        onValueChange={(value) => handleInputChange("security", "sessionTimeout", value)}
                      >
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Select timeout" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          <SelectItem value="15">15 minutes</SelectItem>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="60">60 minutes</SelectItem>
                          <SelectItem value="120">2 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="passwordExpiry" className="text-white">
                        {t.passwordExpiry}
                      </Label>
                      <Select
                        value={formState.security.passwordExpiry}
                        onValueChange={(value) => handleInputChange("security", "passwordExpiry", value)}
                      >
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Select expiry" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-700 text-white">
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="60">60 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
                          <SelectItem value="180">180 days</SelectItem>
                          <SelectItem value="365">365 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button
            onClick={handleSaveChanges}
            className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            {t.saveChanges}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
