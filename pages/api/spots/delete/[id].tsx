import prisma from '@lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

/**
 * DELETE /api/spots/delete/[id]
 * Delete a spot from the database
 * @param req 
 * @param res 
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    // only allow DELETE requests

    if(req.method !== 'DELETE') {
        res.status(405).json({message: 'Method not allowed'})
        return
    }

    // make sure the id is provided

    if(!req.query.id) {
        res.status(400).json({message: 'Invalid request: id is required'})
        return
    }

    const id = req.query.id?.toString()

    // make sure the spot exists

    const spot = await prisma.spot.findUnique({
        where: {
            id
        }
    })

    if(!spot) {
        res.status(404).json({message: 'Spot not found'})
        return
    }

    // delete the spot

    await prisma.spot.delete({
        where: {
            id
        }
    })

    res.status(200).json({message: 'Spot deleted'})
}

export default handler