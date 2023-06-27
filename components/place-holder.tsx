import styles from "@styles/components/place-holder.module.scss"
import React, { useState } from "react";
import Button from "./button";
import LoginModal from "@components/modals/login-modal";
import { faArrowRightToBracket } from "@fortawesome/free-solid-svg-icons";

interface Props {
    children?: any;
    type: "noConnexion" | "likeLess";
}

const PlaceHolder = (

    { 
        children,
        type

    }: Props
) => {

    // state

    const [showLoginModal, setShowLoginModal] = useState<boolean>(false)

    const getImgUrl = () => {
        switch (type) {
            case "noConnexion":
                return "/assets/not-connected.svg"
            case "likeLess":
                return "/assets/likeless.svg"
        }
    }

    // render

    return ( 
        <>
            <div className={styles.container}>
                <img className={styles.image} src={getImgUrl()} alt="place-holder-image" />
                <div className={styles.textContainer}>
                    {children}
                </div>

                { type == "noConnexion" &&
                    <Button 
                        icon={faArrowRightToBracket}
                        role="primary"
                        onClick = {() => setShowLoginModal(true) }>
                        Connexion
                    </Button>
                }
            </div>

            <LoginModal 
                showModal={showLoginModal} 
                onClose={() => setShowLoginModal(false)}
            /> 
        </>
    )
}

export default PlaceHolder;
