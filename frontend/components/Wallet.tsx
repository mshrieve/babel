import { useWallet } from '../hooks/useWallet'
import { useBabel } from '../hooks/useBabel'

const Wallet = () => {
  const { address } = useWallet()
  const { balance, mintBabel, wordsAllowance, approve } = useBabel()
  return (
    <section className="border">
      <h2>wallet</h2>

      <span>address: {address}</span>
      <br />
      <span>balance: {balance}</span>
      <br />
      <span>words allowance: {wordsAllowance}</span>
      <br />
      <button onClick={mintBabel}>mint babel</button>
      <button onClick={approve}>approve words</button>
    </section>
  )
}

export { Wallet }
