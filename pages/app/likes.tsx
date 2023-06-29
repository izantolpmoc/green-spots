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
import { useState } from 'react'
import { SessionUser, Spot } from '@lib/types'
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
                    <SectionTitle>J&apos;aimes</SectionTitle>
                    <p>Les spots qui vous ont tapé dans l&apos;œil</p>
                </SectionHeader>
                {  
                    status !== "authenticated" ?
                    <PlaceHolder 
                        button={(
                            <Button 
                                icon={faArrowRightToBracket}
                                role="primary"
                                onClick = {() => setShowLoginModal(true) }>
                                Connexion
                            </Button>
                        )}
                        illustrationURL="/assets/not-connected.svg">
                        <h3>Vous n&apos;êtes pas connecté</h3>
                        <p>Connectez-vous pour accéder à cette page</p>
                    </PlaceHolder>
                    : <></>
                }

                {  
                    status === "authenticated" && likedSpots.length === 0 ?
                    <PlaceHolder illustrationURL="/assets/no-like.svg">
                        <h3>Vous n&apos;avez pas encore de j&apos;aime</h3>
                        <p>Explorez sans attendre et laissez votre curiosité s&apos;épanouir</p>
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