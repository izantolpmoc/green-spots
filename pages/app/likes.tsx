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

interface Props {
	likedSpots: SuperJSONResult,
}

const Likes = (
    { likedSpots }: Props
) => {

    const { data: session, status } = useSession()
    const deviceType = useDeviceType();
    const [showModal, setShowModal] = useState(false);
    
    const [data] = useState(likedSpots ? deserialize(likedSpots) : []);

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
                                        onClick={() => setShowModal(true)}
                                    />
                                );
                            })}
                        </div>
                    </>
                    : 

                    <>
                        <div className={styles.container}>
                            {data.map((item, i) => {
                                return (
                                    <SpotCard
                                        key={i}
                                        displayMode='list'
                                        spot={item}
                                        onClick={() => setShowModal(true)}
                                    />
                                );
                            })}
                        </div>
                    </>
                }

                {/* <SpotDetailsModal showModal={showModal} setShowModal={setShowModal} spots={data} currentSpotPosition={currentSpotPosition} setCurrentSpotPosition={setCurrentSpotPosition}></SpotDetailsModal> */}
                </>
            }   


        </main>
    )
}

export const getServerSideProps: GetServerSideProps<Props> = async (context) => {

    const session = await getServerSession(context.req, context.res, authOptions)

    let email = session.user.email;

    const rawData = await getUser(email)
      
    const likedSpots = serialize(rawData.likedSpots)
    
    // return 

    return {
        props : {
            likedSpots
        }
    }
}

export default Likes