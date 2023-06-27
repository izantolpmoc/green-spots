import styles from "@styles/components/not-connected.module.scss"
import React, { useState } from "react";
import Button from "./button";
import LoginModal from "@components/modals/login-modal";
import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";

const NotConnected = () => {

    // state

    const [showLoginModal, setShowLoginModal] = useState<boolean>(false)

    // render

    return ( 
        <>
            <div className={styles.container}>
                <img className={styles.image} src="/assets/not-connected.svg" alt="not-connected-image" />
                <div className={styles.textContainer}>
                    <h3>Vous n&apos;êtes pas connecté</h3>
                    <p>Connectez-vous pour accéder à cette page</p>
                </div>
                <Button 
                    icon={faArrowRightToBracket}
                    role="primary"
                    onClick = {() => setShowLoginModal(true) }>
                    Connexion
                </Button>
            </div>
            <LoginModal 
                showModal={showLoginModal} 
                onClose={() => setShowLoginModal(false)}
            /> 
        </>
    )
}

export default NotConnected
