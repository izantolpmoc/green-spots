import React from "react";
import styles from "@styles/components/spot.module.scss"
import StarRating from "./star-rating";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Spot } from "@lib/types";

interface Props {
    displayMode: "list" | "grid"
    spot: Spot
    onClick?: () => void
}

const SpotCard = ({ 
    displayMode,
    spot,
    onClick
}: Props) => {

    // utils

    const getSpotRating = () => 4 // TODO

    const getSpotDistance = () => 2.3 // TODO
        
    const getClassNames = () => {
        let classNames = styles.card
        classNames += ' ' + styles[displayMode]
        return classNames
    }

    // render

    return (
        <section
            className={getClassNames()}
            style={
                displayMode === "grid"
                ? {
                    backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0) 60%, rgb(0, 0, 0) 100%), url(${imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                    }
                : {}
            }
            onClick={onClick}
            >
            {displayMode !== "grid" && (
                <div
                className={styles.image}
                style={{
                    background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 60%, rgb(0, 0, 0) 100%), url(${imageUrl}) `,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
                />
            )}
            <div className={styles.mainHeader}>
                <span className={styles.city}>{spot.city}</span>
                <span className={styles.name}>{spot.name}</span>
                <div className={styles.subHeader}>
                    <StarRating average={getSpotRating()}/>
                    { displayMode === "grid" && <span className={styles.distance}>À {getSpotDistance}</span> }
                </div>
            </div>
            { displayMode === "list" && (
                <div className={styles.containerIcon}>
                    <FontAwesomeIcon className={styles.icon} icon={faHeart} />
                </div>
            )}
        </section>
    );
}

export default SpotCard;
