import Link from 'next/link'
export const Nav = () => {
  return (
    <>
      <nav>
        <b>BABEL</b>
        <Link href="/wallet">
          <a className="navItem">WALLET</a>
        </Link>
        <Link href="/words">
          <a className="navItem">WORDS</a>
        </Link>
        <Link href="/lyric">
          <a className="navItem">LYRIC</a>
        </Link>
      </nav>
    </>
  )
}
