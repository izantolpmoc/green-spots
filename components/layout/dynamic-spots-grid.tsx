import SpotDetailsModal from "@components/modals/spot-details-modal";
import SpotCard from "@components/spot-card";
import { Spot } from "@lib/types";

import styles from "@styles/components/layout/dynamic-spots-grid.module.scss";
import { useState } from "react";
import useDeviceType from "../../hooks/use-device-type";

interface Props {
    spots: Spot[];
    updateSpot: (index: number, spot: Spot) => void;
    displayListOnMobile?: boolean;
    className?: string;
}

const DynamicSpotsGrid = (
    {
        spots,
        updateSpot,
        displayListOnMobile = false,
        className
    }: Props
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

    const deviceType = useDeviceType()


    // render

    return (
        <>

            <ul className={getClassNames()}>
            {
                spots.map((item, i) => (
                    <SpotCard
                        key={item.id+i}
                        onClick={() => handleSpotClick(i)}
                        className={deviceType !== 'mobile' || !displayListOnMobile ? styles.card : ''}
                        displayMode={deviceType == 'mobile' && displayListOnMobile ? 'list' : 'card'}
                        spot={item}
                    />
                ))
            }
            </ul>
            <SpotDetailsModal 
                showModal={showModal} 
                setShowModal={setShowModal} 
                updateSpot={updateSpot}
                spots={spots} 
                currentSpotPosition={currentSpotPosition} 
                setCurrentSpotPosition={setCurrentSpotPosition} 
            />
        </>
    )

}

export default DynamicSpotsGrid;