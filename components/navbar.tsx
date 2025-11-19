'use client'

import { authService } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Wallet, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export function Navbar() {
  const router = useRouter()
  const [userName, setUserName] = useState<string>('')

  useEffect(() => {
    const user = authService.getCurrentUser()
    if (user) {
      setUserName(user.name)
    }
  }, [])

  const handleLogout = () => {
    authService.logout()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-600 p-2 rounded-lg">
            <Wallet className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-xl text-emerald-900">GastosApp</span>
        </div>

        <div className="flex items-center gap-4">
          {userName && (
            <span className="text-sm text-muted-foreground">
              Hola, <span className="font-medium text-foreground">{userName}</span>
            </span>
          )}
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </Button>
        </div>
      </div>
    </nav>
  )
}
