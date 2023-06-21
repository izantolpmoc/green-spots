import styles from '@styles/pages/home.module.scss'
import Head from 'next/head'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect } from 'react'
import Button from '@components/button'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'

const Home = () => {
	
	// meta data

	const metaTitle = "GREEN SPOTS"
	const metaDescription = "GREEN SPOTS permet de trouver les meilleurs spots de nature autour de vous."

	// user auth

	const { data: session, status } = useSession()

	useEffect(() => {
		console.log("session", session)
	}, [session])

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
							<img src={session.user?.image || ""} alt="avatar" />
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

				<div style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					padding: "40px",
					// green to blue gradient
					background: "linear-gradient(90deg, rgba(0,255,0,1) 0%, rgba(0,0,255,1) 100%)"
				}}>


					<Button 
						dark
						icon={faArrowLeft}
						role="secondary"
						action='big'
						onClick={() => console.log("click")}>
					</Button>

				</div>

			</main>
		</>
		
	)
}

export default Home