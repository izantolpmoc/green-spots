import { SpotWithAttributes, getNearbySpots, getSpots } from '@lib/helpers/spots'
import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

// used to validate the incoming request body

const schemas = z.object({
    query: z.string().optional(),
    // tags is an array or a string
    tags: z.union([z.string(), z.array(z.string())]).optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    maxDistance: z.number().optional(), // in km
})

/**
 * GET /api/spots
 * Search for spots in the database
 * @param req 
 * @param res 
 */
const handler = async(req: NextApiRequest, res: NextApiResponse) => {

    // only allow GET requests

    if (req.method !== 'POST') {
        res.status(405).json({message: 'Method not allowed'})
        return
    }

    // validate the query parameters

    const searchQuery = schemas.safeParse(req.body)

    if (!searchQuery.success) {
        res.status(400).json({message: 'Invalid query parameters', errors: searchQuery.error})
        return
    }

    // extract the query parameters

    const { query, tags: searchTags, latitude, longitude, maxDistance } = searchQuery.data

    const tags = typeof searchTags === 'string' ? [searchTags] : searchTags

    // if latitude or longitude are provided, but not both, return an error

    if ((latitude && !longitude) || (!latitude && longitude)) {
        res.status(400).json({message: 'If latitude or longitude are provided, both must be provided'})
        return
    }

    // if maxDistance is provided, but latitude and longitude are not, return an error

    if (maxDistance && (!latitude || !longitude)) {
        res.status(400).json({message: 'If maxDistance is provided, latitude and longitude must be provided'})
        return
    }

    // get the spots from the database

    let spots: SpotWithAttributes[] = []

    // if a location is provided
    // get nearby spots

    if (latitude && longitude) {
        spots = await getNearbySpots(latitude, longitude, maxDistance ?? 10)

        // if query or tags are provided
        // filter the retrived spots

        if(query || tags) {
            spots = spots.filter(spot => {
                let matches = true

                if (query) {
                    matches = matches && (spot.name.toLowerCase().includes(query.toLowerCase()) || Boolean(spot.description?.toLowerCase().includes(query.toLowerCase())))
                }

                if (tags) {
                    matches = matches && tags.every(tag => spot.tags.some(spotTag => spotTag.name === tag))
                }

                return matches
            })
        }
    } else {
        spots = await getSpots(query, tags)
    }

    res.status(200).json({ spots })

}

export default handler