import Button from '@components/button'
import LoginModal from '@components/modal/login-modal'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import styles from '@styles/pages/home.module.scss'
import Head from 'next/head'
import { useState } from 'react'

const Home = () => {
	
	// meta data

	const metaTitle = "GREEN SPOTS"
	const metaDescription = "GREEN SPOTS permet de trouver les meilleurs spots de nature autour de vous."

	const [showModal, setShowModal] = useState(false);

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
				hello
				<Button onClick={() => setShowModal(true)}>Open modal</Button>
				<LoginModal showModal={showModal} onClose={() => setShowModal(false)}/>
			</main>
		</>
		
	)
}

export default Home