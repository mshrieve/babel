import { Wallet } from '../components/Wallet'
import { Words } from '../components/Words'
import { MyWords } from '../components/MyWords'
import { Random } from '../components/Random'
import { EthProvider } from '../context/eth'

const Main = () => {
  return (
    <EthProvider>
      <Wallet />
      <Words />
      <MyWords />
      <Random />
    </EthProvider>
  )
}

export default Main
