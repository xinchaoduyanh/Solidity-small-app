import type { NextFetchRequestConfig } from "next/dist/server/web/spec-extension/request"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001"

export interface FetchOptions extends RequestInit {
  next?: NextFetchRequestConfig
}

export async function fetcher<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

export async function clientFetcher<T>(endpoint: string): Promise<T> {
  return fetcher<T>(endpoint)
}
