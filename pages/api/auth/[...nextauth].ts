// pages/api/auth/[...nextauth].ts

import { NextApiHandler } from 'next'
import NextAuth from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import Google from 'next-auth/providers/google'
import prisma from '../../../lib/prisma'

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options)
export default authHandler

const options = {
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }),
    ],
    adapter: PrismaAdapter(prisma),
    secret: process.env.SECRET,
}