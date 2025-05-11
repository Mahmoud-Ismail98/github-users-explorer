"use client"

import { useEffect, useState } from "react"
import { useUserStore } from "@/store/users"
import { UserCard } from "@/components/user-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function FavoritesPage() {
  const { favorites } = useUserStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex items-center mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Favorite Users</h1>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2">No favorites yet</h2>
          <p className="text-muted-foreground mb-6">Add some GitHub users to your favorites list</p>
          <Link href="/">
            <Button>Browse Users</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((user) => (
            <UserCard key={user.id} user={user} showFavoriteButton={true} isFavorite={true} />
          ))}
        </div>
      )}
    </main>
  )
}
