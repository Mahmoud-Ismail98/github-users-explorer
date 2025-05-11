"use client"

import type { User } from "@/types"
import { Card, CardContent, CardFooter } from "./ui/card"
import { Button } from "./ui/button"
import { ExternalLink, Star } from "lucide-react"
import Image from "next/image"
import { useUserStore } from "@/store/users"

interface UserCardProps {
  user: User
  showFavoriteButton?: boolean
  isFavorite?: boolean
}

export function UserCard({ user, showFavoriteButton = false, isFavorite = false }: UserCardProps) {
  const { addFavorite, removeFavorite } = useUserStore()

  const handleFavoriteToggle = () => {
    if (isFavorite) {
      removeFavorite(user.id)
    } else {
      addFavorite(user)
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <Image
            src={user.avatar_url || "/placeholder.svg"}
            alt={user.login}
            width={48}
            height={48}
            className="rounded-full"
          />
          <div>
            <h3 className="font-medium">{user.login}</h3>
            <p className="text-sm text-muted-foreground">ID: {user.id}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-4 pt-0">
        <a href={user.html_url} target="_blank" rel="noopener noreferrer" className="inline-flex">
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            View Profile
          </Button>
        </a>
        {showFavoriteButton && (
          <Button variant={isFavorite ? "default" : "outline"} size="sm" onClick={handleFavoriteToggle}>
            <Star className={`h-4 w-4 mr-2 ${isFavorite ? "fill-current" : ""}`} />
            {isFavorite ? "Favorited" : "Favorite"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
