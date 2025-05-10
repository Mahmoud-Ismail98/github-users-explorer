"use client"

import { useEffect, useState } from "react"
import { useUserStore } from "@/store/users"

interface User {
  id: number
  login: string
  avatar_url: string
  html_url: string
}

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const usersPerPage = 10

  // Zustand store actions
  const { favorites, addFavorite, removeFavorite } = useUserStore()

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true)
      try {
        const response = await fetch("https://api.github.com/users")
        const data = await response.json()
        setUsers(data)
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const filteredUsers = users.filter((user) =>
    user.login.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage)
  const startIndex = (currentPage - 1) * usersPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage)

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))
  }

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1))
  }

  const handleFirstPage = () => {
    setCurrentPage(1)
  }

  const handleLastPage = () => {
    setCurrentPage(totalPages)
  }

  const toggleFavorite = (user: User) => {
    if (favorites.some((fav) => fav.id === user.id)) {
      removeFavorite(user.id) 
    } else {
      addFavorite(user) 
    }
  }

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <div className="space-y-6 mt-6">
      <input
        type="text"
        placeholder="Search users..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-4 py-2 border rounded-md mb-4"
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {paginatedUsers.map((user) => (
          <div key={user.id} className="border rounded-lg p-4">
            <img src={user.avatar_url} alt={user.login} className="h-12 w-12 rounded-full" />
            <h3 className="font-medium">{user.login}</h3>
            <a href={user.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
              View Profile
            </a>
            <button
              onClick={() => toggleFavorite(user)}
              className={`mt-2 px-4 py-2 rounded ${
                favorites.some((fav) => fav.id === user.id) ? "bg-yellow-400" : "bg-gray-200"
              }`}
            >
              {favorites.some((fav) => fav.id === user.id) ? "⭐ Unfavorite" : "⭐ Favorite"}
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={handleFirstPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          First
        </button>
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="px-4 py-2">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
        <button
          onClick={handleLastPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Last
        </button>
      </div>
    </div>
  )
}