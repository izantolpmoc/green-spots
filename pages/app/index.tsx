import Button from '@components/button'
import SpotDetailsModal from '@components/modal/spot-details-modal'
import SectionTitle from '@components/section-title'
import { getSpots } from '@lib/helpers/spots'
import styles from '@styles/pages/home.module.scss'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useState } from 'react'
import { serialize, deserialize } from 'superjson'
import { SuperJSONResult } from 'superjson/dist/types'

interface Props {
	spot: SuperJSONResult
}

const Home = (
	{ spot }: Props
) => {
	
	// meta data

	const metaTitle = "GREEN SPOTS"
	const metaDescription = "GREEN SPOTS permet de trouver les meilleurs spots de nature autour de vous."

	const [showModal, setShowModal] = useState(false);

	const [data] = useState(spot ? deserialize(spot) : null);

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
				<SectionTitle>Autour de moi</SectionTitle>

				<Button
				onClick={() => setShowModal(true)}
				>Open spot details modal</Button>
				{data && <SpotDetailsModal showModal={showModal} setShowModal={setShowModal} spot={data}></SpotDetailsModal>}
			</main>
		</>
		
	)
}


export const getServerSideProps: GetServerSideProps<Props> = async (context) => {

	const rawData = (await getSpots())[1]

	const spot = serialize(rawData);


	return {
		props : {
			spot
		}
	}
}

export default Home