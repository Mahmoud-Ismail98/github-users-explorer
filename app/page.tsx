import { Suspense } from "react"
import UsersList from "@/components/users-list"
import Navbar from "@/components/navbar"

export default function Home() {
  return (
    <>
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
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="p-4 border rounded-md shadow-sm bg-gray-100 animate-pulse">
            <div className="h-12 w-12 bg-gray-300 rounded-full mb-4"></div>
            <div className="h-4 w-3/4 bg-gray-300 rounded mb-2"></div>
            <div className="h-4 w-1/2 bg-gray-300 rounded"></div>
          </div>
        ))}
    </div>
  )
}
