import { useWords, decodeTokenId } from '../hooks/useWords'

const Words = () => {
  const { requestId, requestWord, word, tokenId, usersWords } = useWords()
  return (
    <section className="border">
      <h2>words</h2>
      <span> request id: {requestId}</span>
      <br />
      <span> word: {word}</span>
      <br />
      <span> tokenId: {tokenId}</span>
      <button onClick={requestWord}>request word</button>
    </section>
  )
}

export { Words }
