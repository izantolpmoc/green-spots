import React from "react";
import styles from "@styles/components/spot-card.module.scss"
import StarRating from "./star-rating";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Spot } from "@lib/types";

interface Props {
    displayMode?: "list" | "card"
    spot: Spot
    onClick?: () => void
    isLast?: boolean
    fullWidth?: boolean
    className?: string
}

const SpotCard = ({ 
    displayMode = "card",
    spot,
    onClick,
    isLast,
    fullWidth,
    className
}: Props) => {

    // utils

    const getSpotRating = () => 4 // TODO

    const getSpotDistance = () => 2.3 // TODO
        
    const getClassNames = () => {
        let classNames = className + ' ' + styles.container + ' ' + styles[displayMode]
        classNames += (isLast ? ' ' + styles.isLast : '')
        classNames += (fullWidth ? ' ' + styles.fullWidth : '')
        classNames += (className ? ' ' + className : '')
        return classNames
    }

    // render

    return (
        <li
            className={getClassNames()}
            style={
                displayMode === "card"
                ? {
                    backgroundImage: `linear-gradient(180deg, rgba(0, 0, 0, 0) 60%, rgb(0, 0, 0) 100%), url(${spot.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                    }
                : {}
            }
            onClick={onClick}
            >
            {displayMode !== "card" && (
                <div
                className={styles.image}
                style={{
                    background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 60%, rgb(0, 0, 0) 100%), url(${spot.image}) `,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }}
                />
            )}
            <div className={styles.mainHeader}>
                <div className={styles.title}>
                    <span className={styles.city}>{spot.city}</span>
                    <span className={styles.name}>{spot.name}</span>
                </div>
                <div className={styles.subHeader}>
                    <StarRating average={getSpotRating()}/>
                    { displayMode === "card" && <span className={styles.distance}>À {getSpotDistance()} km</span> }
                </div>
            </div>
            { displayMode === "list" && (
                <div className={styles.containerIcon}>
                    <FontAwesomeIcon className={styles.icon} icon={faHeart} />
                </div>
            )}
        </li>
    );
}

export default SpotCard;
