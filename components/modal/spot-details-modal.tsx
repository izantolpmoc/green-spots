import Button from "@components/button"
import { faArrowLeft, faMap, faShare, faXmark } from "@fortawesome/free-solid-svg-icons"
import { faComments, faHeart } from "@fortawesome/free-regular-svg-icons"
import { AnimatePresence } from "framer-motion"
import Modal from "./modal"
import styles from "@styles/components/modal/spot-details-modal.module.scss"
import { useIsMobile } from "../../hooks/breakpoints"
import StarRating from "@components/star-rating"
import { Spot } from "@lib/types"

interface Props {
    showModal: boolean;
    setShowModal: (showModal: boolean) => void;
    spot: Spot
}

const SpotDetailsModal = ({ showModal, setShowModal, spot }: Props) => {
    const isMobile = useIsMobile();
    const tags = spot.tags.map((tag, key) => <li className={styles.tag} key={key}>{tag.name}</li>)

    return (
        <AnimatePresence
            initial={false}
            mode='wait'
            onExitComplete={() => null}
        >
            {showModal && 
                <Modal onClose={() => setShowModal(false)} removePadding className={styles.modal} customHeader={
                    <div className={styles.header} style={{
                        background: `linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, #000 100%), url(${spot.image}), lightgray 50% / cover no-repeat`,
                        height: '100%',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        }}>
                            <Button
                                onClick={() => setShowModal(false)}
                                icon={isMobile ? faArrowLeft : faXmark}
                                action="big"
                                role="secondary"
                                className={styles.closeBtn}
                                dark
                            />
                            
                            <div className={styles.headerContent}>
                                <div className={styles.actionIcons}>
                                    <Button
                                        onClick={() => setShowModal(false)}
                                        icon={faHeart}
                                        action="big"
                                        role="secondary"
                                        dark
                                    />
                                    <Button
                                        onClick={() => setShowModal(false)}
                                        icon={faComments}
                                        action="big"
                                        role="secondary"
                                        dark
                                    />
                                    <Button
                                        onClick={() => setShowModal(false)}
                                        icon={faShare}
                                        action="big"
                                        role="secondary"
                                        dark
                                    />
                                </div>
                            </div>
                            
                            <div className={styles.body}>
                                <h3>{spot.city}</h3>
                                <h1>{spot.name}</h1>
                                <p>{spot.address}, {spot.postalCode} {spot.city}</p>
                                <div className={styles.distanceRating}>
                                    <p>À 3.5 km</p>
                                    { isMobile && <StarRating average={2.5}/>  }
                                </div>
                            </div>

                            {isMobile &&
                                <div className={styles.actionButtons}>
                                    <Button
                                        onClick={() => console.log("do something")}
                                        icon={faMap}
                                        role="primary"
                                        dark
                                        fullWidth>
                                        Y aller
                                    </Button>
                                    
                                        <Button
                                            onClick={() => console.log("do something")}
                                            role="secondary"
                                            dark
                                            fullWidth>
                                            Plus d'informations
                                    </Button>
                                </div>
                            }
                            
                    </div>
                }>
                    {!isMobile && 
                        <div className={styles.detailsView}>
                            <div className={styles.actionButtons}>
                                <Button
                                    onClick={() => console.log("do something")}
                                    icon={faMap}
                                    role="primary"
                                    dark
                                    fullWidth>
                                    Y aller
                                </Button>
                            </div>
                        
                            <ul>
                                {tags}
                            </ul>

                            <StarRating average={2.5}/>

                            <div className={styles.description}>
                                <h3>DESCRIPTION</h3>
                                <p>{spot.description}</p>
                            </div>
                        </div>
                    }
                </Modal>
            }
        </AnimatePresence>
    )
}

export default SpotDetailsModal