"use client"
import { useUserStore } from "@/store/users"
import { useEffect } from "react"
import SearchBar from "@/components/search-bar"

export default function Favorites() {
  const { favorites, hydrate } = useUserStore()

  useEffect(() => {
    hydrate()
  }, [])

  return (
    <>
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Favorites</h1>
        <SearchBar />
        {favorites.length === 0 ? (
          <p className="text-center text-gray-500">No favorites added yet.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {favorites.map((user) => (
              <div
                key={user.id}
                className="border rounded-lg p-4 shadow-md hover:shadow-lg transition"
              >
                <img
                  src={user.avatar_url}
                  alt={user.login}
                  className="h-12 w-12 rounded-full mb-4"
                />
                <h3 className="font-medium">{user.login}</h3>
                <a
                  href={user.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View Profile
                </a>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  )
}