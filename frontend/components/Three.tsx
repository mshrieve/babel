import { useState, useEffect } from 'react'
import { useThree } from '../hooks/useThree'

const Three = () => {
  const { threeState, decodedTriplet, replaceWord, approveThree } = useThree()

  const [inputs, setInputs] = useState({
    word: '',
    position: ''
  })

  const handleChange = (e) =>
    setInputs((inputs) => ({
      ...inputs,
      [e.target.name]: e.target.value
    }))
  return (
    <section className="border">
      <h2>three</h2>
      <span>{threeState}</span>
      <br />
      <span>{decodedTriplet}</span>
      <br />
      <button onClick={() => replaceWord(inputs.word, inputs.position)}>
        replace word
      </button>
      <button onClick={() => approveThree()}>approve three</button>

      <input
        value={inputs.word}
        onChange={handleChange}
        type="text"
        id="word"
        name="word"
      />
      <input
        value={inputs.position}
        onChange={handleChange}
        type="text"
        id="position"
        name="position"
      />
    </section>
  )
}

export { Three }
