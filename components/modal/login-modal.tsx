import Button from "@components/button"
import { faSignIn, faXmark } from "@fortawesome/free-solid-svg-icons"
import { AnimatePresence } from "framer-motion"
import Modal from "./modal"
import { useState } from "react"
import styles from "@styles/components/modal/login-modal.module.scss"
import { faGoogle } from "@fortawesome/free-brands-svg-icons"
import { signIn } from "next-auth/react"
import FooterAction from "@components/layout/footer-action"

type Props = {
    showModal: boolean;
    setShowModal: (showModal: boolean) => void;
}

const LoginModal = ({ showModal, setShowModal }: Props) => {

    // state

    const [showButtons, setShowButtons] = useState(false);

    // utils

    const getHeaderClassNames = () => {
        let classNames = styles.header
        classNames += ' ' + (showButtons ? styles['showButtons'] : '')
        return classNames
    }

    // render

    return (
        <AnimatePresence
            // Disable any initial animations on children that
            // are present when the component is first rendered
            initial={false}
            // Only render one component at a time.
            // The exiting component will finish its exit
            // animation before entering component is rendered
            mode='wait'
            // Fires when all exiting nodes have completed animating out
            onExitComplete={() => null}
        >
            {showModal && 
                <Modal onClose={() => {setShowModal(false); setShowButtons(false)}} removePadding className={styles.modal} customHeader={
                    <div className={getHeaderClassNames()}>
                            <Button
                                onClick={() => {setShowModal(false); setShowButtons(false)}}
                                icon={faXmark}
                                action="big"
                                role="tertiary"
                                className={styles.closeBtn}
                                dark
                            />
                            <div className={styles.headerContent}>
                                <img className={styles.logo} src={showButtons ? "/icons/icon-green.svg" : "/icons/icon-white.svg"} alt="green-spots-logo" />
                                <h1 className={styles.title}>GREEN SPOTS</h1>
                                <p className={styles.subtitle}>LA NATURE EN VILLE</p>
                            </div>
                    </div>
                }>
                    {
                        !showButtons ?
                            <div className={styles.content}>
                                <p className={styles.contentText}>Connectez-vous pour profiter pleinement de l’application !</p>
                                <Button
                                    icon={faSignIn}
                                    onClick={() => setShowButtons(true)}>
                                    Se connecter
                                </Button>
                                <FooterAction onClick={() => {setShowModal(false); setShowButtons(false)}}>
                                    Plus tard
                                </FooterAction>
                            </div>
                        :
                            <div className={styles.content}>
                                    <div className={styles.loginButtons}>
                                        <Button
                                            icon={faGoogle}
                                            role="tertiary"
                                            className={styles.button}
                                            fullWidth
                                            onClick={() => signIn("google")}>
                                            Google
                                        </Button>
                                    </div>
                                    <FooterAction onClick={() => setShowButtons(false)}>
                                        Annuler
                                    </FooterAction>
                                </div>
                    }
                </Modal>
            }
        </AnimatePresence>
    )
}

export default LoginModal