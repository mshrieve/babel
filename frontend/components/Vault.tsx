import { useState } from 'react'
import { useVault } from '../hooks/useVault'
import { decodeTokenId } from '../util'

const Vault = () => {
  const {
    vaultWords,
    depositWord,
    unclaimedWords,
    redeemBabel,
    whitelistVault
  } = useVault()
  const [inputs, setInputs] = useState({
    tokenId: ''
  })

  const handleChange = (e) =>
    setInputs((inputs) => ({
      ...inputs,
      [e.target.name]: e.target.value
    }))
  return (
    <section className="border">
      <h2>vault</h2>
      <button onClick={() => depositWord(inputs.tokenId)}>deposit word</button>
      <button onClick={() => redeemBabel()}>redeem babel</button>
      <button onClick={() => whitelistVault()}>whitelist vault</button>
      <input
        value={inputs.tokenId}
        onChange={handleChange}
        type="text"
        id="tokenId"
        name="tokenId"
      />
      <span>unclaimed words: {unclaimedWords}</span>
      {vaultWords.map((word) => (
        <span key={'encoded' + word}> {word} </span>
      ))}
      {vaultWords.map((word) => (
        <span key={'decoded' + word}> {decodeTokenId(word)} </span>
      ))}
    </section>
  )
}

export { Vault }
