import Button from "@components/button";

import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence } from "framer-motion";
import Modal from "@components/modal/modal";
import SectionTitle from "@components/section-title";
import styles from "@styles/components/modal/my-account-modal.module.scss";
import { useSession, signOut } from 'next-auth/react'
import { SessionUser } from "@lib/types";
import { useState } from "react";
import ConfirmModal from "./confirm-modal";

interface Props {
    showModal: boolean;
    onClose: () => void;
}

const MyAccountModal = (
    { showModal, onClose }: Props
) => {


    const user = useSession().data?.user as SessionUser | undefined

    // handle account deletion

    const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false)

    const handleDeleteAccount = () => setShowDeleteAccountModal(true)

    const onAccountDeletion = async () => {
        if(!user) return
        
        // make an api call to delete the account

        const result = await fetch(`/api/user/${user.id}`, {
            method: 'DELETE'
        })
        signOut()

    }


    // render

    return user ? (
        <>
            <AnimatePresence
                initial={false}
                mode='wait'
                onExitComplete={() => null}>
                {showModal && 
                    <Modal onClose={onClose} className={styles.modal} large>

                        <SectionTitle>Mon compte</SectionTitle>

                        <section className={styles.container}>
                            <section className={styles.userInfo}>
                                <img className={styles.userImage} alt="User image" src={user.image || "/assets/user.svg"}/>
                                <div className={styles.textInfo}>
                                    <div className={styles.userName}>{ user.name }</div>
                                    { 
                                        user.isModerator || user.isModerator ?
                                        <img className={styles.logo} alt="Logo" src="/assets/certif.svg" /> 
                                        : 
                                        <></> 
                                    }
                                </div>
                                <div className={styles.subInfo}>{ user.email} </div>
                            </section>

                            <div className={styles.buttons}>
                                <Button 
                                    icon={faSignOut}
                                    role="secondary"
                                    fullWidth
                                    onClick={signOut}
                                >
                                    Se déconnecter
                                </Button>

                                <Button 
                                    role="tertiary"
                                    error
                                    fullWidth
                                    onClick={handleDeleteAccount}
                                >
                                    Supprimer mon compte
                                </Button>
                            </div>
                        </section>
                    </Modal>
                }
            </AnimatePresence>
            <ConfirmModal 
                showModal={showDeleteAccountModal}
                onClose={() => setShowDeleteAccountModal(false)}
                onConfirm={onAccountDeletion}>
                Êtes-vous sûr de vouloir supprimer votre compte ?
            </ConfirmModal>
        </>
    ) : <></>
}

export default MyAccountModal;
