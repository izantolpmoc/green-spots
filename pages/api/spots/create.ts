import prisma from '@lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

// used to validate the incoming request body

const spotSchema = z.object({
    name: z.string().min(1).max(255),
    description: z.string().min(0).max(240).optional(),
    // geolocation
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    // full address
    address: z.string().min(1).max(255),
    city: z.string().min(1).max(255),
    region: z.string().min(1).max(255).optional(),
    postalCode: z.string().min(1).max(255),
    country: z.string().min(1).max(255).optional(),
    // other
    website: z.string().url().optional(),
    image: z.string().url(),
    tags: z.array(z.string()),
    openingHours: z.array(z.object({
        openingTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        closingTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    })).optional()
})

/**
 * POST /api/spots/create
 * Create a new spot in the database
 * @param req 
 * @param res 
 */
const handler = async(req: NextApiRequest, res: NextApiResponse) => {

    // only allow POST requests

    if(req.method !== 'POST') {
        res.status(405).json({message: 'Method not allowed'})
        return
    }

    // validate the incoming request body

    const inputData = spotSchema.safeParse(req.body)

    if(!inputData.success) {
        const { errors } = inputData.error
        return res.status(400).json({
            error: { message: "Invalid request", errors }
        })
    }

    const { name, description, latitude, longitude, address, city, region, postalCode, country, website, image, tags, openingHours } = inputData.data

    // make sure all the tags exist in the database

    const existingTags = await prisma.tag.findMany({
        where: {
            name: {
                in: tags
            }
        }
    })

    if(existingTags.length !== tags.length) {
        return res.status(400).json({
            error: { message: "Invalid request", errors: [{path: ['tags'], message: 'One or more tags do not exist'}] }
        })
    }
    
    // create the spot in the database using prisma

    const newSpot = await prisma.spot.create({
        data: {
            name,
            description,
            latitude,
            longitude,
            address,
            city,
            region: region || "",
            postalCode,
            country,
            website,
            image,
            tags: {
                connect: tags.map(tag => ({name: tag}))
            },
            openingHours: {
                // openingHours is an array of objects, so we need to map over it
                create: openingHours?.map(({openingTime, closingTime, startDate, endDate}) => ({
                    openingTime,
                    closingTime,
                    startDate: new Date(startDate),
                    endDate: new Date(endDate)
                }))
            }
        },
        include: {
            tags: true,
            openingHours: true
        }
    })


    res.status(200).json(newSpot)
}

export default handler