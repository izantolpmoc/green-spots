import prisma from '@lib/prisma'
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
 * GET /api/spots/[id]
 * Search for a specific spot in the database
 * @param req 
 * @param res 
 */
const handler = async(req: NextApiRequest, res: NextApiResponse) => {

    // only allow GET requests

    if (req.method !== 'GET') {
        res.status(405).json({message: 'Method not allowed'})
        return
    }

    // validate the query parameters

    const searchQuery = schemas.safeParse(req.query)

    if (!searchQuery.success) {
        res.status(400).json({message: 'Invalid query parameters', errors: searchQuery.error})
        return
    }


    // get spot from the database

    const spot = await prisma.spot.findUnique({
        where: {
            id: req.query.id as string
        },
        include: {
            tags: true,
            reviews: {
                include: {
                    user: true
                    }
                },
            likedBy: true,
            openingHours: true
        }
    });
    res.status(200).json({ spot })

}

export default handler