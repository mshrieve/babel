# BABEL

Babel is an interactive, collaborative `poetry' project using ERC20 and ERC721.

Feel free to get in touch with any questions/comments: mike@loset.info

## contracts

### Babel

Babel is the erc20 used as the native currency for almost all interactions.

### Bytes

Bytes is the chainlink VRFConsumerBase responsible for requesting and receiving vrf requests.

### Curve

Curve is the bonding curve which sells Babel for ETH.

### House

House allows users to auction individual words, starting at a reserve price of their choosing.

### Lyric

Lyric is a three-word collaborative poem (lyric), where each iteration is minted as an erc721 to the updater.

Proposers participate in short auctions for the right to update the lyric.

### Rotor

Rotor is the random-word generating algorithm.

### Vault

Vault is where users can deposit words in exchange for babel, or where users can purchase an available word for a fixed cost.

### Words

Words mints a random five-letter word to the requester.
