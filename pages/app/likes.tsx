import SectionHeader from "@components/layout/section-header"
import SectionTitle from "@components/section-title"
import useDeviceType from "../../hooks/use-device-type";
import { getUser } from '@lib/helpers/user'
import { GetServerSideProps } from 'next'
import { serialize, deserialize } from 'superjson'
import { SuperJSONResult } from 'superjson/dist/types'
import { useSession } from "next-auth/react";
import NotConnected from "@components/not-connected";
import styles from "@styles/pages/likes.module.scss";
import { getServerSession } from "next-auth";
import { authOptions } from "@pages/api/auth/[...nextauth]";
import SpotDetailsModal from '@components/modals/spot-details-modal'
import SpotCard from '@components/spot-card'
import { useState } from 'react'
import { Spot } from '@lib/types'
import prisma from "@lib/prisma";

interface Props {
	likedSpotsJSON: SuperJSONResult | null,
}

const Likes = (
    { likedSpotsJSON }: Props
) => {

    const { status } = useSession()
    const deviceType = useDeviceType()
    const [showModal, setShowModal] = useState(false)
    const [currentSpotPosition, setCurrentSpotPosition] = useState(0)
    
    const [likedSpots] = useState<Spot[]>(likedSpotsJSON ? deserialize(likedSpotsJSON) : [])

    const getCurrentSpotPosition = (id: number) => {
        const currentSpotIdx = likedSpots.findIndex(spot => spot.id == likedSpots[id].id)
        return setCurrentSpotPosition(currentSpotIdx)
	}

    const openModal = (id: number) => {
        getCurrentSpotPosition(id)
        setShowModal(true)
    }
    
    // render

    return (
        <main id={styles.main}>
            <SectionHeader>
                <SectionTitle>J&apos;aimes</SectionTitle>
                <p>Les spots qui vous ont tapé dans l&apos;œil</p>
            </SectionHeader>
            {   
                status !== "authenticated" ?
                <>
                    <div className={styles.unauthenticated}>
                        <NotConnected />
                    </div>
                </> :
                <>
                    <div className={styles.container}>
                    {
                        deviceType !== "mobile" ?
                        <>
                            {likedSpots.map((item, i) => {
                                return (
                                    <>
                                        <SpotCard
                                            key={i}
                                            displayMode='card'
                                            spot={item}
                                            onClick={() => openModal(i)}
                                        />
                                    </>
                                );
                            })}
                        </>
                        : 
                        <>
                            {likedSpots.map((item, i) => {

                                console.log(item)
                                return (
                                    <SpotCard
                                        key={i}
                                        displayMode='list'
                                        spot={item}
                                        onClick={() => openModal(i)}
                                    />
                                );
                            })}
                        </>
                    }
                    </div>

                    {
                        likedSpots?.length > 0 ?
                        <SpotDetailsModal
                            showModal={showModal}
                            setShowModal={setShowModal}
                            spots={likedSpots}
                            currentSpotPosition={currentSpotPosition}
                            setCurrentSpotPosition={setCurrentSpotPosition}
                        />
                        : <></>
                    }

                </>
            }   
            
        </main>
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
                reviews: true
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