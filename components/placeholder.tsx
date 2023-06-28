import styles from "@styles/components/placeholder.module.scss"
import React from "react";

interface Props {
    children?: any;
    illustrationURL?: string;
    button?: any;
}

const PlaceHolder = (

    { 
        children,
        illustrationURL,
        button
    }: Props
) => {

    // render

    return ( 
        <div className={styles.container}>
            <img className={styles.image} src={illustrationURL} alt="place-holder-image" />
            <div className={styles.textContainer}>
                {children}
            </div>

            { 
                button ?
                button
                : <></>
            }
        </div>
    )
}

export default PlaceHolder;
