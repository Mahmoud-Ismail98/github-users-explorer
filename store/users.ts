import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { User } from "@/types"

interface UserState {
  users: User[]
  favorites: User[]
  loading: boolean
  isInitialLoading: boolean
  error: string | null
  currentPage: number
  totalPages: number
  usersPerPage: number
  searchQuery: string
  retryCount: number
  maxRetries: number

  fetchUsers: (loadMore?: boolean) => Promise<void>
  setCurrentPage: (page: number) => void
  addFavorite: (user: User) => void
  removeFavorite: (userId: number) => void
  setSearchQuery: (query: string) => void
  loadMoreUsers: () => void
  retryFetch: () => Promise<void>
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      users: [],
      favorites: [],
      loading: false,
      isInitialLoading: true,
      error: null,
      currentPage: 1,
      totalPages: 1,
      usersPerPage: 10,
      searchQuery: "",
      retryCount: 0,
      maxRetries: 3,

      fetchUsers: async (loadMore = false) => {
        const { currentPage, usersPerPage, users: existingUsers } = get()

        set((state) => ({
          loading: true,
          isInitialLoading: state.users.length === 0,
          error: null,
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
            
            if (response.status === 403) {
              throw new Error("API rate limit exceeded. Please try again later.")
            } else if (response.status === 404) {
              throw new Error("Resource not found. Please check your request.")
            } else {
              throw new Error(`Failed to fetch users: HTTP ${response.status}`)
            }
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
            isInitialLoading: false,
            totalPages,
            retryCount: 0, // Reset retry count on success
            // Increment current page if loading more
            currentPage: loadMore ? state.currentPage + 1 : state.currentPage,
          }))
        } catch (error) {
          set((state) => ({
            loading: false,
            isInitialLoading: false,
            error: error instanceof Error ? error.message : "An unknown error occurred",
            retryCount: loadMore ? state.retryCount : 0, // Only reset retry count if not loading more
          }))
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
        const { loading, error } = get()
        if (!loading && !error) {
          get().fetchUsers(true)
        }
      },

      retryFetch: async () => {
        const { retryCount, maxRetries } = get()

        if (retryCount < maxRetries) {
          set((state) => ({ retryCount: state.retryCount + 1 }))
          await get().fetchUsers()
        } else {
          set({
            error: "Maximum retry attempts reached. Please try again later.",
            loading: false,
            isInitialLoading: false,
          })
        }
      },
    }),
    {
      name: "github-users-storage",
      partialize: (state) => ({ favorites: state.favorites }),
    },
  ),
)
