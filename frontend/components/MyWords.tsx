import { useWords, decodeTokenId } from '../hooks/useWords'

const MyWords = () => {
  const { requestId, requestWord, word, tokenId, usersWords } = useWords()
  return (
    <section className="border">
      <h2>my words</h2>

      {usersWords.map((word) => (
        <span key={'encoded' + word}> {word} </span>
      ))}
      {usersWords.map((word) => (
        <span key={'decoded' + word}> {decodeTokenId(word)} </span>
      ))}
    </section>
  )
}

export { MyWords }
