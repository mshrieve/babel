export const DisplayLyric = ({ lyric }: { lyric: String[] | undefined }) => {
  return (
    <main className={['displayLyric', 'border'].join(' ')}>
      {lyric && [0, 1, 2].map((i) => <span className="word">{lyric[i]}</span>)}
    </main>
  )
}
