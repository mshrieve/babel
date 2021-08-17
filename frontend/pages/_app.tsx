import '../styles.css'
import { EthProvider } from '../context/eth'

export default function App({ Component, pageProps }) {
  return (
    <EthProvider>
      <Component {...pageProps} />
    </EthProvider>
  )
}
