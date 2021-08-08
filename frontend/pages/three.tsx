import { Three } from '../components/Three'

import { EthProvider } from '../context/eth'
import { MyWords } from '../components/MyWords'

const Main = () => {
  return (
    <EthProvider>
      <Three />
      <MyWords />
    </EthProvider>
  )
}

export default Main
