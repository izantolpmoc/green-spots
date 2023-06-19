import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  const session = await getServerSession(req, res, authOptions);


  if(!session || !session.user.isAdmin || !session.user.isModerator) {
    res.status(401);
    res.end();
    return;
  }

  if (req.method === "POST") {
    const { name, description } =
      typeof req.body == "string" ? JSON.parse(req.body) : req.body;      

    try {
      // access db records with prisma functions
      const tag = await prisma.Tag.create({
        data: {
          name,
          description
        },
      });
      res.status(200).json({ tag });
    } catch (e) {
      res.status(500).json(e);
    }
  }
}