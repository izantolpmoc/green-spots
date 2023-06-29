import SectionHeader from "@components/layout/section-header"
import SectionTitle from "@components/section-title"
import useDeviceType from "../../hooks/use-device-type";
import { getUser } from '@lib/helpers/user'
import { GetServerSideProps } from 'next'
import { serialize, deserialize } from 'superjson'
import { SuperJSONResult } from 'superjson/dist/types'
import { useSession } from "next-auth/react";
import styles from "@styles/pages/likes.module.scss";
import { getServerSession } from "next-auth";
import { authOptions } from "@pages/api/auth/[...nextauth]";
import { useState } from 'react'
import { Spot } from '@lib/types'
import prisma from "@lib/prisma";
import PlaceHolder from "@components/placeholder";
import Button from "@components/button";
import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";
import LoginModal from "@components/modals/login-modal";
import DynamicSpotsGrid from "@components/layout/dynamic-spots-grid";

interface Props {
	likedSpotsJSON: SuperJSONResult | null,
}

const Likes = (
    { likedSpotsJSON }: Props
) => {

    const { status } = useSession()
    const [showModal, setShowModal] = useState(false)

    // render

    return (
        <>
            <main id={styles.main}>
               
            </main>

        </>

    )
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {

    // getthe session to access the user's email

    const session = await getServerSession(context.req, context.res, authOptions)

    if(!session) return { props: { likedSpotsJSON: null } }

    let email = session.user.email;

    // get the user's liked spots from the database using prisma

    const rawData = await getUser(email)

    const likedSpots: any[] = []

    // for each spot in the list, retrieve also its tags and reviews

    for(const likedSpot of rawData.likedSpots) {

        likedSpots.push(await prisma.spot.findUnique({
            where: {
                id: likedSpot.id
            },
            include: {
                tags: true,
                reviews: true,
                likedBy: true
            }
        }))
    }

    // serialize the liked spots to send them to the client
      
    const likedSpotsJSON = serialize(likedSpots)
    
    // return 

    return {
        props : {
            likedSpotsJSON
        }
    }
}

export default Likes