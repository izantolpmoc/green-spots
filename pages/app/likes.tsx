import SectionHeader from "@components/layout/section-header"
import SectionTitle from "@components/section-title"
import useDeviceType from "../../hooks/use-device-type";
import { getSpots } from '@lib/helpers/spots'
import { GetServerSideProps } from 'next'
import { serialize, deserialize } from 'superjson'
import { SuperJSONResult } from 'superjson/dist/types'
import { useSession } from "next-auth/react";
import { SessionUser } from "@lib/types";
import LoginModal from "@components/modals/login-modal";
import NotConnected from "@components/not-connected";
import styles from "@styles/pages/likes.module.scss";

interface Props {
	spots: SuperJSONResult,
	open: boolean;
	id: string | string[] | undefined;
}

const Likes = () => {

    const { data: session, status } = useSession()
    const user = session?.user as SessionUser | undefined
    const deviceType = useDeviceType();
    
    // render

    return (
        <main id={styles.main}>
            <SectionHeader>
                <SectionTitle>J&apos;aimes</SectionTitle>
                <p>Les spots qui vous ont tapé dans l&apos;œil</p>
            </SectionHeader>
            

            {   status !== "authenticated" &&
                <>
                    <div className={styles.authenticated}>
                        <NotConnected />
                    </div>
                </>
            }   
        </main>
    )
}

export default Likes