import Button from "@components/button";

import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence } from "framer-motion";
import Modal from "@components/modals/modal";
import SectionTitle from "@components/section-title";
import styles from "@styles/components/modals/my-account-modal.module.scss";
import { useSession, signOut } from 'next-auth/react'
import { SessionUser } from "@lib/types";
import { useState } from "react";
import Toast from "@components/toast";
import AccountDeletionModal from "./account-deletion-modal";

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
    const [showDeletionSuccessToast, setShowDeletionSuccessToast] = useState(false)
    const [showDeletionErrorToast, setShowDeletionErrorToast] = useState(false)

    const handleDeleteAccount = () => setShowDeleteAccountModal(true)

    const onAccountDeletion = async () => {
        if(!user) return

        setShowDeleteAccountModal(false)
        
        // make an api call to delete the account

        const result = await fetch(`/api/users/${user.id}`, {
            method: 'DELETE'
        })

        if(result.status === 200) {
            // show a toast
            setShowDeletionSuccessToast(true)
            // wait 2 seconds
            setTimeout(() => {
                // sign out the user
                signOut()
            }, 3000)
        } else {
            setShowDeletionErrorToast(true)
            console.log(await result.text())
        }

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
                                    onClick={() => handleDeleteAccount()}
                                >
                                    Supprimer mon compte
                                </Button>
                            </div>
                        </section>
                    </Modal>
                }
            </AnimatePresence>
            <AccountDeletionModal 
                showModal={showDeleteAccountModal}
                onClose={() => setShowDeleteAccountModal(false)}
                onConfirm={onAccountDeletion}
            />
            <Toast 
                showToast={showDeletionSuccessToast}
                onHide={() => setShowDeletionSuccessToast(false)}>
                Votre compte a bien été supprimé.
            </Toast>
            <Toast
                status="error"
                showToast={showDeletionErrorToast}
                onHide={() => setShowDeletionErrorToast(false)}>
                Une erreur est survenue.
            </Toast>

        </>
    ) : <></>
}

export default MyAccountModal;
