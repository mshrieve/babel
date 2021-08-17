import { useEth } from '../context/eth'

const rinkebyAddresses = {
  bytesAddress: '0xb4fe529dea331de19d7d9dd9e2e15dde440322d1',
  babelAddress: '0xbd66b58d17f2ae9763d2e1ef6f4f0ef6228a3d00',
  wordsAddress: '0x99d93b7d0d9334cc7a596f0567661bad6f614da3',
  lyricAddress: '0xee88f7513276bb7999bfe807b30e933ed018012a'
}

const localhostAddresses = {
  bytesAddress: '0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9',
  babelAddress: '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512',
  wordsAddress: '0xdc64a140aa3e981100a9beca4e685f962f0cf6c9',
  lyricAddress: '0x5fc8d32690cc91d4c39d9d3abcbd16989f875707'
}

export const useAddresses = () => {
  const { chainId } = useEth()
  return chainId == 4 ? rinkebyAddresses : localhostAddresses
}
