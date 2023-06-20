import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
	return (
		<Html lang="en">
			<Head >
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
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	)
}
