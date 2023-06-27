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
	likedSpots: SuperJSONResult | null,
}

const Likes = (
    { likedSpots }: Props
) => {

    const { data: session, status } = useSession()
    const deviceType = useDeviceType();
    const [showModal, setShowModal] = useState(false);
    const [currentSpotPosition, setCurrentSpotPosition] = useState(0);
    
    const [data] = useState(likedSpots ? deserialize(likedSpots) : []);

    const getCurrentSpotPosition = (id: number) => {
        const spots = data as unknown as Spot[];

        const currentSpotIdx = spots?.findIndex(spot => spot.id == spots[id].id);

        return setCurrentSpotPosition(currentSpotIdx);
	}

    const openModal = (id: number) => {
        getCurrentSpotPosition(id);
        setShowModal(true);
    }
    
    // render

    return (
        <main id={styles.main}>
            <SectionHeader>
                <SectionTitle>J&apos;aimes</SectionTitle>
                <p>Les spots qui vous ont tapé dans l&apos;œil</p>
            </SectionHeader>
            

            {   status !== "authenticated" ?
                <>
                        <div className={styles.authenticated}>
                            <NotConnected />
                        </div>
                </> :
                <>
                    
                    {
                        deviceType !== "mobile" ?
                        <>
                          <div className={styles.container}>
                                {data.map((item, i) => {
                                    return (
                                        <SpotCard
                                            key={i}
                                            displayMode='card'
                                            spot={item}
                                            onClick={() => openModal(i)}
                                        />
                                    );
                                })}
                            </div>
                        </>
                        : 

                        <>
                            <div className={styles.container}>
                                {data.map((item, i) => {

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
                            </div>
                        </>
                    }

                    <SpotDetailsModal
                        showModal={showModal}
                        setShowModal={setShowModal}
                        spots={data}
                        currentSpotPosition={currentSpotPosition}
                        setCurrentSpotPosition={setCurrentSpotPosition}
                    />

                </>
            }   
            
        </main>
    )
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {

    const session = await getServerSession(context.req, context.res, authOptions)

    if(!session) return {
        props: {
            likedSpots: null
        }
    }

    let email = session.user.email;

    const rawData = await getUser(email)

    const likedSpots: any[] = []

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
      
    const likedSpotsJSON = serialize(likedSpots)
    
    // return 

    return {
        props : {
            likedSpots: likedSpotsJSON
        }
    }
}

export default Likes