// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { validateImage } from '@lib/imagga';

type Data = {
    uri: string,
    validated: boolean
}

export default async function handler (
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const { uri } = req.body;
    
    const isValid = await validateImage(uri)

    res.status(200).json({ uri: uri, validated: isValid })
}
