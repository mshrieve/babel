const addresses = {
  generatorAddress: process.env.NEXT_PUBLIC_GENERATOR_ADDRESS,
  randomAddress: process.env.NEXT_PUBLIC_RANDOM_ADDRESS,
  babelAddress: process.env.NEXT_PUBLIC_BABEL_ADDRESS,
  wordsAddress: process.env.NEXT_PUBLIC_WORDS_ADDRESS,
  vaultAddress: process.env.NEXT_PUBLIC_VAULT_ADDRESS,
  threeAddress: process.env.NEXT_PUBLIC_THREE_ADDRESS
}

export const useAddresses = () => {
  return addresses
}
