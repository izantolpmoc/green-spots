import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { z } from "zod";

const tagSchema = z.object({
    id: z.string(),
    name: z.string().min(1).max(255),
    description: z.string().min(0).max(240)
});

/**
 * POST /api/tags/update
 * Update an existing tag in the database
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

    // only allow POST requests

    if (req.method !== "POST") 
        return res.status(405).json({message: 'Method not allowed'});// validate the incoming request body

    const inputData = tagSchema.safeParse(req.body)

    if(!inputData.success) {
        const { errors } = inputData.error
        return res.status(400).json({
            error: { message: "Invalid request", errors }
        })
    }
    
    const { id, name: name, description: description } = inputData.data     

    try {
        // access db records with prisma functions
        const tag = await prisma.tag.update({
            where: {
                id: id
            },
            data: {
                name: name,
                description: description
            }
        });
        res.status(200).json({ tag });
    } catch (e) {
        res.status(500).json(e);
    }
    
}