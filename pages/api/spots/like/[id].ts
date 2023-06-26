import prisma from '@lib/prisma'
import { authOptions } from '@pages/api/auth/[...nextauth]'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'

/**
 * PUT /api/spots/like/[id]
 * Add or removes a spot to user's list of favorites
 * @param req 
 * @param res 
 */
const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    // only allow POST requests

    if(req.method !== 'PUT') {
        res.status(405).json({message: 'Method not allowed'})
        return
    }

    // make sure the id is provided

    if(!req.query.id) {
        res.status(400).json({message: 'Invalid request: id is required'})
        return
    }

    const session = await getServerSession(req, res, authOptions);

    if(!session?.user)
        return res.status(400).json({message: 'Invalid request: user is required'});

    const id = req.query.id?.toString()

    // make sure the spot exists

    const spot = await prisma.spot.findUnique({
        where: { id },
        include: { likedBy: true }
    })

    if(!spot) {
        res.status(404).json({message: 'Spot not found'})
        return
    }

    // Check if the user already likes the spot
    const isLikedByUser = spot.likedBy.some(user => user.id === session.user.id)


    // add to or remove from spot user's favorites

    const user = isLikedByUser 
            ?   await prisma.user.update({
                    where: { id: session.user.id },
                    data: {
                        likedSpots: {
                            disconnect: { id }
                        }
                    },
                    include: { likedSpots: true }
                })
            :   await prisma.user.update({
                    where: { id: session.user.id },
                    data: {
                        likedSpots: {
                            connect: { id }
                        }
                    },
                    include: { likedSpots: true }
                });

    res.status(200).json({message: 'Spot added to or removed from favorites', user})
}

export default handler