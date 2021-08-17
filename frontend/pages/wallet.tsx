import { Wallet } from '../components/Wallet'
import { EthProvider } from '../context/eth'
import { Nav } from '../components/Nav'
const Main = () => {
  return (
    <EthProvider>
      <Nav />
      <Wallet />
    </EthProvider>
  )
}

export default Main
