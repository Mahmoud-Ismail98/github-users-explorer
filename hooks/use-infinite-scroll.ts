"use client"

import { useEffect, useRef, useState } from "react"

interface UseInfiniteScrollOptions {
  threshold?: number
  rootMargin?: string
}

export function useInfiniteScroll(
  onLoadMore: () => void,
  { threshold = 0.1, rootMargin = "0px 0px 200px 0px" }: UseInfiniteScrollOptions = {},
) {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const targetRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {

    if (observerRef.current) {
      observerRef.current.disconnect()
    }

   
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting)

        if (entry.isIntersecting) {
          onLoadMore()
        }
      },
      {
        root: null, 
        rootMargin,
        threshold,
      },
    )

    const currentTarget = targetRef.current
    if (currentTarget) {
      observerRef.current.observe(currentTarget)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [onLoadMore, rootMargin, threshold])

  return { targetRef, isIntersecting }
}
