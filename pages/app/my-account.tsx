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

    const getClassNames = (item: string) => {
        let classNames = `${styles[item]}`;
        return classNames;
    }

    const { data: session, status } = useSession();

    useEffect(() => {
        console.log("session", session)
    }, [session])

    const SectionContainer = () => {
        return (
            <section className={getClassNames("container")}>

                {sectionProfil()}

                <div className={getClassNames("buttons")}>
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
                        dark={true}
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
            <section className={getClassNames("user-info")}>
                <img className={getClassNames("user-image")} alt="User image" src={session?.user?.image || "/assets/user.png"}/>
                <div className={getClassNames("group")}>
                    <div className={getClassNames("info")}>{ session?.user?.name }</div>
                    { /* @ts-ignore */ }
                    { session?.user?.isModerator || session?.user?.isModerator && <img className={getClassNames("logo")} alt="Logo" src="/assets/certif.png" /> }
                </div>
                <div className={getClassNames("sub-info")}>{ session?.user?.email} </div>
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
                                <Button 
                                    icon={faArrowLeft}
                                    onClick={() => setShowModal(!showModal)}>
                                    COUCOU JE MANGE LA GLACE ?
                                </Button>
                            
                                <AnimatePresence
                                    initial={false}
                                    mode='wait'
                                    onExitComplete={() => null}
                                >
                                    {showModal && 
                                        <Modal onClose={() => setShowModal(false)}>
                                            <SectionTitle 
                                                title="My Account"  
                                                instance="desktop"
                                            />
                                            <SectionContainer />
                                        </Modal>
                                    }
                                </AnimatePresence>
                            </BrowserView>

                            <MobileView>
                                <SectionTitle 
                                    title="My Account"
                                    instance="mobile"
                                />
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