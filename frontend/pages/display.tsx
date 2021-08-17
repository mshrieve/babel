import { DisplayLyric } from '../components/DisplayLyric'
import { useLyric } from '../hooks/useLyric'

const Display = () => {
  const { decodedLyric } = useLyric()

  return (
    <section className="centerColumn">
      {decodedLyric ? <DisplayLyric lyric={decodedLyric} /> : undefined}
    </section>
  )
}

export default Display
