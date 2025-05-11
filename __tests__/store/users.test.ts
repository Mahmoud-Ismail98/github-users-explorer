import { act, renderHook } from "@testing-library/react"
import { useUserStore } from "@/store/users"
import type { User } from "@/types"

// Mock fetch
global.fetch = jest.fn()

describe("useUserStore", () => {
  const mockUsers: User[] = [
    {
      id: 1,
      login: "user1",
      avatar_url: "https://example.com/avatar1.png",
      html_url: "https://github.com/user1",
      type: "User",
    },
    {
      id: 2,
      login: "user2",
      avatar_url: "https://example.com/avatar2.png",
      html_url: "https://github.com/user2",
      type: "User",
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    // Reset the store
    act(() => {
      useUserStore.setState({
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
      })
    })
  })

  describe("fetchUsers", () => {
    it("fetches users successfully", async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUsers,
        headers: {
          get: () => 'page=10>; rel="last"',
        },
      })

      const { result } = renderHook(() => useUserStore())

      await act(async () => {
        await result.current.fetchUsers()
      })

      expect(result.current.users).toEqual(mockUsers)
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBeNull()
      expect(result.current.isInitialLoading).toBe(false)
    })

    it("handles fetch error", async () => {
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 403,
      })

      const { result } = renderHook(() => useUserStore())

      await act(async () => {
        await result.current.fetchUsers()
      })

      expect(result.current.users).toEqual([])
      expect(result.current.loading).toBe(false)
      expect(result.current.error).toBe("API rate limit exceeded. Please try again later.")
      expect(result.current.isInitialLoading).toBe(false)
    })
  })

  describe("favorites management", () => {
    it("adds a user to favorites", () => {
      const { result } = renderHook(() => useUserStore())

      act(() => {
        result.current.addFavorite(mockUsers[0])
      })

      expect(result.current.favorites).toEqual([mockUsers[0]])
    })

    it("doesn't add duplicate favorites", () => {
      const { result } = renderHook(() => useUserStore())

      act(() => {
        result.current.addFavorite(mockUsers[0])
        result.current.addFavorite(mockUsers[0])
      })

      expect(result.current.favorites).toEqual([mockUsers[0]])
    })

    it("removes a user from favorites", () => {
      const { result } = renderHook(() => useUserStore())

      act(() => {
        result.current.addFavorite(mockUsers[0])
        result.current.addFavorite(mockUsers[1])
      })

      expect(result.current.favorites).toEqual([mockUsers[0], mockUsers[1]])

      act(() => {
        result.current.removeFavorite(mockUsers[0].id)
      })

      expect(result.current.favorites).toEqual([mockUsers[1]])
    })
  })

  describe("search functionality", () => {
    it("sets search query", () => {
      const { result } = renderHook(() => useUserStore())

      act(() => {
        result.current.setSearchQuery("test")
      })

      expect(result.current.searchQuery).toBe("test")
    })
  })
})
