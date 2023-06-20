import prisma from '@lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

// used to validate the incoming request body
// all attributes are optional because we are updating

const spotUpdateSchema = z.object({
    id: z.string().uuid(),
    newName: z.string().min(1).max(255).optional(),
    description: z.string().min(1).max(240).optional(),
    image: z.string().url().optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    tags: z.array(z.string()).optional(),
    openingHours: z.array(z.object({
        openingTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        closingTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
        startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
        endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    })).optional()
})

/**
 * POST /api/spots/update/:id
 * Update a spot in the database
 * @param req 
 * @param res 
 */
const handler = async(req: NextApiRequest, res: NextApiResponse) => {

    // only allow POST requests

    if(req.method !== 'PUT') {
        res.status(405).json({message: 'Method not allowed'})
        return
    }

    // validate the incoming request body

    const inputData = spotUpdateSchema.safeParse(req.body)

    if(!inputData.success) {
        const { errors } = inputData.error
        return res.status(400).json({
            error: { message: "Invalid request", errors }
        })
    }

    const { newName, description, image, latitude, longitude, tags, openingHours } = inputData.data

    // make sure all the tags exist in the database

    const existingTags = await prisma.tag.findMany({
        where: {
            name: {
                in: tags
            }
        }
    })

    if(typeof tags !== "undefined" && existingTags.length !== tags.length) {
        return res.status(400).json({
            error: { message: "Invalid request", errors: [{path: ['tags'], message: 'One or more tags do not exist'}] }
        })
    }
    
    // create the spot in the database using prisma

    const updatedSpot = await prisma.spot.update({
        where: {
            id: req.query.id?.toString() || ''
        },
        data: {
            name: newName,
            description,
            image,
            latitude,
            longitude,
            tags: {
                connect: tags?.map(tag => ({name: tag}))
            },
            openingHours: {
                create: openingHours?.map(openingHour => ({
                    openingTime: openingHour.openingTime,
                    closingTime: openingHour.closingTime,
                    startDate: openingHour.startDate,
                    endDate: openingHour.endDate
                }))
            }
        },
        include: {
            tags: true,
            openingHours: true,
            reviews: true
        }
    })



    res.status(200).json(updatedSpot)
}

export default handler