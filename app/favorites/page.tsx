"use client"

import Navbar from "@/components/navbar"
import { useUserStore } from "@/store/users"
import { useEffect } from "react"

export default function Favorites() {
  const { favorites, hydrate } = useUserStore()

  useEffect(() => {
    hydrate() 
  }, [])

  return (
    <>
      <Navbar />
      <main className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Favorites</h1>
        {favorites.length === 0 ? (
          <p>No favorites added yet.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {favorites.map((user) => (
              <a
                key={user.id}
                href={user.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="border rounded-lg p-4 block hover:bg-gray-100 transition"
              >
                <img src={user.avatar_url} alt={user.login} className="h-12 w-12 rounded-full mb-2" />
                <h3 className="font-medium">{user.login}</h3>
              </a>
            ))}
          </div>
        )}
      </main>
    </>
  )
}