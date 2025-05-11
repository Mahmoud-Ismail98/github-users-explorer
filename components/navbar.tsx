"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ModeToggle } from "./mode-toggle"
import { Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUserStore } from "@/store/users"
import { useEffect, useState } from "react"
import { Badge } from "./ui/badge"

export default function Navbar() {
  const pathname = usePathname()
  const { favorites } = useUserStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center px-4">
        <div className="mr-8 flex items-center">
          <Users className="h-6 w-6 mr-2" />
          <span className="text-lg font-bold">GitHub Explorer</span>
        </div>
        <nav className="flex flex-1 items-center space-x-4 lg:space-x-6">
          <Link
            href="/"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === "/" ? "text-primary" : "text-muted-foreground",
            )}
          >
            Users
          </Link>
          <Link
            href="/favorites"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary flex items-center",
              pathname === "/favorites" ? "text-primary" : "text-muted-foreground",
            )}
          >
            Favorites
            {mounted && favorites.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {favorites.length}
              </Badge>
            )}
          </Link>
        </nav>
        <div className="ml-auto">
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
