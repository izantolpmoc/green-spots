import prisma from "@lib/prisma";
import { authOptions } from "@pages/api/auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

/**
 * DELETE /api/review/delete
 * Delete an existing review from the database
 * @param req 
 * @param res 
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const review = await prisma.review.findUnique({
		where: {
			id: req.query.id?.toString()
		},
	});

    const session = await getServerSession(req, res, authOptions);

    if(!session?.user.isAdmin && session?.user.id !== review?.userId) 
        return res.status(401).end();

    // only allow DELETE requests

    if (req.method !== "DELETE") 
        return res.status(405).json({message: 'Method not allowed'});

    try {
        // access db records with prisma functions
        const deletedReview = await prisma.review.delete({
            where: {
                id: review?.id
            }   
        });
        res.status(200).json({ deletedReview });
    } catch (e) {
        res.status(500).json(e);
    }
    
}