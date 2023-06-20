import prisma from "@lib/prisma";
import { authOptions } from "@pages/api/auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";

/**
 * POST /api/tags/delete
 * Delete an existing tag from the database
 * @param req 
 * @param res 
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const session = await getServerSession(req, res, authOptions);

    if(!session || !session.user.isAdmin || !session.user.isModerator) {
        res.status(401);
        res.end();
        return;
    }

    // only allow DELETE requests

    if (req.method !== "DELETE") 
        return res.status(405).json({message: 'Method not allowed'});

    
    const { id } = req.query;
    const tagId = id?.toString();
        

    try {
        // access db records with prisma functions
        const tag = await prisma.tag.delete({
            where: {
                id: tagId
            }   
        });
        res.status(200).json({ tag });
    } catch (e) {
        res.status(500).json(e);
    }
    
}