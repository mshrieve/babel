import { useState } from 'react'
import { useBytes } from '../hooks/useBytes'

const Random = () => {
  const { fulfillRequest } = useBytes()
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
      {/* <h2>Random</h2> */}
      <input
        value={inputs.requestId}
        onChange={handleChange}
        type="text"
        id="requestId"
        name="requestId"
        placeholder="request id"
      />
      <button onClick={() => fulfillRequest(inputs.requestId)}>
        fulfill request
      </button>
    </section>
  )
}

export { Random }
