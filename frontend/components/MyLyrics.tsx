import { Fragment } from 'react'
import { useLyric } from '../hooks/useLyric'
import { decodeTriplet } from '../util'
const MyLyrics = () => {
  const { usersLyrics } = useLyric()
  return (
    <section className="border">
      <h2>my lyrics</h2>

      {usersLyrics.length > 0 ? (
        usersLyrics.map((lyric) => (
          <Fragment key={lyric}>
            <span>{lyric} </span>
            <span>{decodeTriplet(lyric).join(' ')} </span>
            <br />
          </Fragment>
        ))
      ) : (
        <span>no words yet</span>
      )}
    </section>
  )
}

export { MyLyrics }
