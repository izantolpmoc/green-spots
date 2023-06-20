import prisma from '@lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

// used to validate the incoming request body
// all attributes are optional because we are updating

const spotUpdateSchema = z.object({
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

    // only allow PUT requests

    if(req.method !== 'PUT') {
        res.status(405).json({message: 'Method not allowed'})
        return
    }

    // make sure the id is provided

    if(!req.query.id) {
        res.status(400).json({message: 'Invalid request: id is required'})
        return
    }

    const id = req.query.id?.toString()

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

    // filter opening hours to only include those that don't exist in the database (checking for values using AND operator)

    const existingOpeningHours = await prisma.openingHours.findMany({
        where: {
            AND: openingHours?.map(openingHour => ({
                openingTime: openingHour.openingTime,
                closingTime: openingHour.closingTime,
                startDate: new Date(openingHour.startDate),
                endDate: new Date(openingHour.endDate)
            }))
        }
    })

    const newOpeningHours = openingHours?.filter(openingHour => !existingOpeningHours.some(existingOpeningHour =>
        existingOpeningHour.openingTime === openingHour.openingTime &&
        existingOpeningHour.closingTime === openingHour.closingTime &&
        existingOpeningHour.startDate.getTime() === new Date(openingHour.startDate).getTime() &&
        existingOpeningHour.endDate.getTime() === new Date(openingHour.endDate).getTime()
    ))
    
    // create the spot in the database using prisma

    const updatedSpot = await prisma.spot.update({
        where: {
            id: id
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
                // delete opening hours that are not in the request
                deleteMany: {
                    OR: openingHours?.map(openingHour => ({
                        AND: [
                            { openingTime: { not: openingHour.openingTime } },
                            { closingTime: { not: openingHour.closingTime } },
                            { startDate: { not: new Date(openingHour.startDate) } },
                            { endDate: { not: new Date(openingHour.endDate) } }
                        ]
                    }))
                },
                // create new opening hours which values are not in the database
                createMany: {
                    data: newOpeningHours?.map(({openingTime, closingTime, startDate, endDate}) => ({
                        openingTime,
                        closingTime,
                        startDate: new Date(startDate),
                        endDate: new Date(endDate)
                    })) || []
                }
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