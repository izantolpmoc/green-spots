import SectionHeader from '@components/layout/section-header'
import SectionTitle from '@components/section-title'
import { faArrowRight, faArrowUp, faLocationDot } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Context } from '@lib/context'
import { getSpots } from '@lib/helpers/spots'
import { Spot } from '@lib/types'
import styles from '@styles/pages/home.module.scss'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useContext, useEffect, useRef, useState } from 'react'
import { serialize, deserialize } from 'superjson'
import { SuperJSONResult } from 'superjson/dist/types'
import SpotCard from '@components/spot-card'
import DynamicSpotsGrid from '@components/layout/dynamic-spots-grid'
import { AnimatePresence } from 'framer-motion'
import ScrollIndicator from '@components/layout/scroll-indicator'
import SpotDetailsModal from '@components/modals/spot-details-modal'

interface Props {
	spots: SuperJSONResult,
	open: boolean;
	id: string | string[] | undefined;
}

const Home = (
	{ spots, open }: Props
) => {
	
	// meta data

	const metaTitle = "GREEN SPOTS"
	const metaDescription = "GREEN SPOTS permet de trouver les meilleurs spots de nature autour de vous."

	const [showModal, setShowModal] = useState(open);
	const [currentSpotPosition, setCurrentSpotPosition] = useState(0);

	const [data, setData] = useState<Spot[]>(spots ? deserialize(spots) : []);

	useEffect(() => { }, [open])

	// manage scroll

	// Scroll up indicator

	const containerRef = useRef<HTMLElement>(null)

	const [isScrolledToTop, setIsScrolledToTop] = useState(false)

	useEffect(() => {
		if (!containerRef.current) return;

		const container = containerRef.current;
	  
		// add an event listener to check
		// if the main is scrolled to the top

		const getIsScrolledToTop = () => container.scrollTop == 0;

		const handleScroll = () => {
		  setIsScrolledToTop(getIsScrolledToTop());
		};

		// initial check
		setIsScrolledToTop(getIsScrolledToTop());

		// add the event listener
		container.addEventListener('scroll', handleScroll);
	  
		// clean up
		return () => {
		  container.removeEventListener('scroll', handleScroll);
		};
		
	}, [containerRef.current]);

	// Right scroll indicator

	const sectionRef = useRef<HTMLElement>(null)

	const cardPositionRef = useRef(0);
	
	useEffect(() => {
		updateCardHeight(0);
	}, [sectionRef.current]);

	const getCurrentSpotPosition = (id: number) => {
        const currentSpotIdx = data.findIndex(spot => spot.id == data[id].id)
        return setCurrentSpotPosition(currentSpotIdx)
	}

    const openModal = (id: number) => {
        getCurrentSpotPosition(id)
        setShowModal(true)
    }

	// handle scroll up indicator click

    const scrollToTop = () => {
        if(!containerRef.current) return
        containerRef.current.scrollTo({
            top: 0,
            behavior: 'smooth'
        })
    }


	const scrollToRight = () => {
		if (!sectionRef.current) return;

		const cardContainer = sectionRef.current;

		cardPositionRef.current = cardPositionRef.current + 1;

		const children = Array.from(cardContainer.children);
		const liElements = children.filter((child) => child.tagName.toLowerCase() === "li");

		if(cardPositionRef.current === liElements.length) {
			cardPositionRef.current = 0;
			scrollToStart();
		}

		// @ts-ignore
		const cardWidthWithGap = cardContainer.children[1].offsetWidth + parseInt(getComputedStyle(cardContainer).gap);

		const scrollLeft = cardPositionRef.current * cardWidthWithGap;	  

		cardContainer.scrollTo({
			left: scrollLeft,
			behavior: 'smooth'
		});

		updateCardHeight(cardPositionRef.current, cardPositionRef.current - 1);
	};

	const scrollToStart = () => {

		if (!sectionRef.current) return;

		const cardContainer = sectionRef.current;

		// @ts-ignore
		const cardWidthWithGap = cardContainer.children[1].offsetWidth + parseInt(getComputedStyle(cardContainer).gap);

		const scrollLeft = cardContainer.children.length * cardWidthWithGap;

		cardContainer.scrollTo({
			left: - scrollLeft,
			behavior: 'smooth'
		});

		updateCardHeight(cardPositionRef.current);
	};
	

	const updateCardHeight = (i: number, old?: number) => {
		if(!sectionRef.current) return

		const cardContainer = sectionRef.current;

		const actualCard = cardContainer.children[i] as HTMLElement;

		if (cardPositionRef.current === i) {
			actualCard.classList.remove(styles.minHeight);
			if(cardPositionRef.current !== 0 && old) {
				cardContainer.children[cardPositionRef.current - 1].classList.add(styles.minHeight);
			}
		}
	};
	  
	// user location

	const { userLocation } = useContext(Context)

	const [userAddress, setUserAddress] = useState<string>("")
	
	// update the user address when the user location changes

	useEffect(() => {

		if(!userLocation) return

		const { latitude, longitude } = userLocation.coords

		// make a call to the open street map api to get the user address

		fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&accept-language=fr`)
		.then(response => response.json()).then(data => {
			console.log(data)
			const { amenity, road, city, country } = data.address
			setUserAddress(
				`${amenity ? amenity + ', ' : ''}${road ? road + ', ' : ''}${city ? city + ', ' : ''}${country}`
			)
		})


	}, [userLocation])

	// utils

	const updateSpot = (index: number, spot: Spot) => {
		const newData = [...data]
		newData[index] = spot
		setData(newData)
	}

	// render

	return (

		<>
			<Head>
				<title>{metaTitle}</title>
				<meta name="description" content={metaDescription} />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="shortcut icon" href="favicon/favicon.svg" type="img/svg" />
				<link rel="apple-touch-icon" sizes="180x180" href="/favicon/favicon-180x180.png" />
				<link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png"/>
				<link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png"/>
				<meta property="og:title" content={metaTitle} />
				<meta property="twitter:title" content={metaTitle} />
				<meta property="og:type" content="website" />
				<meta property="og:description" content={metaDescription} />
				<meta property="twitter:description" content={metaDescription} />
				<meta property="og:url" content="https://www.greenspots.fr" />
				<meta property="og:image" content="https://www.greenspots.fr/favicon/favicon-180x180.png" />
				<meta property="twitter:image" content="https://www.greenspots.fr/favicon/favicon-180x180.png" />
			</Head>
			<main 
			 	ref={containerRef} 
				id={styles.main}
			>
				<SectionHeader>
					<SectionTitle>Autour de moi</SectionTitle>
					<p><FontAwesomeIcon icon={faLocationDot}/> &nbsp; Près de { userAddress }</p>
				</SectionHeader>
				<section className={styles.cardContainer} ref={sectionRef}>
					{data.map((item, i) => (
						<SpotCard
							key={`around-me-section-spot-${i}`}
							className={styles.minHeight}
							displayMode="card"
							spot={item}
							onClick={() => openModal(i)}
						/>
					))}
					
					<div className={styles.fade} />
					<ScrollIndicator mode="right" onClick={scrollToRight}>
						<FontAwesomeIcon icon={faArrowRight} />
					</ScrollIndicator>
				</section>

				{
					data ?
					<SpotDetailsModal 
						showModal={showModal} 
						setShowModal={setShowModal} 
						spots={data} 
						updateSpot={updateSpot}
						currentSpotPosition={currentSpotPosition} 
						setCurrentSpotPosition={setCurrentSpotPosition}
					/> : <></>
				}

				<SectionHeader>
					<SectionTitle>En vogue</SectionTitle>
					<p>Les espaces verts les plus appréciés autour de vous !</p>
				</SectionHeader>

				<DynamicSpotsGrid spots={data} updateSpot={updateSpot} />
				<AnimatePresence
					initial={false}
					mode='wait'
					onExitComplete={() => null}>
				{
					!isScrolledToTop &&
					<ScrollIndicator mode="up" onClick={scrollToTop} >
						<FontAwesomeIcon icon={faArrowUp} />
					</ScrollIndicator>
				}
				</AnimatePresence>
			</main>
		</>
		
	)
}


export const getServerSideProps: GetServerSideProps<Props> = async (context) => {

	const { id, open = 'false' } = context.query;

	// get the spot by its id or the first one by default
	const rawData = id ? [(await getSpots()).find(spot => spot.id == id)] : (await getSpots());

	const spots = serialize(rawData);

	return {
		props : {
			spots,
			open: open === 'true',
			id
		}
	}
}

export default Home
