import { useState, useEffect } from 'react'
import { useLyric } from '../hooks/useLyric'
import { useBabel } from '../hooks/useBabel'
import { useEth } from '../context/eth'
const LyricAuction = () => {
  const { lyricState, decodedLyric, bid, completeRound } = useLyric()
  const { balance, allowances, approveLyric } = useBabel()
  const { blockNumber } = useEth()
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
      <h2>auction</h2>
      <span>block number: {blockNumber}</span>
      <br />
      <span>round start: {lyricState.roundStart.toString()}</span>
      <br />
      <span>highest bid: {lyricState.highestBid.toString()}</span>
      <br />
      <span>highest bidder: {lyricState.highestBidder.toString()}</span>
      <br />

      {/* <button onClick={() => approveLyric()}>approve lyric</button>
      <span>lyric allowance: {allowances.lyric}</span> */}
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
      <button onClick={() => bid(inputs.word, inputs.position, inputs.bid)}>
        place bid
      </button>
      <button onClick={completeRound}>complete round</button>
    </section>
  )
}

export { LyricAuction }
