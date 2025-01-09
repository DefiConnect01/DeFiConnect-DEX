import BigNumber from 'bignumber.js'
import * as contractsTestnet from './contractsTestnet'
import * as contracts from './contracts'
import * as actions from './actions'
import * as queries from './graph-queries'


let isTestnet = import.meta.env.VITE_PUBLIC_CHAINID == 66665
console.log({
  isTestnet
})

// URLS
let scan, cont;
if (isTestnet) {
  scan = 'https://explorer.creatorchain.io/'
  cont = contractsTestnet
} else {
  scan = 'https://polygonscan.com/'
  cont = contracts
}

export const ETHERSCAN_URL = scan

export const CONTRACTS = cont
export const ACTIONS = actions
export const QUERIES = queries

export const NETWORK_TOKEN_NAME = CONTRACTS.FTM_NAME;

export const MAX_UINT256 = new BigNumber(2).pow(256).minus(1).toFixed(0)
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const RENAME_ASSETS = {
  "miMATIC": "MAI"
}

export const BLACK_LIST_TOKENS = [
  '0x104592a158490a9228070e0a8e5343b499e125d0'.toLowerCase(), // wrong FRAX
  '0x8d546026012bf75073d8a586f24a5d5ff75b9716'.toLowerCase(), // old SPHERE
  '0x17e9c5b37283ac5fbe527011cec257b832f03eb3'.toLowerCase(), // old SPHERE
]

export const BASE_ASSETS_WHITELIST = [
  {
    id: "0x6D25D76F57ec8292AC3caF3BbCB54E4524FB0885",
    address: "0x6D25D76F57ec8292AC3caF3BbCB54E4524FB0885",
    chainId: 66665,
    symbol: "EDS",
  },
  {
    id: "0x9752eFc4717A0CBbbd8DF45E2232833cBae1b5eB",
    address: "0x9752eFc4717A0CBbbd8DF45E2232833cBae1b5eB",
    chainId: 66665,
    symbol: "TSL",
  },
  {
    id: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    chainId: 66665,
    symbol: "ETH",
  },
  {
    id: "0xB0517790d29753429D63eFe95be5879EDc8c3311",
    address: "0xB0517790d29753429D63eFe95be5879EDc8c3311",
    chainId: 66665,
    symbol: "USDT",
  },
  {
    id: "0xE0870ba18492E46a8137daE711d583aae26E7337",
    address: "0xE0870ba18492E46a8137daE711d583aae26E7337",
    chainId: 66665,
    symbol: "USDC.e",
  },
  {
    id: "0xD0015150ef225D6762E8adBD682B4D7e941846D6",
    address: "0xD0015150ef225D6762E8adBD682B4D7e941846D6",
    chainId: 66665,
    symbol: "DAI",
  },
  {
    id: "0x33950C41c72D1a8c559aE312a81F9DA3e42D09D4",
    address: "0x33950C41c72D1a8c559aE312a81F9DA3e42D09D4",
    chainId: 66665,
    symbol: "BTC",
  },
];

export const ROUTE_ASSETS = [
  {
    name: "Eddison",
    symbol: "EDS",
    address: "0x6D25D76F57ec8292AC3caF3BbCB54E4524FB0885",
    decimals: 18,
    logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png"
  },
  {
    name: "Tesla",
    symbol: "TSL",
    address: "0x9752eFc4717A0CBbbd8DF45E2232833cBae1b5eB",
    decimals: 18,
    logoURI: "https://i.ibb.co/rGJ8WyX/eth-logo.png"
  },
  {
      name: "Ether",
      symbol: "ETH",
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      decimals: 18,
      logoURI: "https://i.ibb.co/rGJ8WyX/eth-logo.png"
  },
  {
      name: "USDT",
      symbol: "USDT",
      address: "0xB0517790d29753429D63eFe95be5879EDc8c3311",
      decimals: 6,
      logoURI: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png"
  },
  {
      name: "Bridged USDC",
      symbol: "USDC.e",
      address: "0xE0870ba18492E46a8137daE711d583aae26E7337",
      decimals: 6,
      logoURI: "https://coin-images.coingecko.com/coins/images/6319/large/usdc.png?1696506694"
  },
  {
      name: "DAI",
      symbol: "DAI",
      address: "0xD0015150ef225D6762E8adBD682B4D7e941846D6",
      decimals: 18,
      logoURI: "https://i.ibb.co/rGJ8WyX/eth-logo.png"
  },
  {
      name: "BTC",
      symbol: "BTC",
      address: "0x33950C41c72D1a8c559aE312a81F9DA3e42D09D4",
      decimals: 8,
      logoURI: "https://i.ibb.co/rGJ8WyX/eth-logo.png"
  }
];

// hardcoded routes for taxable tokens
export const DIRECT_SWAP_ROUTES = {
  // SPHERE -> USD+
  ["0x62f594339830b90ae4c084ae7d223ffafd9658a7".toLowerCase()]: "0x236eec6359fb44cce8f97e99387aa7f8cd5cde1f".toLowerCase(),
  // penDYST -> DYST
  ["0x5b0522391d0a5a37fd117fe4c43e8876fb4e91e6".toLowerCase()]: "0x39aB6574c289c3Ae4d88500eEc792AB5B947A5Eb".toLowerCase(),
}

export const MULTISWAP_INCLUDE = [
  // TETU
  // "0x255707B70BF90aa112006E1b07B9AeA6De021424".toLowerCase(),
]

export const ALLOWED_DUPLICATE_SYMBOLS = [
  "FXS",
]

export const DEFAULT_ASSET_FROM = "0x6D25D76F57ec8292AC3caF3BbCB54E4524FB0885"
export const DEFAULT_ASSET_TO = "0x9752eFc4717A0CBbbd8DF45E2232833cBae1b5eB"

export const GAS_MULTIPLIER = 1.3
