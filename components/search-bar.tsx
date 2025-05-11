"use client"

import { useEffect, useState } from "react"
import { Input } from "./ui/input"
import { Search } from "lucide-react"
import { useUserStore } from "@/store/users"
import { useDebounce } from "@/hooks/use-debounce"

export default function SearchBar() {
  const { setSearchQuery } = useUserStore()
  const [inputValue, setInputValue] = useState("")
  const debouncedValue = useDebounce(inputValue, 300)

  useEffect(() => {
    setSearchQuery(debouncedValue)
  }, [debouncedValue, setSearchQuery])

  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search users..."
        className="pl-8"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
    </div>
  )
}
