import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User } from "@/types"

interface UserState {
  users: User[]
  favorites: User[]
  loading: boolean
  error: string | null
  currentPage: number
  totalPages: number
  usersPerPage: number
  searchQuery: string

  fetchUsers: (loadMore?: boolean) => Promise<void>
  setCurrentPage: (page: number) => void
  addFavorite: (user: User) => void
  removeFavorite: (userId: number) => void
  setSearchQuery: (query: string) => void
  loadMoreUsers: () => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      users: [],
      favorites: [],
      loading: false,
      error: null,
      currentPage: 1,
      totalPages: 1,
      usersPerPage: 10,
      searchQuery: "",

      fetchUsers: async (loadMore = false) => {
        const { currentPage, usersPerPage, users: existingUsers } = get()

        set((state) => ({
          loading: true,
          error: null,
          // Only reset users if we're not loading more
          users: loadMore ? state.users : [],
        }))

        try {
          // Calculate the "since" parameter based on whether we're loading more or starting fresh
          const since = loadMore
            ? existingUsers.length > 0
              ? existingUsers[existingUsers.length - 1].id
              : 0
            : (currentPage - 1) * usersPerPage

          const response = await fetch(`https://api.github.com/users?per_page=${usersPerPage}&since=${since}`)

          if (!response.ok) {
            throw new Error("Failed to fetch users")
          }

          const newUsers = await response.json()
          const linkHeader = response.headers.get("Link")

          // Calculate total pages from Link header or set a default
          let totalPages = get().totalPages
          if (linkHeader) {
            const lastPageMatch = linkHeader.match(/page=(\d+)>; rel="last"/)
            if (lastPageMatch) {
              totalPages = Math.ceil(Number.parseInt(lastPageMatch[1]) / usersPerPage)
            }
          }

          set((state) => ({
            users: loadMore ? [...state.users, ...newUsers] : newUsers,
            loading: false,
            totalPages,
            // Increment current page if loading more
            currentPage: loadMore ? state.currentPage + 1 : state.currentPage,
          }))
        } catch (error) {
          set({
            loading: false,
            error: error instanceof Error ? error.message : "An unknown error occurred",
          })
        }
      },

      setCurrentPage: (page) => {
        set({ currentPage: page })
      },

      addFavorite: (user) => {
        const { favorites } = get()
        if (!favorites.some((fav) => fav.id === user.id)) {
          set({ favorites: [...favorites, user] })
        }
      },

      removeFavorite: (userId) => {
        const { favorites } = get()
        set({ favorites: favorites.filter((user) => user.id !== userId) })
      },

      setSearchQuery: (query) => {
        set({ searchQuery: query })
      },

      loadMoreUsers: () => {
        const { loading } = get()
        if (!loading) {
          get().fetchUsers(true)
        }
      },
    }),
    {
      name: "github-users-storage",
      partialize: (state) => ({ favorites: state.favorites }),
    },
  ),
)
