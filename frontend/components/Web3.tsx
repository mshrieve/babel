import { useContext, useState, useEffect } from 'react'
import { EthContext } from '../context/eth'

const Web3 = () => {
  const { signer, loginWeb3, logoutWeb3 } = useContext(EthContext)
  const [address, setAddress] = useState(undefined)

  useEffect(() => {
    if (signer) {
      console.log('signer: ', signer)
      console.log('getAddress: ', signer.getAddress)
      signer.getAddress().then((address) => setAddress(address))
    }
    if (!signer) setAddress(undefined)
  }, [signer])
  return (
    <section className="border">
      <h2>web3</h2>

      <span>address: {address}</span>
      <br />
      <button onClick={loginWeb3}>login</button>
      <button onClick={logoutWeb3}>logout</button>
    </section>
  )
}

export { Web3 }
