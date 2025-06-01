import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { NotificationsProvider } from "@/components/notifications-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Wholesale Clothing CRM",
  description: "Complete CRM system for wholesale clothing business",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NotificationsProvider>{children}</NotificationsProvider>
      </body>
    </html>
  )
}
