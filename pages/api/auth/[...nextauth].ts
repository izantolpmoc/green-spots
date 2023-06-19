// pages/api/auth/[...nextauth].ts

import NextAuth from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import Google from 'next-auth/providers/google'
import prisma from '../../../lib/prisma'

export const authOptions = {
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
        }),
    ],
    adapter: PrismaAdapter(prisma),
    secret: process.env.SECRET
}

export default NextAuth(authOptions)