import prisma from "../prisma"

/**
 * Get all the spots from the database
 * @returns list of spots
 */
export const getSpots = async () => {

    const spots = await prisma.spot.findMany({
        include: {
            tags: true,
            openingHours: true,
            reviews: true
        }
    })

    return spots
}



/**
 * Get spots within a certain radius of a given latitude and longitude
 * @param latitude The latitude of the center of the search area
 * @param longitude The longitude of the center of the search area
 * @param radius The radius of the search area
 * @returns 
 */
export const getNearbySpots = async (latitude: number, longitude: number, radius: number) => {
    
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
            reviews: true
        }
    })
}

