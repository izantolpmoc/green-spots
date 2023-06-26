import '@styles/globals.scss'
import '@fortawesome/fontawesome-svg-core/styles.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Header from '@components/layout/header'
import NavBar from '@components/layout/nav-bar'
import { useEffect, useMemo, useState } from 'react'
import useGeolocation from '../hooks/use-geolocation'
import { Context } from '@lib/context'

const App = ({ Component, pageProps }: AppProps) => {

	const router = useRouter()

	// get user's location

	const { position: userLocation, error } = useGeolocation()

	// set up & memoize the context
	// search form values

	const [searchQuery, setSearchQuery] = useState<string>("")
	const [maxDistance, setMaxDistance] = useState<number>(10)
	const [tags, setTags] = useState<string[]>([])

	const contextValue = useMemo(() => ({
		userLocation,
		searchQuery,
		setSearchQuery,
		maxDistance,
		setMaxDistance,
		tags,
		setTags
	}), [userLocation, searchQuery, maxDistance, tags])

	useEffect(() => {
		if(error) {
			console.log(error)
		}
	}, [error])

	// render

	return (
		<Context.Provider value={contextValue}>
			<SessionProvider session={pageProps.session}>
				<Head>
					<meta name="application-name" content="Green Spots" />
					<meta name="apple-mobile-web-app-capable" content="yes" />
					<meta name="apple-mobile-web-app-status-bar-style" content="default" />
					<meta name="apple-mobile-web-app-title" content="Green Spots" />
					<meta name="mobile-web-app-capable" content="yes" />
					<meta name="apple-mobile-wep-app-capable" content="yes" />
					<meta name="apple-mobile-web-app-title" content="Green Spots" />
					<meta name="description" content="Trouvez des spots de nature autour de vous." />
					<meta name="format-detection" content="telephone=no" />
					<meta name="mobile-web-app-capable" content="yes" />
					<meta
						name='viewport'
						content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover'
					/>
					<link rel="manifest" href="/manifest.json" />
				</Head>
				{
					// check if we're in /app
					router.pathname.includes('/app') ?
						// if so, display the nav bar and the header
						<>
							<Header />
							<NavBar/>
							<Component {...pageProps} />
						</>
					:
						<Component {...pageProps} />
				}
			</SessionProvider>
		</Context.Provider>
	)
}

export default App