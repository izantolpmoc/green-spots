import prisma from "@lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "../auth/[...nextauth]";

// used to validate the incoming request body

const reviewSchema = z.object({
	comment: z.string().min(0).max(240),
  	rating: z.number().min(0).max(5).int(),
  	spotId: z.string().nonempty()
});

/**
 * POST /api/reviews/create
 * Create a new review in the database
 * @param req 
 * @param res 
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {

	const session = await getServerSession(req, res, authOptions);

	if(!session) {
		res.status(401);
		res.end();
		return;
	}

	// only allow POST requests

	if (req.method !== "POST") 
		return res.status(405).json({message: 'Method not allowed'});

	// validate the incoming request body

	const inputData = reviewSchema.safeParse(req.body)

	if(!inputData.success) {
		const { errors } = inputData.error
		return res.status(400).json({
			error: { message: "Invalid request", errors }
		})
	}

	const { comment, rating, spotId } = inputData.data 
	
	// Check if a review with the same user exists

	const existingReview = await prisma.review.findFirst({
		where: {
			userId: {
				equals: session.user.id,
			},
			spotId: {
				equals: spotId,
			},
		},
	});

	if(existingReview) {
		return res.status(400).json({ error: { message: "A review by current user already exists" } });
	}

	try {
		const review = await prisma.review.create({
			data: {
				comment,
				rating,
				spotId,
				//userId: session.user.id,
				userId: 'clj2o3m0m0000qku5evq8g70j'
			},
		});
		res.status(200).json({ review });
	} catch (e) {
		res.status(500).json(e);
	}
}