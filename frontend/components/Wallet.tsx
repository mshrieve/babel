import { useEth } from '../context/eth'
import { useBabel } from '../hooks/useBabel'

const Wallet = () => {
  const { address } = useEth()
  const { balance, mintBabel, allowances, approveWords, approveLyric } =
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
      <button onClick={mintBabel}>mint babel</button>
      <button onClick={approveWords}>approve words</button>
      <button onClick={approveLyric}>approve lyric</button>
      {/* <button onClick={approveVault}>approve vault</button> */}
    </section>
  )
}

export { Wallet }
