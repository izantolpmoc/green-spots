// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { validateText } from '@lib/wording';

type Data = {
    text: string,
    result: boolean
}

export default async function handler (
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const { text } = JSON.parse(req.body);

    const result = await validateText(text)

    res.status(200).json({ text, result });
}
