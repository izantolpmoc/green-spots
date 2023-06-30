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
	const [selectedTags, setSelectedTags] = useState<string[]>([])

	const contextValue = useMemo(() => ({
		userLocation,
		searchQuery,
		setSearchQuery,
		maxDistance,
		setMaxDistance,
		tags,
		setTags,
		selectedTags,
		setSelectedTags
	}), [userLocation, searchQuery, maxDistance, tags, selectedTags])

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
					<link href="splashscreens/iphone5_splash.png" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
					<link href="splashscreens/iphone6_splash.png" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
					<link href="splashscreens/iphoneplus_splash.png" media="(device-width: 621px) and (device-height: 1104px) and (-webkit-device-pixel-ratio: 3)" rel="apple-touch-startup-image" />
					<link href="splashscreens/iphonex_splash.png" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" rel="apple-touch-startup-image" />
					<link href="splashscreens/iphonexr_splash.png" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
					<link href="splashscreens/iphonexsmax_splash.png" media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)" rel="apple-touch-startup-image" />
					<link href="splashscreens/ipad_splash.png" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
					<link href="splashscreens/ipadpro1_splash.png" media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
					<link href="splashscreens/ipadpro3_splash.png" media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
					<link href="splashscreens/ipadpro2_splash.png" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
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