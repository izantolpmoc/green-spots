import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  if (req.method === "GET") {
    const { tagName } = req.query;

    try {
      const tag = await prisma.Tag.findMany({
        where: {
          name: {
            contains: tagName
          },
        }
      });
      res.status(200).json({ tag });
    } catch (e) {
      res.status(500).json(e);
    }
  }
}