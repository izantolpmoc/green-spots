// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { uploadImage, deleteImage } from '@lib/cloudinary'
import { validateImage } from '@lib/imagga';
import { url } from 'inspector';


type Data = {
    base64?: string,
    result?: string | boolean
}

export const config = { api: { bodyParser: { sizeLimit: '12mb' } } }

export default async function handler (
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const { base64 } = JSON.parse(req.body);

    try {
        let result = await uploadImage(base64);

        const url = result.secure_url;

        let check = await validateImage(url)

        if(check) {
            return res.status(200).json({ base64: base64, result: url})
        } else {
            const public_id = result.public_id;

            await deleteImage(public_id);

            return res.status(200).json({ base64: base64, result: false})
        }

    } catch(e) {
        res.status(500).send({ base64: base64, result: (e as Error).message})
    }
}
