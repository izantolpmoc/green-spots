import React from "react"

// set up the app context
// which will allow us to share data across the app
// like the user's location
// & the search parameters

export interface SearchParamsContext {
    searchQuery: string
    setSearchQuery: (query: string) => void
    maxDistance: number
    setMaxDistance: (maxDistance: number) => void
    tags: string[]
    setTags: (tags: string[]) => void
    selectedTags: string[]
    setSelectedTags: (tags: string[]) => void
}

export interface AppContext extends SearchParamsContext {
    userLocation: GeolocationPosition | null
}

export const initContext: AppContext = {
    userLocation: null,
    searchQuery: '',
    setSearchQuery: () => {},
    maxDistance: 10,
    setMaxDistance: () => {},
    tags: [],
    setTags: () => {},
    selectedTags: [],
    setSelectedTags: () => {}
}

export const Context = React.createContext(initContext)