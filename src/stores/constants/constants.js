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
    id: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
    address: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
    chainId: "137",
    symbol: "WMATIC",
  },
  {
    id: "0x13748d548d95d78a3c83fe3f32604b4796cffa23",
    address: "0x13748d548d95d78a3c83fe3f32604b4796cffa23",
    chainId: "137",
    symbol: "KOGECOIN",
  },
  {
    id: "0x62f594339830b90ae4c084ae7d223ffafd9658a7",
    address: "0x62f594339830b90ae4c084ae7d223ffafd9658a7",
    chainId: "137",
    symbol: "SPHERE",
  },
  {
    id: "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6",
    address: "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6",
    chainId: "137",
    symbol: "WBTC",
  },
  {
    id: "0x236eec6359fb44cce8f97e99387aa7f8cd5cde1f",
    address: "0x236eec6359fb44cce8f97e99387aa7f8cd5cde1f",
    chainId: "137",
    symbol: "USD+",
  },
  {
    id: "0x255707b70bf90aa112006e1b07b9aea6de021424",
    address: "0x255707b70bf90aa112006e1b07b9aea6de021424",
    chainId: "137",
    symbol: "TETU",
  },
  {
    id: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    chainId: "137",
    symbol: "USDC",
  },
  {
    id: "0x39ab6574c289c3ae4d88500eec792ab5b947a5eb",
    address: "0x39ab6574c289c3ae4d88500eec792ab5b947a5eb",
    chainId: "137",
    symbol: "DYST",
  },
  {
    id: "0x3a58a54c066fdc0f2d55fc9c89f0415c92ebf3c4",
    address: "0x3a58a54c066fdc0f2d55fc9c89f0415c92ebf3c4",
    chainId: "137",
    symbol: "stMATIC",
  },
  {
    id: "0x3e121107f6f22da4911079845a470757af4e1a1b",
    address: "0x3e121107f6f22da4911079845a470757af4e1a1b",
    chainId: "137",
    symbol: "FXS",
  },
  {
    id: "0x1a3acf6d19267e2d3e7f898f42803e90c9219062",
    address: "0x1a3acf6d19267e2d3e7f898f42803e90c9219062",
    chainId: "137",
    symbol: "FXS",
  },
  {
    id: "0x45c32fa6df82ead1e2ef74d17b76547eddfaff89",
    address: "0x45c32fa6df82ead1e2ef74d17b76547eddfaff89",
    chainId: "137",
    symbol: "FRAX",
  },
  {
    id: "0x4cd44ced63d9a6fef595f6ad3f7ced13fceac768",
    address: "0x4cd44ced63d9a6fef595f6ad3f7ced13fceac768",
    chainId: "137",
    symbol: "tetuQi",
  },
  {
    id: "0x580a84c73811e1839f75d86d75d88cca0c241ff4",
    address: "0x580a84c73811e1839f75d86d75d88cca0c241ff4",
    chainId: "137",
    symbol: "QI",
  },
  {
    id: "0x5b0522391d0a5a37fd117fe4c43e8876fb4e91e6",
    address: "0x5b0522391d0a5a37fd117fe4c43e8876fb4e91e6",
    chainId: "137",
    symbol: "penDYST",
  },
  {
    id: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
    address: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
    chainId: "137",
    symbol: "WETH",
  },
  {
    id: "0x8a0e8b4b0903929f47c3ea30973940d4a9702067",
    address: "0x8a0e8b4b0903929f47c3ea30973940d4a9702067",
    chainId: "137",
    symbol: "INSUR",
  },
  {
    id: "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
    address: "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
    chainId: "137",
    symbol: "DAI",
  },
  {
    id: "0x9008d70a5282a936552593f410abcbce2f891a97",
    address: "0x9008d70a5282a936552593f410abcbce2f891a97",
    chainId: "137",
    symbol: "PEN",
  },
  {
    id: "0xa3c322ad15218fbfaed26ba7f616249f7705d945",
    address: "0xa3c322ad15218fbfaed26ba7f616249f7705d945",
    chainId: "137",
    symbol: "MV",
  },
  {
    id: "0xa3fa99a148fa48d14ed51d610c367c61876997f1",
    address: "0xa3fa99a148fa48d14ed51d610c367c61876997f1",
    chainId: "137",
    symbol: "MAI",
  },
  {
    id: "0xb424dfdf817faf38ff7acf6f2efd2f2a843d1aca",
    address: "0xb424dfdf817faf38ff7acf6f2efd2f2a843d1aca",
    chainId: "137",
    symbol: "vQi",
  },
  {
    id: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
    address: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
    chainId: "137",
    symbol: "USDT",
  },
  {
    id: "0xc250e9987a032acac293d838726c511e6e1c029d",
    address: "0xc250e9987a032acac293d838726c511e6e1c029d",
    chainId: "137",
    symbol: "CLAM",
  },
  {
    id: "0xe2fb42f495725c4ee50ce6e29dead57c14e0f2fd",
    address: "0xe2fb42f495725c4ee50ce6e29dead57c14e0f2fd",
    chainId: "137",
    symbol: "bePEN",
  },
  {
    id: "0xecdcb5b88f8e3c15f95c720c51c71c9e2080525d",
    address: "0xecdcb5b88f8e3c15f95c720c51c71c9e2080525d",
    chainId: "137",
    symbol: "WBNB",
  },
  {
    id: "0xf8f9efc0db77d8881500bb06ff5d6abc3070e695",
    address: "0xf8f9efc0db77d8881500bb06ff5d6abc3070e695",
    chainId: "137",
    symbol: "SYN",
  },
];

export const ROUTE_ASSETS = [
    {
        name: "Ether",
        symbol: "ETH",
        address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
        decimals: 18,
        logoURI: "https://i.ibb.co/rGJ8WyX/eth-logo.png"
    },
    {
        "name": "USDT",
        "symbol": "USDT",
        "address": "0xB0517790d29753429D63eFe95be5879EDc8c3311",
        "decimals": 6,
        "logoURI": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png"
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

export const DEFAULT_ASSET_FROM = "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270"
export const DEFAULT_ASSET_TO = "0x39ab6574c289c3ae4d88500eec792ab5b947a5eb"

export const GAS_MULTIPLIER = 1.3
