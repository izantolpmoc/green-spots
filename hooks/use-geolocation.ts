import { useEffect, useState } from "react"


/**
 * Use the Geolocation API to get the user's current location.
 * @returns {object} position - The user's current position.
 */
const useGeolocation = () => {

    // Create state to store the user's current position

    const [position, setPosition] = useState<GeolocationPosition | null>(null)
    const [error, setError] = useState<string | null>(null)

    // Configure the geolocation watcher and update the position in state when a change occurs
    
    useEffect(() => {

        // Keep the id returned by watchPosition so we can clear the watcher when the component unmounts

        const watchId = navigator.geolocation.watchPosition(
            (pos) => {
                setPosition(pos)
                setError(null)
            },
            (err) => {
                setError(err.message)
            }
        )

        // Clear watcher when the component unmounts
    
        return () => navigator.geolocation.clearWatch(watchId)
    }, [])

    // Return the user's current position and any errors
    
    return { position, error }
}

export default useGeolocation