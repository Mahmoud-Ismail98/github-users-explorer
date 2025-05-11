"use client"

import { useEffect, useState } from "react"
import { useUserStore } from "@/store/users"
import { UserCard } from "./user-card"
import { Alert, AlertDescription } from "./ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { Skeleton } from "./ui/skeleton"
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll"

export default function UsersList() {
  const { users, loading, error, fetchUsers, loadMoreUsers, searchQuery, favorites } = useUserStore()
  const [mounted, setMounted] = useState(false)

  const { targetRef } = useInfiniteScroll(() => {
    if (!searchQuery && mounted && !loading) {
      loadMoreUsers()
    }
  })

  useEffect(() => {
    setMounted(true)
    fetchUsers()
  }, [fetchUsers])

  if (!mounted) {
    return <UsersListSkeleton />
  }

  if (error) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  const filteredUsers = searchQuery
    ? users.filter((user) => user.login.toLowerCase().includes(searchQuery.toLowerCase()))
    : users

  return (
    <div className="space-y-6 mt-6">
      {filteredUsers.length === 0 && !loading ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-2">No users found</h2>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredUsers.map((user, index) => (
              <UserCard
                key={`${user.id}-${index}`}
                user={user}
                showFavoriteButton={true}
                isFavorite={favorites.some((fav) => fav.id === user.id)}
              />
            ))}
          </div>

          <div ref={targetRef} className="py-8 flex justify-center">
            {loading && (
              <div className="flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Loading more users...</span>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

function UsersListSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
      {Array(6)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[100px]" />
              </div>
            </div>
            <Skeleton className="h-8 w-full" />
          </div>
        ))}
    </div>
  )
}
