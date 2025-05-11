import { render, screen, fireEvent } from "@testing-library/react"
import { UserCard } from "@/components/user-card"
import { useUserStore } from "@/store/users"
import type { User } from "@/types"

// Mock the Zustand store
jest.mock("@/store/users", () => ({
  useUserStore: jest.fn(),
}))

// Mock next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />
  },
}))

describe("UserCard", () => {
  const mockUser: User = {
    id: 1,
    login: "testuser",
    avatar_url: "https://example.com/avatar.png",
    html_url: "https://github.com/testuser",
    type: "User",
  }

  const mockAddFavorite = jest.fn()
  const mockRemoveFavorite = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useUserStore as jest.Mock).mockImplementation(() => ({
      addFavorite: mockAddFavorite,
      removeFavorite: mockRemoveFavorite,
    }))
  })

  it("renders user information correctly", () => {
    render(<UserCard user={mockUser} />)

    expect(screen.getByText("testuser")).toBeInTheDocument()
    expect(screen.getByText("ID: 1")).toBeInTheDocument()
    expect(screen.getByRole("img")).toHaveAttribute("src", "https://example.com/avatar.png")
    expect(screen.getByRole("link")).toHaveAttribute("href", "https://github.com/testuser")
  })

  it("does not show favorite button when showFavoriteButton is false", () => {
    render(<UserCard user={mockUser} showFavoriteButton={false} />)

    expect(screen.queryByText("Favorite")).not.toBeInTheDocument()
    expect(screen.queryByText("Favorited")).not.toBeInTheDocument()
  })

  it("shows 'Favorite' button when not favorited", () => {
    render(<UserCard user={mockUser} showFavoriteButton={true} isFavorite={false} />)

    expect(screen.getByText("Favorite")).toBeInTheDocument()
  })

  it("shows 'Favorited' button when favorited", () => {
    render(<UserCard user={mockUser} showFavoriteButton={true} isFavorite={true} />)

    expect(screen.getByText("Favorited")).toBeInTheDocument()
  })

  it("calls addFavorite when favorite button is clicked", () => {
    render(<UserCard user={mockUser} showFavoriteButton={true} isFavorite={false} />)

    fireEvent.click(screen.getByText("Favorite"))
    expect(mockAddFavorite).toHaveBeenCalledWith(mockUser)
  })

  it("calls removeFavorite when favorited button is clicked", () => {
    render(<UserCard user={mockUser} showFavoriteButton={true} isFavorite={true} />)

    fireEvent.click(screen.getByText("Favorited"))
    expect(mockRemoveFavorite).toHaveBeenCalledWith(mockUser.id)
  })
})
