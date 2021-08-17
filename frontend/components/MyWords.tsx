import { Fragment } from 'react'
import { useWords } from '../hooks/useWords'
import { decodeTokenId } from '../util'
const MyWords = () => {
  const { requestId, requestWord, word, tokenId, usersWords } = useWords()
  return (
    <section className="border">
      <h2>my words</h2>

      {usersWords.length > 0 ? (
        usersWords.map((word) => (
          <Fragment key={word}>
            <span>{word} </span>
            <span>{decodeTokenId(word)} </span>
            <br />
          </Fragment>
        ))
      ) : (
        <span>no words yet</span>
      )}
    </section>
  )
}

export { MyWords }
