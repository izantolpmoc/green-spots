import React from "react"

// set up the app context
// which will allow us to share data across the app
// like the user's location

export interface AppContext {
    userLocation: GeolocationPosition | null
}

export const initContext: AppContext = {
    userLocation: null
}

export const Context = React.createContext(initContext)