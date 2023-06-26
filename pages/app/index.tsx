import Button from '@components/button'
import SectionHeader from '@components/layout/section-header'
import SpotDetailsModal from '@components/modals/spot-details-modal'
import SectionTitle from '@components/section-title'
import { faLocationDot } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Context } from '@lib/context'
import { getSpots } from '@lib/helpers/spots'
import styles from '@styles/pages/home.module.scss'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useContext, useEffect, useState } from 'react'
import { serialize, deserialize } from 'superjson'
import { SuperJSONResult } from 'superjson/dist/types'
import SpotCard from '@components/spot-card'

interface Props {
	spot: SuperJSONResult,
	open: boolean
}

const Home = (
	{ spot, open }: Props
) => {
	
	// meta data

	const metaTitle = "GREEN SPOTS"
	const metaDescription = "GREEN SPOTS permet de trouver les meilleurs spots de nature autour de vous."

	const [showModal, setShowModal] = useState(open);

	const [data] = useState(spot ? deserialize(spot) : null);

	useEffect(() => {
		console.log(data)
		setShowModal(open);  // set the modal state based on the open prop
	}, [open]);

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


			{ data && <>
				<SpotCard 
					displayMode='card'
					spot={data}
					onClick={() => setShowModal(true)}
				/>
				<SpotDetailsModal showModal={showModal} setShowModal={setShowModal} spot={data}></SpotDetailsModal>

				<SpotCard 
					displayMode='list'
					spot={data}
					onClick={() => setShowModal(true)}
				/>
				<SpotDetailsModal showModal={showModal} setShowModal={setShowModal} spot={data}></SpotDetailsModal>
				</>
			}
			</main>
		</>
		
	)
}


export const getServerSideProps: GetServerSideProps<Props> = async (context) => {

	const { id, open = 'false' } = context.query;

	// get the spot by its id or the first one by default
	const rawData = id ? (await getSpots()).find(spot => spot.id == id) : (await getSpots())[0];

	const spot = serialize(rawData);

	return {
		props : {
			spot,
			open: open === 'true'
		}
	}
}

export default Home