import React, { useContext, useState } from "react";
import styles from "@styles/components/spot-card.module.scss"
import StarRating from "./star-rating";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Spot } from "@lib/types";
import { Context } from "@lib/context";
import { getDistanceFromLatLonInKm } from "@lib/helpers/spot-distance";

interface Props {
    displayMode?: "list" | "card"
    spot: Spot
    onClick?: () => void
    isLast?: boolean
    fullWidth?: boolean
}

const SpotCard = ({ 
    displayMode = "card",
    spot,
    onClick,
    isLast,
    fullWidth
}: Props) => {

    // state

    const { userLocation } = useContext(Context)


    // utils

    const getSpotRating = () => spot ? spot.reviews.reduce((acc, review) => acc + review.rating, 0) / spot.reviews.length : 0

    const getSpotDistance = () => {
        if (!userLocation) return
        const { latitude, longitude } = userLocation.coords

        // calculate distance from user to spot
        const distance = getDistanceFromLatLonInKm(latitude, longitude, spot.latitude, spot.longitude);
        return Number(distance);
    }
        
    const getClassNames = () => {
        let classNames = styles.container + ' ' + styles[displayMode]
        classNames += (isLast ? ' ' + styles.isLast : '')
        classNames += (fullWidth ? ' ' + styles.fullWidth : '')
        return classNames
    }

    // render

    return (
        <section
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
        </section>
    );
}

export default SpotCard;
