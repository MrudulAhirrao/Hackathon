import { useEffect, useState } from "react"
import LoginPage from "@/Authentication/LoginPage"

export default function SplashScreen() {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1500)
    return () => clearTimeout(timer)
  }, [])

  if (!showSplash) return <LoginPage />

  return (
    <div className="h-screen w-full bg-black flex flex-col items-center justify-center text-white transition-all duration-500">
      <div className="text-4xl font-bold tracking-wide animate-pulse">Kshitij</div>
      <p className="mt-2 text-sm text-gray-400">Multi-tool Secure Portal</p>
    </div>
  )
}
