import { useState } from 'react'
import { useRandom } from '../hooks/useRandom'

const Random = () => {
  const { fulfillRequest } = useRandom()
  const [inputs, setInputs] = useState({
    requestId: ''
  })

  const handleChange = (e) =>
    setInputs((inputs) => ({
      ...inputs,
      [e.target.name]: e.target.value
    }))

  return (
    <section className="border">
      <h2>Random</h2>

      <button onClick={() => fulfillRequest(inputs.requestId)}>
        fulfill request
      </button>
      <input
        value={inputs.requestId}
        onChange={handleChange}
        type="text"
        id="requestId"
        name="requestId"
      />
    </section>
  )
}

export { Random }
