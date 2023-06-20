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