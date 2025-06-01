"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, ShirtIcon, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === "Admin" && password === "1234") {
      localStorage.setItem("isAuthenticated", "true")
      router.push("/dashboard")
    } else {
      setError("Invalid credentials")
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.03'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo and brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-2xl mb-4 shadow-2xl">
              <ShirtIcon className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              StyleCRM
            </h1>
            <p className="text-emerald-200/80 text-lg">Wholesale Fashion Management</p>
          </div>

          <Card className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-2xl">
            <CardHeader className="text-center space-y-4 pb-6">
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-400" />
                <CardTitle className="text-2xl font-bold text-black">Welcome Back</CardTitle>
                <Sparkles className="w-5 h-5 text-cyan-400" />
              </div>
              <CardDescription className="text-black/70 text-base">Sign in to access your dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="username" className="text-black font-semibold text-sm">
                    Username
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-12 bg-white/20 border-white/30 text-black placeholder:text-black/50 rounded-xl backdrop-blur-sm"
                    placeholder="Enter your username"
                    required
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="password" className="text-black font-semibold text-sm">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-12 bg-white/20 border-white/30 text-black placeholder:text-black/50 pr-12 rounded-xl backdrop-blur-sm"
                      placeholder="Enter your password"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-4 text-black/70 hover:text-black hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </Button>
                  </div>
                </div>
                {error && (
                  <div className="p-3 bg-red-500/20 border border-red-500/30 rounded-xl">
                    <p className="text-red-300 text-sm font-medium">{error}</p>
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                >
                  Sign In
                </Button>
              </form>

              <div className="text-center pt-4 border-t border-white/20">
                <p className="text-black/60 text-sm">
                  Demo credentials: <span className="font-semibold text-black">Admin / 1234</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
