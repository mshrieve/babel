const addresses = {
  generatorAddress: process.env.NEXT_PUBLIC_GENERATOR_ADDRESS,
  bytesAddress: process.env.NEXT_PUBLIC_BYTES_ADDRESS,
  babelAddress: process.env.NEXT_PUBLIC_BABEL_ADDRESS,
  wordsAddress: process.env.NEXT_PUBLIC_WORDS_ADDRESS,
  vaultAddress: process.env.NEXT_PUBLIC_VAULT_ADDRESS,
  lyricAddress: process.env.NEXT_PUBLIC_LYRIC_ADDRESS,
  curveAddress: process.env.NEXT_PUBLIC_CURVE_ADDRESS
}

export const useAddresses = () => {
  return addresses
}
