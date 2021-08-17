import { Lyric } from '../components/Lyric'

import { MyWords } from '../components/MyWords'
import { Nav } from '../components/Nav'
import { LyricAuction } from '../components/LyricAuction'
import { MyLyrics } from '../components/MyLyrics'
const Main = () => {
  return (
    <>
      <Nav />
      <Lyric />
      <LyricAuction />
      <MyWords />
      <MyLyrics />
    </>
  )
}

export default Main
