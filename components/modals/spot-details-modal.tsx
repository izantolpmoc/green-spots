import Button from "@components/button"
import { faArrowLeft, faMap, faShare, faXmark, faHeart as filledHeart } from "@fortawesome/free-solid-svg-icons"
import { faComments, faHeart } from "@fortawesome/free-regular-svg-icons"
import { AnimatePresence } from "framer-motion"
import Modal from "./modal"
import styles from "@styles/components/modals/spot-details-modal.module.scss"
import useDeviceType from "../../hooks/use-device-type"
import StarRating from "@components/star-rating"
import { SessionUser, Spot } from "@lib/types"
import { useEffect, useState } from "react"
import { RWebShare } from "react-web-share"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useSession } from "next-auth/react"
import Toast from "@components/toast"

interface Props {
    showModal: boolean;
    setShowModal: (showModal: boolean) => void;
    spots: Spot[];
    currentSpotPosition: number;
    setCurrentSpotPosition: (currentSpotPosition: number) => void;
}

const SpotDetailsModal = ({ showModal, setShowModal, spots, currentSpotPosition, setCurrentSpotPosition}: Props) => {
    
    // state

    const deviceType = useDeviceType();
    const isMobile = deviceType === 'mobile';
    const currentUser = useSession().data?.user as SessionUser | undefined;

    // mobile details view
    const [displayDetailsView, setDisplayDetailsView] = useState(false);
    const [distance, setDistance] = useState("2.7");
    const [shareableUrl, setShareableUrl] = useState('');
    const [isLiked, setIsLiked] = useState(false);
    const [displayAddToFavoritesErrorToast, setDisplayAddToFavoritesErrorToast] = useState(false);
    const [spot, setSpot] = useState(spots[currentSpotPosition]);


    useEffect(() => {
        // This will only run on the client side, where window is available

        if (typeof window === 'undefined' || !spot) return

        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);
        
        // Only add 'open' and 'id' if they don't already exist in the URL

        if (!params.has('open')) params.append('open', 'true');
        if (!params.has('id')) params.append('id', spot.id);

        // Use the updated params in the url

        url.search = params.toString();
        
        setShareableUrl(url.toString());

        if(spot.likedBy?.find(user => user.id === currentUser?.id))
            setIsLiked(true);

    }, [spot])

    useEffect(() => {
        setSpot(spots[currentSpotPosition])
    }, [currentSpotPosition, spots])


    // utils 

    const averageRating = spot ? spot.reviews.reduce((acc, review) => acc + review.rating, 0) / spot.reviews.length : 0
    
    // handle favorites

    const toggleFavorites = async () => {
        if(!currentUser)
            return setDisplayAddToFavoritesErrorToast(true);

        try {
            await fetch(`/api/spots/like/` + spot.id, { method: 'PUT'})
        }
        catch { console.log("Error adding to favorites") }

        setIsLiked(!isLiked)
    }

    // handle swipe

    const onSwipeLeft = () => {
        if (currentSpotPosition < spots.length - 1) {
            setCurrentSpotPosition(currentSpotPosition + 1);
            setSpot(spots[currentSpotPosition + 1]);
        }
    }

    const onSwipeRight = () => {
        if (currentSpotPosition > 0) {
            setCurrentSpotPosition(currentSpotPosition - 1);
            setSpot(spots[currentSpotPosition - 1]);
        }
    }

    const getSwipeButtonClassNames = (idx: number) => {
        let classNames = styles.swipeButton
        classNames += ' ' + (currentSpotPosition === idx ? styles['isActive'] : '')
        return classNames
    }

    const swipeButtons = spots.map((spot, key) => (
        <Button 
            key={key}
            onClick={() => {
                setCurrentSpotPosition(key)
                setSpot(spot)
            }} 
            className={getSwipeButtonClassNames(key)}
        />
    ))
        



    // render 

    return spot ? (
        <AnimatePresence
            initial={false}
            mode='wait'
            onExitComplete={() => null}
        >
            {showModal && 
                <Modal key="modal" onSwipeRight={onSwipeRight} onSwipeLeft={onSwipeLeft} onClose={() => { setShowModal(false); setDisplayDetailsView(false) }} removePadding className={styles.modal} customHeader={
                    <div className={styles.header} style={{
                        background: `linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, #000 100%), url(${spot.image || ""}) no-repeat center center / cover lightgray`,
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
                                        onClick={() => toggleFavorites()}
                                        icon={isLiked ? filledHeart : faHeart}
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
                                            url: shareableUrl,
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
                                    <a
                                        className={styles.mapLink}
                                        target="_blank"
                                        href={`https://maps.google.com/?q=${spot.name} ${spot.address} ${spot.postalCode} ${spot.city}`}>
                                        <FontAwesomeIcon icon={faMap} />
                                        <span>Y aller</span>
                                    </a>
                                    
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
                                    <a
                                        className={styles.mapLink}
                                        target="_blank"
                                        href={`https://maps.google.com/?q=${spot.name} ${spot.address} ${spot.postalCode} ${spot.city}`}>
                                        <FontAwesomeIcon icon={faMap} />
                                        <span>Y aller</span>
                                    </a>
                                </div>
                            }
                        
                            <ul>
                            {
                                spot ?
                                spot.tags.map((tag, key) => <li className={styles.tag} key={key}>{tag.name}</li>)
                                : <></>
                            }
                            </ul>

                            <StarRating average={averageRating}/>

                            <div className={styles.description}>
                                <h3>DESCRIPTION</h3>
                                <p>{spot.description}</p>
                            </div>

                            {displayDetailsView && <div className={styles.actionIcons}>
                                    <Button
                                        onClick={() => toggleFavorites()}
                                        icon={isLiked ? filledHeart : faHeart}
                                        action="big"
                                        role="secondary"
                                        className={styles.lighterBg}
                                        dark
                                    />
                                    <Button
                                        onClick={() => setShowModal(false)}
                                        icon={faComments}
                                        action="big"
                                        role="secondary"
                                        className={styles.lighterBg}
                                        dark
                                    />
                                    <RWebShare
                                        data={{
                                            text: spot.description,
                                            url: shareableUrl,
                                            title: spot.name,
                                        }}
                                        onClick={() => console.log("shared successfully!")}
                                    >
                                        <Button
                                            onClick={() => console.log("shared successfully!")}
                                            icon={faShare}
                                            action="big"
                                            role="secondary"
                                            className={styles.lighterBg}
                                            dark
                                        />
                                    </RWebShare>                                  
                                </div>
                                }
                        </div>
                    }
                    { isMobile && !displayDetailsView && <div className={styles.swipeButtons}>
                        {swipeButtons}
                        </div>
                    }
                </Modal>
            }
            <Toast 
                status='info'
                showToast={displayAddToFavoritesErrorToast}
                onHide={() => setDisplayAddToFavoritesErrorToast(false)}>
                Connectez vous pour effectuer cette action.
            </Toast>
        </AnimatePresence>
    ) : <></>
}

export default SpotDetailsModal