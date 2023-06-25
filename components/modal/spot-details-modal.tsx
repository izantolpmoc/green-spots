import Button from "@components/button"
import { faArrowLeft, faMap, faShare, faXmark } from "@fortawesome/free-solid-svg-icons"
import { faComments, faHeart } from "@fortawesome/free-regular-svg-icons"
import { AnimatePresence } from "framer-motion"
import Modal from "./modal"
import styles from "@styles/components/modal/spot-details-modal.module.scss"
import { useIsMobile } from "../../hooks/breakpoints"
import StarRating from "@components/star-rating"
import { Spot } from "@lib/types"
import { useState } from "react"
import { RWebShare } from "react-web-share"

interface Props {
    showModal: boolean;
    setShowModal: (showModal: boolean) => void;
    spot: Spot
}

const SpotDetailsModal = ({ showModal, setShowModal, spot }: Props) => {
    // state

    const isMobile = useIsMobile();
    // mobile details view
    const [displayDetailsView, setDisplayDetailsView] = useState(false);
    const [distance, setDistance] = useState("2.7");


    // utils 

    const tags = spot.tags.map((tag, key) => <li className={styles.tag} key={key}>{tag.name}</li>);
    const averageRating = spot.reviews.reduce((acc, review) => acc + review.rating, 0) / spot.reviews.length ?? 0;

    // render 

    return (
        <AnimatePresence
            initial={false}
            mode='wait'
            onExitComplete={() => null}
        >
            {showModal && 
                <Modal onClose={() => { setShowModal(false); setDisplayDetailsView(false) }} removePadding className={styles.modal} customHeader={
                    <div className={styles.header} style={{
                        background: `linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, #000 100%), url(${spot.image}), lightgray 50% / cover no-repeat`,
                        height: '100%',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover',
                        }}>
                            <Button
                                onClick={() => { setShowModal(false); setDisplayDetailsView(false) }}
                                icon={isMobile ? faArrowLeft : faXmark}
                                action="big"
                                role="secondary"
                                className={styles.closeBtn}
                                dark
                            />
                            
                            <div className={styles.headerContent}>
                                
                                {!displayDetailsView && <div className={styles.actionIcons}>
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
                                    <RWebShare
                                        data={{
                                            text: spot.description,
                                            url: window.location.href,
                                            title: spot.name,
                                        }}
                                        onClick={() => console.log("shared successfully!")}
                                    >
                                        <Button
                                            onClick={() => console.log("shared successfully!")}
                                            icon={faShare}
                                            action="big"
                                            role="secondary"
                                            dark
                                        />
                                    </RWebShare>
                                    </div>
                                }
                            </div>
                            
                            <div className={styles.body}>
                                <h3>{spot.city}</h3>
                                <h1>{spot.name}</h1>
                                <p>{spot.address}, {spot.postalCode} {spot.city}</p>
                                <div className={styles.distanceRating}>
                                    <p>À {distance} km</p>
                                    { isMobile && !displayDetailsView && <StarRating average={averageRating}/>  }
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
                                        onClick={() => setDisplayDetailsView(!displayDetailsView)}
                                        role="secondary"
                                        dark
                                        fullWidth>
                                        {displayDetailsView ? "Minimiser" : "Plus d'informations"}
                                    </Button>
                                </div>
                            }
                    </div>
                }>
                    {(!isMobile || displayDetailsView) && 
                        <div className={styles.detailsView}>

                            {!isMobile &&
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
                            }
                        
                            <ul>
                                {tags}
                            </ul>

                            <StarRating average={averageRating}/>

                            <div className={styles.description}>
                                <h3>DESCRIPTION</h3>
                                <p>{spot.description}</p>
                            </div>

                            {displayDetailsView && <div className={styles.actionIcons}>
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
                                    <RWebShare
                                        data={{
                                            text: spot.description,
                                            url: window.location.href,
                                            title: spot.name,
                                        }}
                                        onClick={() => console.log("shared successfully!")}
                                    >
                                        <Button
                                            onClick={() => console.log("shared successfully!")}
                                            icon={faShare}
                                            action="big"
                                            role="secondary"
                                            dark
                                        />
                                    </RWebShare>                                  
                                </div>
                                }
                        </div>
                    }
                </Modal>
            }
        </AnimatePresence>
    )
}

export default SpotDetailsModal