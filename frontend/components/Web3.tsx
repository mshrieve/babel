import { useContext, useState, useEffect } from 'react'
import { EthContext } from '../context/eth'

const Web3 = () => {
  const { signer, loadWeb3Modal } = useContext(EthContext)
  const [address, setAddress] = useState('')

  useEffect(() => {
    if (signer) signer.getAddress().then((address) => setAddress(address))
  }, [signer])
  return (
    <section className="border">
      <h2>web3</h2>

      <span>address: {address}</span>
      <br />
      <button onClick={loadWeb3Modal}>click</button>
    </section>
  )
}

export { Web3 }
