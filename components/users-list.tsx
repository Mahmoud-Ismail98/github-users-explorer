"use client"

import { useEffect, useState } from "react"

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
  const usersPerPage = 5

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

  const startIndex = (currentPage - 1) * usersPerPage
  const paginatedUsers = users.slice(startIndex, startIndex + usersPerPage)


  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <div className="space-y-6 mt-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {paginatedUsers.map((user) => (
          <div key={user.id} className="border rounded-lg p-4">
            <img src={user.avatar_url} alt={user.login} className="h-12 w-12 rounded-full" />
            <h3 className="font-medium">{user.login}</h3>
            <a href={user.html_url} target="_blank" rel="noopener noreferrer" className="text-blue-500">
              View Profile
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}