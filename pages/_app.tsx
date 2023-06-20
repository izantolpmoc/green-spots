import '@styles/globals.scss'
import '@fortawesome/fontawesome-svg-core/styles.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import Head from 'next/head'

const App = ({ Component, pageProps }: AppProps) => {
	return (
		<SessionProvider session={pageProps.session}>
			<Head>
				<meta name="application-name" content="Green Spots" />
				<meta name="apple-mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-status-bar-style" content="default" />
				<meta name="apple-mobile-web-app-title" content="Green Spots" />
				<meta name="mobile-web-app-capable" content="yes" />
				<meta name="apple-mobile-wep-app-capable" content="yes" />
				<meta name="apple-mobile-web-app-title" content="Green Spots" />
				<meta name="description" content="Best way to find a spots in Villejuif" />
				<meta name="format-detection" content="telephone=no" />
				<meta name="mobile-web-app-capable" content="yes" />
				<meta
  					name='viewport'
  					content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover'
				/>
				<link rel="manifest" href="/manifest.json" />
			</Head>
			<Component {...pageProps} />
		</SessionProvider>
	)
}

export default App