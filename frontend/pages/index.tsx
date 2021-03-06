import { Wallet } from '../components/Wallet'
import { Words } from '../components/Words'
import { MyWords } from '../components/MyWords'
import { EthProvider } from '../context/eth'

const Main = () => {
  return (
    <EthProvider>
      <Wallet />
      <Words />
      <MyWords />
    </EthProvider>
  )
}

export default Main
