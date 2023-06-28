import { OpeningHours, Review, Spot, Tag, User } from "@prisma/client"
import prisma from "../prisma"


export interface SpotWithAttributes extends Spot {
    tags: Tag[];
    openingHours: OpeningHours[];
    reviews: Review[];
    likedBy: User[]
}

/**
 * Get all the spots from the database
 * @param query The search query
 * @param tags The tags to filter by
 * @returns list of spots
 */
export const getSpots = async (query?: string, tags?: string[]) => {

    
    let searchQuery: any = {}

    // full text search (if query provided)

    if (query) {
        searchQuery = {
            where: {
                OR: [
                    {
                        name: {
                            contains: query,
                            mode: 'insensitive'
                        }
                    },
                    {
                        description: {
                            contains: query,
                            mode: 'insensitive'
                        }
                    }
                ]
            }
        }
    }

    // filter by tags (if provided)

    if (tags) {
        searchQuery = {
            ...searchQuery,
            where: {
                ...searchQuery.where,
                tags: {
                    some: {
                        name: {
                            in: tags
                        }
                    }
                }
            }
        }
    }

    // run the query & return the results

    return await prisma.spot.findMany({
        ...searchQuery,
        include: {
            tags: true,
            openingHours: true,
            reviews: true,
            likedBy: true
        }
    }) as SpotWithAttributes[]
}


/**
 * Sort a list of spots by distance from a given latitude and longitude
 * @param spots The list of spots to sort
 * @param latitude The latitude of the center of the search area
 * @param longitude The longitude of the center of the search area
 * @returns 
 */
export const sortSpotsByDistance = (spots: SpotWithAttributes[], latitude: number, longitude: number) => {
    return spots.sort((a, b) => {
        const aDistance = Math.sqrt(Math.pow(a.latitude - latitude, 2) + Math.pow(a.longitude - longitude, 2))
        const bDistance = Math.sqrt(Math.pow(b.latitude - latitude, 2) + Math.pow(b.longitude - longitude, 2))
        return aDistance - bDistance
    })
}

/**
 * Get spots within a certain radius of a given latitude and longitude
 * @param latitude The latitude of the center of the search area
 * @param longitude The longitude of the center of the search area
 * @param maxDistance The maximum distance from the center of the search area (in km)
 * @returns 
 */
export const getNearbySpots = async (latitude: number, longitude: number, maxDistance: number) => {

    const radius = maxDistance / 111 // 1 degree of latitude / longitude is 111 km
    
    return await prisma.spot.findMany({
        where: {
            latitude: {
                gte: latitude - radius,
                lte: latitude + radius
            },
            longitude: {
                gte: longitude - radius,
                lte: longitude + radius
            }
        },
        include: {
            tags: true,
            openingHours: true,
            reviews: true, 
            likedBy: true
        }
    })
    // sort by distance from center (increasing)
    .then(spots => sortSpotsByDistance(spots, latitude, longitude))
}

/**
 * Sort a list of spots by rating (descending)
 * @param spots The list of spots to sort
 * @returns The list of spots sorted by rating (descending)
 */
export const sortSpotsByRating = (spots: SpotWithAttributes[]) => {
    return spots.sort((a, b) => {
        const aRating = a.reviews.reduce((acc, review) => acc + review.rating, 0) / a.reviews.length
        const bRating = b.reviews.reduce((acc, review) => acc + review.rating, 0) / b.reviews.length
        return bRating - aRating
    })
}

/**
 * Get the distance from a spot to a given latitude and longitude
 * @param spot The spot to get the distance from
 * @param latitude The latitude of the point to get the distance from
 * @param longitude The longitude of the point to get the distance from
 * @returns 
 */
export const distanceFromSpot = (spot: SpotWithAttributes, latitude: number, longitude: number) => {
    return Math.sqrt(Math.pow(spot.latitude - latitude, 2) + Math.pow(spot.longitude - longitude, 2))
}