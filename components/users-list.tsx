"use client"

import { useEffect, useState } from "react"
import { useUserStore } from "@/store/users"
import { UserCard } from "./user-card"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { AlertCircle, Loader2, RefreshCw } from "lucide-react"
import { Skeleton } from "./ui/skeleton"
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll"
import { Button } from "./ui/button"
import { ErrorBoundary } from "./error-boundary"

export default function UsersList() {
  const { users, loading, error, fetchUsers, loadMoreUsers, searchQuery, favorites, retryCount, isInitialLoading } =
    useUserStore()
  const [mounted, setMounted] = useState(false)

  // Set up infinite scroll
  const { targetRef } = useInfiniteScroll(() => {
    if (!searchQuery && mounted && !loading && !error) {
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

  // Initial loading state
  if (isInitialLoading) {
    return (
      <div className="py-12">
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p className="text-lg font-medium">Loading GitHub users...</p>
          <p className="text-sm text-muted-foreground mt-2">This may take a moment while we fetch the data</p>
        </div>
        <UsersListSkeleton />
      </div>
    )
  }

  // Error state with retry button
  if (error) {
    return (
      <Alert variant="destructive" className="my-6">
        <AlertCircle className="h-5 w-5" />
        <div className="ml-3">
          <AlertTitle>Failed to load users</AlertTitle>
          <AlertDescription className="mt-2">
            <p className="text-sm mb-4">
              {error} {retryCount > 0 && `(Retry attempt: ${retryCount})`}
            </p>
            <Button variant="outline" size="sm" onClick={() => fetchUsers()} className="flex items-center">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try again
            </Button>
          </AlertDescription>
        </div>
      </Alert>
    )
  }

  // Filter users based on search query
  const filteredUsers = searchQuery
    ? users.filter((user) => user.login.toLowerCase().includes(searchQuery.toLowerCase()))
    : users

  return (
    <ErrorBoundary>
      <div className="space-y-6 mt-6">
        {filteredUsers.length === 0 && !loading ? (
          <div className="text-center py-12 border rounded-lg">
            <h2 className="text-xl font-medium mb-2">No users found</h2>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? `No results match "${searchQuery}"` : "Try adjusting your search or filters"}
            </p>
            {searchQuery && (
              <Button variant="outline" onClick={() => useUserStore.getState().setSearchQuery("")}>
                Clear search
              </Button>
            )}
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
            {/* Loading indicator and intersection observer target */}
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
    </ErrorBoundary>
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
