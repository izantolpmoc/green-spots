import SectionHeader from "@components/layout/section-header"
import SectionTitle from "@components/section-title"
import { getUser } from '@lib/helpers/user'
import { GetServerSideProps } from 'next'
import { serialize, deserialize } from 'superjson'
import { SuperJSONResult } from 'superjson/dist/types'
import { useSession } from "next-auth/react";
import styles from "@styles/pages/likes.module.scss";
import { getServerSession } from "next-auth";
import { authOptions } from "@pages/api/auth/[...nextauth]";
import { useContext, useEffect, useState } from 'react'
import { SessionUser, Spot } from '@lib/types'
import prisma from "@lib/prisma";
import PlaceHolder from "@components/placeholder";
import Button from "@components/button";
import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";
import LoginModal from "@components/modals/login-modal";
import DynamicSpotsGrid from "@components/layout/dynamic-spots-grid";
import { Context } from "@lib/context";
import useDeviceType from "../../hooks/use-device-type"

interface Props {
	likedSpotsJSON: SuperJSONResult | null
    tags: string[];
}

const Likes = (
    { likedSpotsJSON, tags }: Props
) => {

     // update the tags in the context

     const { setTags } = useContext(Context)

     useEffect(() => {
         setTags(tags)
     }, [])
     
    const deviceType = useDeviceType()
    const [showModal, setShowModal] = useState(false)
    const [currentSpotPosition, setCurrentSpotPosition] = useState(0)
    
    // get the user and the status from useSession

    const { data: session, status } = useSession()
    const sessionUser = session?.user as SessionUser | undefined
    
    const [likedSpots, setLikedSpots] = useState<Spot[]>(likedSpotsJSON ? deserialize(likedSpotsJSON) : [])

    // utils

    const updateSpot = (index: number, spot: Spot) => {
        const newSpots = [...likedSpots]
        // if the spot is not liked by the user anymore, remove it from the list
        if(!spot.likedBy.find(user => user.email === sessionUser?.email)) {
            newSpots.splice(index, 1)
        } else newSpots[index] = spot
        setLikedSpots(newSpots)
    }

    // manage login modal

    const [showLoginModal, setShowLoginModal] = useState<boolean>(false)
    
    // render

    return (
        <>
            <main id={styles.main}>
                <SectionHeader>
                    <SectionTitle>Likes</SectionTitle>
                    <p>The spots that caught your eye</p>
                </SectionHeader>
                {  
                    status !== "authenticated" ?
                    <PlaceHolder 
                        button={(
                            <Button 
                                icon={faArrowRightToBracket}
                                role="primary"
                                onClick = {() => setShowLoginModal(true) }>
                                Log in
                            </Button>
                        )}
                        illustrationURL="/assets/not-connected.svg">
                        <h3>You are not logged in</h3>
                        <p>Log in to access this page</p>
                    </PlaceHolder>
                    : <></>
                }

                {  
                    status === "authenticated" && likedSpots.length === 0 ?
                    <PlaceHolder illustrationURL="/assets/no-like.svg">
                        <h3>You did not like any spot yet</h3>
                        <p>Start exploring and let your curiosity grow</p>
                    </PlaceHolder>
                    : <></>
                }

                {  
                    status === "authenticated" && likedSpots.length > 0 ?
                    <DynamicSpotsGrid spots={likedSpots} displayListOnMobile updateSpot={updateSpot} />
                    : <></>
                }   
                
        </main>
        
        
        <LoginModal 
            showModal={showLoginModal} 
            onClose={() => setShowLoginModal(false)}
        /> 

        </>

    )
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {

    // get tags 

    const tags = (await prisma.tag.findMany({
        select: {
            name: true
        }
    })).map(tag => tag.name)

    // getthe session to access the user's email

    const session = await getServerSession(context.req, context.res, authOptions)

    if(!session) return { props: { likedSpotsJSON: null, tags } }

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
                reviews: {
                    include: { user: true }
                },
                likedBy: true
            }
        }))
    }

    // serialize the liked spots to send them to the client

    const likedSpotsJSON = serialize(likedSpots)
    
    // return 

    return {
        props : {
            likedSpotsJSON,
            tags
        }
    }
}

export default Likes