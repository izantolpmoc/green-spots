import styles from "@styles/components/not-connected.module.scss"
import React, { useState } from "react";
import Button from "./button";
import LoginModal from "@components/modals/login-modal";

const NotConnected = () => {

    const [showLoginModal, setShowLoginModal] = useState<boolean>(false)

    const handlerLoginModal = () => {
        setShowLoginModal(false);
    }

    return ( 
        <div className={styles.container}>
            <img className={styles.image} src="/assets/not-connected.svg" alt="not-connected-image" />
            { showLoginModal 
                ? 
                    <LoginModal showModal={showLoginModal} onClose={handlerLoginModal}/> 
                :
                <>
                    <Button 
                        role="primary"
                        onClick = {() => setShowLoginModal(true) }
                    >
                        Connexion
                    </Button>
                </>
            }
        </div>
    )
}

export default NotConnected;
