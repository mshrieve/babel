import { useWallet } from '../hooks/useWallet'
import { useBabel } from '../hooks/useBabel'

const Wallet = () => {
  const { address } = useWallet()
  const { balance, mintBabel, allowances, approveWords, approveVault } =
    useBabel()
  return (
    <section className="border">
      <h2>wallet</h2>

      <span>address: {address}</span>
      <br />
      <span>balance: {balance}</span>
      <br />
      <span>words allowance: {allowances.words}</span>
      <br />
      <span>vault allowance: {allowances.vault}</span>
      <br />
      <button onClick={mintBabel}>mint babel</button>
      <button onClick={approveWords}>approve words</button>
      <button onClick={approveVault}>approve vault</button>
    </section>
  )
}

export { Wallet }
