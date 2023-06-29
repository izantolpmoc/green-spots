import Button from "@components/button"
import { faArrowLeft, faMap, faShare, faXmark, faHeart as filledHeart } from "@fortawesome/free-solid-svg-icons"
import { faComments, faHeart } from "@fortawesome/free-regular-svg-icons"
import { AnimatePresence } from "framer-motion"
import Modal from "./modal"
import styles from "@styles/components/modals/spot-details-modal.module.scss"
import useDeviceType from "../../hooks/use-device-type"
import StarRating from "@components/star-rating"
import { SessionUser, Spot } from "@lib/types"
import { useContext, useEffect, useState } from "react"
import { RWebShare } from "react-web-share"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useSession } from "next-auth/react"
import Toast from "@components/toast"
import ReviewsModal from "./reviews-modal"
import ReviewsContent from "@components/reviews-content"
import SectionTitle from "@components/section-title"
import { Context } from '@lib/context'
import { getDistanceFromLatLonInKm } from "@lib/helpers/spot-distance"

interface Props {
    showModal: boolean;
    setShowModal: (showModal: boolean) => void;
    spots: Spot[];
    updateSpot: (index: number, spot: Spot) => void;
    currentSpotPosition: number;
    setCurrentSpotPosition: (currentSpotPosition: number) => void;
}

const SpotDetailsModal = ({ showModal, setShowModal, spots, updateSpot, currentSpotPosition, setCurrentSpotPosition}: Props) => {
    
    // state

    const deviceType = useDeviceType();
    const isMobile = deviceType === 'mobile';
    const currentUser = useSession().data?.user as SessionUser | undefined;
    const { userLocation } = useContext(Context)

    // mobile details view
    const [displayDetailsView, setDisplayDetailsView] = useState(false);
    const [distance, setDistance] = useState('0');
    const [shareableUrl, setShareableUrl] = useState('');
    const [displayAddToFavoritesErrorToast, setDisplayAddToFavoritesErrorToast] = useState(false);
    const [spot, setSpot] = useState(spots[currentSpotPosition]);
    const [openReviews, setOpenReviews] = useState(false);
    const [openDesktopReviews, setOpenDesktopReviews] = useState(false);
    const [displayModerationToast, setDisplayModerationToast] = useState(false);

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

        getDistanceToSpot();

    }, [spot, userLocation])

    // helpers

    // check whether user appears in spot's likedBy list

    const isLiked = () => !!spot.likedBy?.find(user => user.id === currentUser?.id)

    useEffect(() => {
        setSpot(spots[currentSpotPosition])
    }, [currentSpotPosition, spots])


    // utils 

    const averageRating = spot ? spot.reviews.reduce((acc, review) => acc + review.rating, 0) / spot.reviews.length : 0
    
    //handler user location

    const getDistanceToSpot = () => {
        if (!userLocation) return
        const { latitude, longitude } = userLocation.coords

        // calculate distance from user to spot
        const distance = getDistanceFromLatLonInKm(latitude, longitude, spot.latitude, spot.longitude);
        setDistance(distance)
    }       

    // handle favorites

    const toggleFavorites = async () => {
        if(!currentUser)
            return setDisplayAddToFavoritesErrorToast(true);

        try {
            await fetch(`/api/spots/like/` + spot.id, { method: 'PUT'})
        }
        catch { console.log("Error adding to favorites") }

        await reloadCurrentSpot()
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
            key={`${key}_${spot.id}`}
            onClick={() => {
                setCurrentSpotPosition(key)
                setSpot(spot)
            }} 
            className={getSwipeButtonClassNames(key)}
        />
    ))

    const reloadCurrentSpot = async () => {
        try {
            const response = await fetch(`/api/spots/${spot.id}`, {
                method: 'GET',
            }).then(res => res.json());

           updateSpot(currentSpotPosition, response.spot);

        } catch (error) {
            console.log(error)
        }
    }

    const sideElement = spot ?
                        <div className={styles.desktopReviews}>
                            <div className={styles.sideHeader}>
                                <div className={styles.buttonContainer}>
                                    <Button 
                                        onClick={() => {setShowModal(false); setDisplayDetailsView(false)}}
                                        icon={faXmark}
                                        dark
                                        role="secondary"
                                        className={styles.closeBtn}
                                    />
                                </div>
                                <SectionTitle dark>Avis</SectionTitle>
                            </div>
                                <ReviewsContent 
                                    className={styles.reviewsContent}
                                    reviews={spot.reviews} 
                                    spotId={spot.id} 
                                    onReload={reloadCurrentSpot} 
                                    onDisplayModerationToast={setDisplayModerationToast} 
                                />
                        </div> : <></>

    // render 

    return spot ? (
        <AnimatePresence
            initial={false}
            mode='wait'
            onExitComplete={() => null}
        >
            {showModal && 
                <Modal 
                key="modal" 
                onSwipeRight={onSwipeRight} 
                onSwipeLeft={onSwipeLeft} 
                onClose={() => { setShowModal(false); setDisplayDetailsView(false) }} 
                removePadding 
                className={styles.modal} 
                sideElementClassName={styles.sideElementContent}
                sideElement={openDesktopReviews ? sideElement : null} 
                customHeader={
                    <div className={styles.header} style={{
                        background: `linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, #000 100%), url(${spot.image || ""}) no-repeat center center / cover lightgray`,
                        }}>
                            { !openDesktopReviews && 
                                <Button
                                    onClick={() => { setShowModal(false); setDisplayDetailsView(false) }}
                                    icon={isMobile ? faArrowLeft : faXmark}
                                    action="big"
                                    role="secondary"
                                    className={styles.closeBtn}
                                    dark
                                />
                            }   
                            
                            <div className={styles.headerContent}>
                                
                                {!displayDetailsView && <div className={styles.actionIcons}>
                                    <Button
                                        onClick={() => toggleFavorites()}
                                        icon={isLiked() ? filledHeart : faHeart}
                                        action="big"
                                        role="secondary"
                                        dark
                                    />
                                    <Button
                                        onClick={() => isMobile ? setOpenReviews(true) : setOpenDesktopReviews(!openDesktopReviews)}
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
                                spot.tags.map((tag, key) => <li className={styles.tag} key={`${key}_${tag.name}`}>{tag.name}</li>)
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
                                        icon={isLiked() ? filledHeart : faHeart}
                                        action="big"
                                        role="secondary"
                                        className={styles.lighterBg}
                                        dark
                                    />
                                    <Button
                                        onClick={() => setOpenReviews(true)}
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
                key={'toast'}
                status='info'
                showToast={displayAddToFavoritesErrorToast}
                onHide={() => setDisplayAddToFavoritesErrorToast(false)}>
                Connectez vous pour effectuer cette action.
            </Toast>
            <Toast 
				status='error'
				showToast={displayModerationToast}
				onHide={() => setDisplayModerationToast(false)}>
				Certains termes utilisés ne peuvent être acceptés.
			</Toast>
            <ReviewsModal showModal={openReviews} onClose={() => setOpenReviews(false)} onReload={reloadCurrentSpot} spotId={spot.id} reviews={spot.reviews}></ReviewsModal>
        </AnimatePresence>
    ) : <></>
}

export default SpotDetailsModal
