import SpotDetailsModal from "@components/modals/spot-details-modal";
import SpotCard from "@components/spot-card";
import { Spot } from "@lib/types";

import styles from "@styles/components/layout/dynamic-spots-grid.module.scss";
import { useState } from "react";

interface Props {
    spots: Spot[];
    className?: string;
}

const DynamicSpotsGrid = (
    { spots, className }: Props
) => {

    // state

    const [showModal, setShowModal] = useState(false)
    const [currentSpotPosition, setCurrentSpotPosition] = useState(0)


    // handlers

    const handleSpotClick = (index: number) => {
        setCurrentSpotPosition(index)
        setShowModal(true)
    }

    // utils

    const getClassNames = () => {
        let classNames = styles.grid
        classNames += (className ? ' ' + className : '')
        return classNames
    }


    // render

    return (
        <>

            <ul className={getClassNames()}>
            {
                spots.map((item, i) => (
                    <SpotCard
                        key={i}
                        onClick={() => handleSpotClick(i)}
                        className={styles.card}
                        displayMode='card'
                        spot={item}
                    />
                ))
            }
            </ul>
            <SpotDetailsModal 
                showModal={showModal} 
                setShowModal={setShowModal} 
                spots={spots} 
                currentSpotPosition={currentSpotPosition} 
                setCurrentSpotPosition={setCurrentSpotPosition} 
            />
        </>
    )

}

export default DynamicSpotsGrid;