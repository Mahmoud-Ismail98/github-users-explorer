import { Suspense } from "react"
import UsersList from "@/components/users-list"
import { Skeleton } from "@/components/ui/skeleton"
import Navbar from "@/components/navbar"

export default function Home() {
  return (
    <>
      <Navbar />
    <main className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">GitHub Users</h1>
      <Suspense fallback={<UsersListSkeleton />}>
        <UsersList />
      </Suspense>
    </main>
    </>
  )
}

function UsersListSkeleton() {
  return (
    <div className="space-y-4 mt-6">
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="flex items-center space-x-4 p-4 border rounded-md">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
        ))}
    </div>
  )
}
