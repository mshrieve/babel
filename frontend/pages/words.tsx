import { Wallet } from '../components/Wallet'
import { Words } from '../components/Words'
import { MyWords } from '../components/MyWords'
import { EthProvider } from '../context/eth'
import { Random } from '../components/Random'
import { Nav } from '../components/Nav'
const Main = () => {
  return (
    <EthProvider>
      <Nav />
      <Words />
      <MyWords />
      <Random />
    </EthProvider>
  )
}

export default Main
