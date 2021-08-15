import { EthProvider } from '../context/eth'
import { Web3 } from '../components/Web3'
const Main = () => {
  return (
    <EthProvider>
      <Web3 />
    </EthProvider>
  )
}

export default Main
