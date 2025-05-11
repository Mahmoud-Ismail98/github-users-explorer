import { render, screen, fireEvent, act } from "@testing-library/react"
import SearchBar from "@/components/search-bar"
import { useUserStore } from "@/store/users"

// Mock the Zustand store
jest.mock("@/store/users", () => ({
  useUserStore: jest.fn(() => ({
    setSearchQuery: jest.fn(),
  })),
}))
describe("SearchBar", () => {
  const mockSetSearchQuery = jest.fn()
  beforeEach(() => {
    jest.clearAllMocks()
    ;(useUserStore as jest.Mock).mockReturnValue({
      setSearchQuery: mockSetSearchQuery,
    })
  })
  it("renders the search input", () => {
    render(<SearchBar />)
    expect(screen.getByPlaceholderText("Search users...")).toBeInTheDocument()
  })
  it("updates input value when typed", () => {
    render(<SearchBar />)
    const input = screen.getByPlaceholderText("Search users...")
    fireEvent.change(input, { target: { value: "test" } })
    expect(input).toHaveValue("test")
  })
  it("debounces search query updates", async () => {
    jest.useFakeTimers()
    render(<SearchBar />)
    const input = screen.getByPlaceholderText("Search users...")
    fireEvent.change(input, { target: { value: "t" } })
    fireEvent.change(input, { target: { value: "te" } })
    fireEvent.change(input, { target: { value: "tes" } })
    fireEvent.change(input, { target: { value: "test" } })
    // The setSearchQuery should not be called immediately due to debounce
    expect(mockSetSearchQuery).not.toHaveBeenCalled()
    // Fast-forward debounce timeout
    act(() => {
      jest.advanceTimersByTime(300)
    })
    // Now it should be called with the final value
    expect(mockSetSearchQuery).toHaveBeenCalledWith("test")
    expect(mockSetSearchQuery).toHaveBeenCalledTimes(1)
    jest.useRealTimers()
  })
})
