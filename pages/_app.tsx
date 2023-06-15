import '@styles/globals.scss'
import '@fortawesome/fontawesome-svg-core/styles.css'
import type { AppProps } from 'next/app'

const App = ({ Component, pageProps }: AppProps) => {
	return <Component {...pageProps} />
}

export default App