import prisma from '@lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse) => {

    // only allow DELETE method

    if (req.method !== 'DELETE') {
        return res.status(405).json({ message: 'Method not allowed' })
    }

    // get user id from query

    const id = req.query.id?.toString() || ''

    // make sure id was provided

    if (!id) {
        return res.status(400).json({ message: 'User id not provided' })
    }

    // check if user exists in database

    const user = await prisma.user.findUnique({
        where: { id: id }
    })

    if (!user) {
        return res.status(404).json({ message: 'User not found' })
    }

    // delete user from database

    await prisma.user.delete({
        where: { id: id }
    })

    // return success response

    res.status(200).json({ message: 'Account deletion success' })

}

export default handler
        