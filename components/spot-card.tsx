import React from "react";
import styles from "@styles/components/spot.module.scss"
import StarRating from "./star-rating";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
    displayMode: "list" | "grid"
    imageUrl: string
    spotCity: string
    spotName: string
    spotRating: number
    spotDistance: string
    onClick?: () => void
}

const SpotCard = ({ 
    displayMode,
    imageUrl,
    spotCity,
    spotName,
    spotRating,
    spotDistance,
    onClick
}: Props) => {

    const getdisplayMode = () => {
        let classNames = styles.card
        classNames += ' ' + styles[displayMode]
        return classNames
    }

    return (
        <section
            className={getdisplayMode()}
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
                <span className={styles.city}>{spotCity}</span>
                <span className={styles.name}>{spotName}</span>
                <div className={styles.subHeader}>
                    <StarRating average={spotRating}/>
                    { displayMode === "grid" && <span className={styles.distance}>À {spotDistance}</span> }
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