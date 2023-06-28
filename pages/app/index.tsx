import Button from '@components/button'
import SectionHeader from '@components/layout/section-header'
import SpotDetailsModal from '@components/modals/spot-details-modal'
import SectionTitle from '@components/section-title'
import { faArrowRight, faLocationDot } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Context } from '@lib/context'
import { getSpots } from '@lib/helpers/spots'
import { Spot } from '@lib/types'
import styles from '@styles/pages/home.module.scss'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useContext, useEffect, useState } from 'react'
import { serialize, deserialize } from 'superjson'
import { SuperJSONResult } from 'superjson/dist/types'
import SpotCard from '@components/spot-card'

interface Props {
	spots: SuperJSONResult,
	open: boolean;
	id: string | string[] | undefined;
}

const Home = (
	{ spots, open, id }: Props
) => {
	
	// meta data

	const metaTitle = "GREEN SPOTS"
	const metaDescription = "GREEN SPOTS permet de trouver les meilleurs spots de nature autour de vous."

	const [showModal, setShowModal] = useState(open);
	const [currentSpotPosition, setCurrentSpotPosition] = useState(0);
	const [currentNavigationPosition, setCurrentNavigationPosition] = useState(0);

	const [data] = useState<Spot[]>(spots ? deserialize(spots) : []);

	useEffect(() => {
 
	}, [open]);

	const getCurrentSpotPosition = (id: number) => {
        const currentSpotIdx = data.findIndex(spot => spot.id == data[id].id)
        return setCurrentSpotPosition(currentSpotIdx)
	}

    const openModal = (id: number) => {
        getCurrentSpotPosition(id)
        setShowModal(true)
    }
    
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

	const CardHome = () => {

		return (
			<div className={styles.cardContainer}>
				{ data.map((item, i) => {
					return (
						<SpotCard
							displayMode="card"
							spot={item}
							onClick={() => openModal(i)}
						/>
					)
				}) }
			</div>
		)
	};

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
			<main id={styles.main}>
				<SectionHeader>
					<SectionTitle>Autour de moi</SectionTitle>
					<p><FontAwesomeIcon icon={faLocationDot}/> &nbsp; Près de { userAddress }</p>
				</SectionHeader>
				<CardHome />
				<Button
					onClick={() => {openModal(currentNavigationPosition)}}
					icon={faArrowRight}
					action="big"
					role="primary"
					className={styles.button}
				/>
				{data && <SpotDetailsModal showModal={showModal} setShowModal={setShowModal} spots={data} currentSpotPosition={currentSpotPosition} setCurrentSpotPosition={setCurrentSpotPosition}></SpotDetailsModal>}
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