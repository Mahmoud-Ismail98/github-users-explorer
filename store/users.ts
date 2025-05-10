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
}

export const useUserStore = create<UserStore>((set) => ({
  favorites: [],
  addFavorite: (user) =>
    set((state) => ({
      favorites: [...state.favorites, user],
    })),
  removeFavorite: (userId) =>
    set((state) => ({
      favorites: state.favorites.filter((user) => user.id !== userId),
    })),
}))
