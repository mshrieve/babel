import { useState, useEffect } from 'react'
import { useLyric } from '../hooks/useLyric'
import { useBabel } from '../hooks/useBabel'
import { DisplayLyric } from './DisplayLyric'

const Lyric = () => {
  const { lyricState, decodedLyric, bid, completeRound } = useLyric()
  const { balance, allowances, approveLyric } = useBabel()

  const [inputs, setInputs] = useState({
    word: '',
    position: '',
    bid: ''
  })

  const handleChange = (e) =>
    setInputs((inputs) => ({
      ...inputs,
      [e.target.name]: e.target.value
    }))
  return (
    <section className="border">
      <h2>lyric</h2>

      <br />
      {decodedLyric ? <DisplayLyric lyric={decodedLyric} /> : undefined}
      <br />
      <br />
      {/* <button onClick={() => approveLyric()}>approve lyric</button>
      <span>lyric allowance: {allowances.lyric}</span> */}
      <span style={{ width: '50%', margin: 'auto', textAlign: 'center' }}>
        {lyricState.id}
      </span>
    </section>
  )
}

export { Lyric }
