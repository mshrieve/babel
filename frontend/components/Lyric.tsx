import { useState, useEffect } from 'react'
import { useLyric } from '../hooks/useLyric'
import { useBabel } from '../hooks/useBabel'

const Lyric = () => {
  const { lyricState, decodedLyric, bid } = useLyric()
  const { allowances, approveLyric } = useBabel()

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
      <span>{lyricState.id}</span>
      <br />
      <span>{decodedLyric}</span>
      <br />
      <button onClick={() => bid(inputs.word, inputs.position, inputs.bid)}>
        replace word
      </button>
      <button onClick={() => approveLyric()}>approve three</button>

      <input
        value={inputs.word}
        onChange={handleChange}
        type="text"
        id="word"
        name="word"
        placeholder="word"
      />
      <input
        value={inputs.position}
        onChange={handleChange}
        type="text"
        id="position"
        name="position"
        placeholder="position"
      />
      <input
        value={inputs.bid}
        onChange={handleChange}
        type="text"
        id="bid"
        name="bid"
        placeholder="bid"
      />
    </section>
  )
}

export { Lyric }
