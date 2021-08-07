import { Wallet } from '../components/Wallet'
import { Words } from '../components/Words'
import { MyWords } from '../components/MyWords'
import { Vault } from '../components/Vault'
import { Random } from '../components/Random'
import { EthProvider } from '../context/eth'

const Main = () => {
  return (
    <EthProvider>
      <Wallet />
      <Words />
      <MyWords />
      <Random />
      <Vault />
    </EthProvider>
  )
}

export default Main
