import { create } from "zustand"

interface User {
  id: number
  login: string
  avatar_url: string
  html_url: string
}

interface UserStore {
  favorites: User[]
  addFavorite: (user: User) => void
  removeFavorite: (userId: number) => void
  hydrate: () => void
}

export const useUserStore = create<UserStore>((set) => ({
  favorites: [],
  addFavorite: (user) =>
    set((state) => {
      const updatedFavorites = [...state.favorites, user]
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites))
      return { favorites: updatedFavorites }
    }),
  removeFavorite: (userId) =>
    set((state) => {
      const updatedFavorites = state.favorites.filter((user) => user.id !== userId)
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites))
      return { favorites: updatedFavorites }
    }),
  hydrate: () => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]")
    set({ favorites: storedFavorites })
  },
}))

