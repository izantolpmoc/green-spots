import styles from '@styles/pages/home.module.scss'
import Head from 'next/head'

import prisma from '../lib/prisma'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

const Home = () => {


	// meta data

	const metaTitle = "GREEN SPOTS"
	const metaDescription = "GREEN SPOTS permet de trouver les meilleurs spots de nature autour de vous."

	// user auth

	const { data: session, status } = useSession()

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
			<main>
				<h1 className={styles.title}>GREEN SPOTS</h1>
				{
					status === 'loading' ? (
						<p>Chargement...</p>
					) : status === 'authenticated' ? (
						<>
							<p>Bonjour {session.user?.name} ! ({session.user?.email})</p>
							<Link href="/api/auth/signout">
								Se déconnecter
							</Link>
						</>
					) : (
						<Link href="/api/auth/signin">
							Se connecter
						</Link>
					)
				}
			</main>
		</>
		
	)
}

export default Home
