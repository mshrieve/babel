import { Lyric } from '../components/Lyric'

import { EthProvider } from '../context/eth'
import { MyWords } from '../components/MyWords'

const Main = () => {
  return (
    <EthProvider>
      <Lyric />
      <MyWords />
    </EthProvider>
  )
}

export default Main
