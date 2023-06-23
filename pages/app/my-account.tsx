import Button from "@components/button";

import { faArrowLeft, faSignOut } from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";
import Modal from "@components/modal/modal";
import SectionTitle from "@components/section-title";
import { BrowserView, MobileView } from 'react-device-detect';
import { useEffect } from "react";
import Link from 'next/link'
import styles from "@styles/pages/my-account.module.scss";
import { useSession, signOut } from 'next-auth/react'

const MyAccount = () => {

    const [showModal, setShowModal] = useState(false);

    const { data: session, status } = useSession();

    const SectionContainer = () => {
        return (
            <section className={styles.container}>

                {sectionProfil()}

                <div className={styles.buttons}>
                    <Button 
                        icon={faSignOut}
                        role="secondary"
                        fullWidth={true}
                        onClick={signOut}
                    >
                        Se déconnecter
                    </Button>

                    <Button 
                        role="tertiary"
                        fullWidth={true}
                        onClick={signOut}
                    >
                        Supprimer mon compte
                    </Button>
                </div>
            </section>
        )
    }
    const sectionProfil = () => {
        return (
            <section className={styles.userInfo}>
                <img className={styles.userImage} alt="User image" src={session?.user?.image || "/assets/user.png"}/>
                <div className={styles.group}>
                    <div className={styles.info}>{ session?.user?.name }</div>
                    { /* @ts-ignore */ }
                    { session?.user?.isModerator || session?.user?.isModerator && <img className={styles.logo} alt="Logo" src="/assets/certif.png" /> }
                </div>
                <div className={styles.subInfo}>{ session?.user?.email} </div>
            </section>
        )
    }

    return (
        <> 
            <main>  
                { 
                    status === 'loading' ? (
                        <p>Chargement...</p>
                    ) : status === 'authenticated' ? (
                        <>
                             <BrowserView>
                            
                                <AnimatePresence
                                    initial={false}
                                    mode='wait'
                                    onExitComplete={() => null}
                                >
                                    {showModal && 
                                        <Modal onClose={() => setShowModal(false)}>
                                            <SectionTitle instance="desktop">MON COMPTE</SectionTitle>
                                            <SectionContainer />
                                        </Modal>
                                    }
                                </AnimatePresence>
                            </BrowserView>

                            <MobileView>
                                <SectionTitle instance="mobile">MON COMPTE</SectionTitle>
                                <SectionContainer />
                            </MobileView>
                        </>
                    ) : (
                        <Link href="/api/auth/signin">
                            Se connecter
                        </Link>
                    )
                }
            </main>
        </>
    )
}

export default MyAccount;
