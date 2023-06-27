import { Account, User, Review, Spot, Session } from "@prisma/client"
import prisma from "../prisma"


export interface UserWithAttributes extends User {
    reviews: Review[];
    likedSpots: Spot[];
}

/**
 * Get a user from the database
 * @param email The user's email
 * @returns list of users
 */
export const getUser = async (email: string) => {


    // run the query & return the results

    return await prisma.user.findUnique({
        where: {
            email: email
        },
        include: {
            reviews: true,
            likedSpots: true
        }
    }) as UserWithAttributes
}
