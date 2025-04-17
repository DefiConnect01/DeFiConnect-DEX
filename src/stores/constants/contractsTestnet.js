import abis from "../abis/abis";



export const GOV_TOKEN_ADDRESS = '0xf53EcB45A7D0048fb73Be03ab1776eb00f953D41';
    

export const GOV_TOKEN_NAME = 'DeFiConnect token'
export const GOV_TOKEN_SYMBOL = 'DCC'
export const GOV_TOKEN_DECIMALS = 18
export const GOV_TOKEN_LOGO = 'https=//dystopia-swap-seven.vercel.app/logo.svg'
export const GOV_TOKEN_ABI = abis.tokenABI

// changed
export const VE_TOKEN_ADDRESS = '0xdb3A01fC9193b6D49048f99a9447723852b6DB2d'
export const VE_TOKEN_NAME = 'veDYST' // redeploy contract and change name
export const VE_TOKEN_SYMBOL = 'veDYST' // redeploy contract and change name
export const VE_TOKEN_DECIMALS = 18
export const VE_TOKEN_LOGO = 'https=//dystopia-swap-seven.vercel.app/logo.svg'
export const VE_TOKEN_ABI = abis.veTokenABI

export const WFTM_ADDRESS = '0x46961dBC53AF28CE82479f6e1eA10F6477CfEca3'
export const WFTM_NAME = 'ETH'
export const WFTM_SYMBOL = 'WETH'
export const WFTM_DECIMALS = 18
export const WFTM_LOGO = 'https=//raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0/logo.png'
export const WFTM_ABI = abis.wftmABI

// changed
export const FTM_ADDRESS = 'ETH'
export const FTM_NAME = 'ETH'
export const FTM_SYMBOL = 'ETH'
export const FTM_DECIMALS = 18
export const FTM_LOGO = 'https=//i.ibb.co/rGJ8WyX/eth-logo.png'

// changed
export const FACTORY_ADDRESS = '0x85A0018e031091985EE27c6D056205bF20A55Ff2'
export const FACTORY_ABI = abis.factoryABI

// changed
export const ROUTER_ADDRESS = '0x8497a0b648d6a257a6C5C96091d33b4670992BAD'
export const ROUTER_ABI = abis.routerABI

// changed
export const VE_DIST_ADDRESS = '0xE6750f743A8d91A7D16dA5E3cdE69cb2e70c28Aa'
export const VE_DIST_ABI = abis.veDistABI

// changed
export const VOTER_ADDRESS = '0x48950a60e12CAcb8043F32fFeF85d56D561D5671'
export const VOTER_ABI = abis.voterABI

// changed
export const LIBRARY_ADDRESS = '0x6845cf30A9211050a0C706D85C09FcAe38734DDf'
export const LIBRARY_ABI = abis.dystopiaLibraryABI

export const REWARD_ADDRESS = '0xf53EcB45A7D0048fb73Be03ab1776eb00f953D41' //DCC
export const ERC20_ABI = abis.erc20ABI
export const PAIR_ABI = abis.pairABI
export const GAUGE_ABI = abis.gaugeABI
export const BRIBE_ABI = abis.bribeABI
export const TOKEN_ABI = abis.tokenABI

export const MULTICALL_ADDRESS = '0x08411ADd0b5AA8ee47563b146743C13b3556c9Cc'

//LOAN 
// export const LENDPOOL_ADDRESS= "";
// export const AUCTION_ADDRESS = "";

// export const LENDPOOL_ABI = ;
// export const AUCTION_ABI = ;

// // CROSS_CHAIN 
// export const CROSSCHAIN_ADDRESS = "";
// export const CROOSSCHAIN_ABI = ;



 ////////////////////////////////////////////
//         MULTI_CHAIN SECTION             //
 //////////////////////////////////////////

// export const CONTRACT_TESTNET = {

// 66665= {
//    GOV_TOKEN_ADDRESS = '0xf53EcB45A7D0048fb73Be03ab1776eb00f953D41',
//     GOV_TOKEN_NAME = 'DeFiConnect token',
//     GOV_TOKEN_SYMBOL = 'DCC',
//     GOV_TOKEN_DECIMALS = 18,
//     GOV_TOKEN_LOGO = 'https=//dystopia-swap-seven.vercel.app/logo.svg',
//     GOV_TOKEN_ABI = abis.tokenABI,

// // changed,
//  VE_TOKEN_ADDRESS = '0xdb3A01fC9193b6D49048f99a9447723852b6DB2d',
//  VE_TOKEN_NAME = 'veDYST', // redeploy contract and change name
//  VE_TOKEN_SYMBOL = 'veDYST', // redeploy contract and change name
// VE_TOKEN_DECIMALS = 18,
// VE_TOKEN_LOGO = 'https=//dystopia-swap-seven.vercel.app/logo.svg',
// VE_TOKEN_ABI = abis.veTokenABI,

//  WFTM_ADDRESS = '0x46961dBC53AF28CE82479f6e1eA10F6477CfEca3',
//  WFTM_NAME = 'ETH',
//  WFTM_SYMBOL = 'WETH',
// WFTM_DECIMALS = 18,
//  WFTM_LOGO = 'https=//raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0/logo.png',
// WFTM_ABI = abis.wftmABI,

// // changed
// FTM_ADDRESS = 'ETH',
// FTM_NAME = 'ETH',
//  FTM_SYMBOL = 'ETH',
//  FTM_DECIMALS = 18,
//  FTM_LOGO = 'https=//i.ibb.co/rGJ8WyX/eth-logo.png',

// // changed
//  FACTORY_ADDRESS = '0x85A0018e031091985EE27c6D056205bF20A55Ff2',
// FACTORY_ABI = abis.factoryABI,

// // changed
// ROUTER_ADDRESS = '0x8497a0b648d6a257a6C5C96091d33b4670992BAD',
// ROUTER_ABI = abis.routerABI,

//  BASE_ASSETS_WHITELIST = [
//   {
//     id= "0x6D25D76F57ec8292AC3caF3BbCB54E4524FB0885",
//     address= "0x6D25D76F57ec8292AC3caF3BbCB54E4524FB0885",
//     chainId= 66665,
//     symbol= "EDS",
//   },
//   {
//     id= "0x9752eFc4717A0CBbbd8DF45E2232833cBae1b5eB",
//     address= "0x9752eFc4717A0CBbbd8DF45E2232833cBae1b5eB",
//     chainId= 66665,
//     symbol= "TSL",
//   },
//   {
//     id= "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
//     address= "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
//     chainId= 66665,
//     symbol= "ETH",
//   },
//   {
//     id= "0xB0517790d29753429D63eFe95be5879EDc8c3311",
//     address= "0xB0517790d29753429D63eFe95be5879EDc8c3311",
//     chainId= 66665,
//     symbol= "USDT",
//   },
//   {
//     id= "0xE0870ba18492E46a8137daE711d583aae26E7337",
//     address= "0xE0870ba18492E46a8137daE711d583aae26E7337",
//     chainId= 66665,
//     symbol= "USDC.e",
//   },
//   {
//     id= "0xD0015150ef225D6762E8adBD682B4D7e941846D6",
//     address= "0xD0015150ef225D6762E8adBD682B4D7e941846D6",
//     chainId= 66665,
//     symbol= "DAI",
//   },
//   {
//     id= "0x33950C41c72D1a8c559aE312a81F9DA3e42D09D4",
//     address= "0x33950C41c72D1a8c559aE312a81F9DA3e42D09D4",
//     chainId= 66665,
//     symbol= "BTC",
//   },
// ],

// ROUTE_ASSETS = [
//   {
//     name= "Eddison",
//     symbol= "EDS",
//     address= "0x6D25D76F57ec8292AC3caF3BbCB54E4524FB0885",
//     decimals= 18,
//     logoURI= "https=//raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png"
//   },
//   {
//     name= "Tesla",
//     symbol= "TSL",
//     address= "0x9752eFc4717A0CBbbd8DF45E2232833cBae1b5eB",
//     decimals= 18,
//     logoURI= "https=//i.ibb.co/rGJ8WyX/eth-logo.png"
//   },
//   {
//       name= "Ether",
//       symbol= "ETH",
//       address= "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
//       decimals= 18,
//       logoURI= "https=//i.ibb.co/rGJ8WyX/eth-logo.png"
//   },
//   {
//       name= "USDT",
//       symbol= "USDT",
//       address= "0xB0517790d29753429D63eFe95be5879EDc8c3311",
//       decimals= 6,
//       logoURI= "https=//raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png"
//   },
//   {
//       name= "Bridged USDC",
//       symbol= "USDC.e",
//       address= "0xE0870ba18492E46a8137daE711d583aae26E7337",
//       decimals= 6,
//       logoURI= "https=//coin-images.coingecko.com/coins/images/6319/large/usdc.png?1696506694"
//   },
//   {
//       name= "DAI",
//       symbol= "DAI",
//       address= "0xD0015150ef225D6762E8adBD682B4D7e941846D6",
//       decimals= 18,
//       logoURI= "https=//i.ibb.co/rGJ8WyX/eth-logo.png"
//   },
//   {
//       name= "BTC",
//       symbol= "BTC",
//       address= "0x33950C41c72D1a8c559aE312a81F9DA3e42D09D4",
//       decimals= 8,
//       logoURI= "https=//i.ibb.co/rGJ8WyX/eth-logo.png"
//   }
// ],

//  DIRECT_SWAP_ROUTES= {
//   // SPHERE -> USD+
//   ["0x62f594339830b90ae4c084ae7d223ffafd9658a7".toLowerCase()]= "0x236eec6359fb44cce8f97e99387aa7f8cd5cde1f".toLowerCase(),
//   // penDYST -> DYST
//   ["0x5b0522391d0a5a37fd117fe4c43e8876fb4e91e6".toLowerCase()]= "0x39aB6574c289c3Ae4d88500eEc792AB5B947A5Eb".toLowerCase(),
// },

//  MULTISWAP_INCLUDE =[
//   // TETU
//   // "0x255707B70BF90aa112006E1b07B9AeA6De021424".toLowerCase(),
// ],

// ALLOWED_DUPLICATE_SYMBOLS= [
//   "FXS",
// ],


// // changed
//  VE_DIST_ADDRESS = '0xE6750f743A8d91A7D16dA5E3cdE69cb2e70c28Aa',
//  VE_DIST_ABI = abis.veDistABI,

// // changed
// VOTER_ADDRESS = '0x48950a60e12CAcb8043F32fFeF85d56D561D5671',
// VOTER_ABI = abis.voterABI,

// // changed
//  LIBRARY_ADDRESS = '0x6845cf30A9211050a0C706D85C09FcAe38734DDf',
//  LIBRARY_ABI = abis.dystopiaLibraryABI,

//  REWARD_ADDRESS = '0xf53EcB45A7D0048fb73Be03ab1776eb00f953D41', //DCC
//  ERC20_ABI = abis.erc20ABI,
//  PAIR_ABI = abis.pairABI,
//  GAUGE_ABI = abis.gaugeABI,
//  BRIBE_ABI = abis.bribeABI,
// TOKEN_ABI = abis.tokenABI,

//  MULTICALL_ADDRESS = '0x08411ADd0b5AA8ee47563b146743C13b3556c9Cc',

// //LOAN 
//  LENDPOOL_ADDRESS= "",
//  AUCTION_ADDRESS = "",
//  CROSSCHAIN_ADDRESS = "",
//  LENDPOOL_ABI = abis.erc20ABI,
//  AUCTION_ABI = abis.erc20ABI,

// // CROSS_CHAIN 
//  CROOSSCHAIN_ABI = abis.erc20ABI,

//  },

//   2484= { // U2u Testnet
//       GOV_TOKEN_ADDRESS = '',
//       GOV_TOKEN_NAME = 'DeFiConnect token',
//       GOV_TOKEN_SYMBOL = 'DCC',
//       GOV_TOKEN_DECIMALS = 18,
//       GOV_TOKEN_LOGO = 'https=//dystopia-swap-seven.vercel.app/logo.svg',
//       GOV_TOKEN_ABI = abis.tokenABI,
  
//   // changed,
//    VE_TOKEN_ADDRESS = '0xdb3A01fC9193b6D49048f99a9447723852b6DB2d',
//    VE_TOKEN_NAME = 'veDYST', // redeploy contract and change name
//    VE_TOKEN_SYMBOL = 'veDYST', // redeploy contract and change name
//   VE_TOKEN_DECIMALS = 18,
//   VE_TOKEN_LOGO = 'https=//dystopia-swap-seven.vercel.app/logo.svg',
//   VE_TOKEN_ABI = abis.veTokenABI,
  
//    WFTM_ADDRESS = '0xF8A37509C8a1ee397e8585A4C84B02358a2240A8',
//    WFTM_NAME = 'ETH',
//    WFTM_SYMBOL = 'WETH',
//   WFTM_DECIMALS = 18,
//    WFTM_LOGO = 'https=//raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0/logo.png',
//   WFTM_ABI = abis.wftmABI,
  
//   // changed
//   FTM_ADDRESS = 'ETH',
//   FTM_NAME = 'ETH',
//    FTM_SYMBOL = 'ETH',
//    FTM_DECIMALS = 18,
//    FTM_LOGO = 'https=//i.ibb.co/rGJ8WyX/eth-logo.png',
  
//   // changed
//    FACTORY_ADDRESS = '0xF5CBD0241D176C6cF35564d2F5b701F74a0756E8',
//   FACTORY_ABI = abis.factoryABI,
  
//   // changed
//   ROUTER_ADDRESS = '0x8972e85D9C41509F98FC77F61634D4aFa1D709b5',
//   ROUTER_ABI = abis.routerABI,

//   BASE_ASSETS_WHITELIST = [
   
//     {
//       id= "0x9752eFc4717A0CBbbd8DF45E2232833cBae1b5eB",
//       address= "0x9752eFc4717A0CBbbd8DF45E2232833cBae1b5eB",
//       chainId= 66665,
//       symbol= "TSL",
//     },
//     {
//       id= "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
//       address= "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
//       chainId= 2484,
//       symbol= "ETH",
//     },
    
//     {
//       id= "0xE0870ba18492E46a8137daE711d583aae26E7337",
//       address= "0xE0870ba18492E46a8137daE711d583aae26E7337",
//       chainId= 2484,
//       symbol= "pUSDT",
//     },
    
//   ],
  
//   ROUTE_ASSETS = [
   
//     {
//         name= "Ether",
//         symbol= "ETH",
//         address= "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
//         decimals= 18,
//         logoURI= "https=//i.ibb.co/rGJ8WyX/eth-logo.png"
//     },
//     {
//         name= "pUSDT",
//         symbol= "pUSDT",
//         address= "",
//         decimals= 18,
//         logoURI= "https=//raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png"
//     },
   
//   ],
  

//   DIRECT_SWAP_ROUTES= {
//     // SPHERE -> USD+
//     ["0x62f594339830b90ae4c084ae7d223ffafd9658a7".toLowerCase()]= "0x236eec6359fb44cce8f97e99387aa7f8cd5cde1f".toLowerCase(),
//     // penDYST -> DYST
//     ["0x5b0522391d0a5a37fd117fe4c43e8876fb4e91e6".toLowerCase()]= "0x39aB6574c289c3Ae4d88500eEc792AB5B947A5Eb".toLowerCase(),
//   },
  
//    MULTISWAP_INCLUDE =[
//     // TETU
//     // "0x255707B70BF90aa112006E1b07B9AeA6De021424".toLowerCase(),
//   ],
  
//   ALLOWED_DUPLICATE_SYMBOLS= [
//     "FXS",
//   ],
//   // changed
//    VE_DIST_ADDRESS = '0xE6750f743A8d91A7D16dA5E3cdE69cb2e70c28Aa',
//    VE_DIST_ABI = abis.veDistABI,
  
//   // changed
//   VOTER_ADDRESS = '0x48950a60e12CAcb8043F32fFeF85d56D561D5671',
//   VOTER_ABI = abis.voterABI,
  
//   // changed
//    LIBRARY_ADDRESS = '0x6845cf30A9211050a0C706D85C09FcAe38734DDf',
//    LIBRARY_ABI = abis.dystopiaLibraryABI,
  
//    REWARD_ADDRESS = '0xf53EcB45A7D0048fb73Be03ab1776eb00f953D41', //DCC
//   ERC20_ABI = abis.erc20ABI,
//    PAIR_ABI = abis.pairABI,
//    GAUGE_ABI = abis.gaugeABI,
//    BRIBE_ABI = abis.bribeABI,
//   TOKEN_ABI = abis.tokenABI,
  
//    MULTICALL_ADDRESS = '0x08411ADd0b5AA8ee47563b146743C13b3556c9Cc',
  
//   //LOAN 
//    LENDPOOL_ADDRESS= "",
//    AUCTION_ADDRESS = "",
  
//    LENDPOOL_ABI = abis.tokenABI,
//    AUCTION_ABI = abis.tokenABI,
  
//   // CROSS_CHAIN 
//    CROSSCHAIN_ADDRESS = "",
//    CROOSSCHAIN_ABI = abis.tokenABI

//   },

//   50002= { // Pharos Devnet
//       GOV_TOKEN_ADDRESS = '',
//       GOV_TOKEN_NAME = 'DeFiConnect token',
//       GOV_TOKEN_SYMBOL = 'DCC',
//       GOV_TOKEN_DECIMALS = 18,
//       GOV_TOKEN_LOGO = 'https=//dystopia-swap-seven.vercel.app/logo.svg',
//       GOV_TOKEN_ABI = abis.tokenABI,
  
//   // changed,
//    VE_TOKEN_ADDRESS = '0xdb3A01fC9193b6D49048f99a9447723852b6DB2d',
//    VE_TOKEN_NAME = 'veDYST', // redeploy contract and change name
//    VE_TOKEN_SYMBOL = 'veDYST', // redeploy contract and change name
//   VE_TOKEN_DECIMALS = 18,
//   VE_TOKEN_LOGO = 'https=//dystopia-swap-seven.vercel.app/logo.svg',
//   VE_TOKEN_ABI = abis.veTokenABI,
  
//    WFTM_ADDRESS = ' 0xF8A37509C8a1ee397e8585A4C84B02358a2240A8',
//    WFTM_NAME = 'ETH',
//    WFTM_SYMBOL = 'WETH',
//   WFTM_DECIMALS = 18,
//    WFTM_LOGO = 'https=//raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0/logo.png',
//   WFTM_ABI = abis.wftmABI,
  
//   // changed
//   FTM_ADDRESS = 'ETH',
//   FTM_NAME = 'ETH',
//    FTM_SYMBOL = 'ETH',
//    FTM_DECIMALS = 18,
//    FTM_LOGO = 'https=//i.ibb.co/rGJ8WyX/eth-logo.png',
  
//   // changed
//    FACTORY_ADDRESS = '0xF5CBD0241D176C6cF35564d2F5b701F74a0756E8',
//   FACTORY_ABI = abis.factoryABI,
  
//   // changed
//   ROUTER_ADDRESS = '0x8972e85D9C41509F98FC77F61634D4aFa1D709b5',
//   ROUTER_ABI = abis.routerABI,
  

//   BASE_ASSETS_WHITELIST = [
//   {
//     id= "0x6D25D76F57ec8292AC3caF3BbCB54E4524FB0885",
//     address= "0x6D25D76F57ec8292AC3caF3BbCB54E4524FB0885",
//     chainId= 66665,
//     symbol= "EDS",
//   },
//   {
//     id= "0x9752eFc4717A0CBbbd8DF45E2232833cBae1b5eB",
//     address= "0x9752eFc4717A0CBbbd8DF45E2232833cBae1b5eB",
//     chainId= 66665,
//     symbol= "TSL",
//   },
//   {
//     id= "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
//     address= "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
//     chainId= 66665,
//     symbol= "ETH",
//   },
//   {
//     id= "0xB0517790d29753429D63eFe95be5879EDc8c3311",
//     address= "0xB0517790d29753429D63eFe95be5879EDc8c3311",
//     chainId= 66665,
//     symbol= "USDT",
//   },
//   {
//     id= "0xE0870ba18492E46a8137daE711d583aae26E7337",
//     address= "0xE0870ba18492E46a8137daE711d583aae26E7337",
//     chainId= 66665,
//     symbol= "USDC.e",
//   },
//   {
//     id= "0xD0015150ef225D6762E8adBD682B4D7e941846D6",
//     address= "0xD0015150ef225D6762E8adBD682B4D7e941846D6",
//     chainId= 66665,
//     symbol= "DAI",
//   },
//   {
//     id= "0x33950C41c72D1a8c559aE312a81F9DA3e42D09D4",
//     address= "0x33950C41c72D1a8c559aE312a81F9DA3e42D09D4",
//     chainId= 66665,
//     symbol= "BTC",
//   },
// ],

// ROUTE_ASSETS = [
//   {
//     name= "Eddison",
//     symbol= "EDS",
//     address= "0x6D25D76F57ec8292AC3caF3BbCB54E4524FB0885",
//     decimals= 18,
//     logoURI= "https=//raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png"
//   },
//   {
//     name= "Tesla",
//     symbol= "TSL",
//     address= "0x9752eFc4717A0CBbbd8DF45E2232833cBae1b5eB",
//     decimals= 18,
//     logoURI= "https=//i.ibb.co/rGJ8WyX/eth-logo.png"
//   },
//   {
//       name= "Ether",
//       symbol= "ETH",
//       address= "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
//       decimals= 18,
//       logoURI= "https=//i.ibb.co/rGJ8WyX/eth-logo.png"
//   },
//   {
//       name= "USDT",
//       symbol= "USDT",
//       address= "0xB0517790d29753429D63eFe95be5879EDc8c3311",
//       decimals= 6,
//       logoURI= "https=//raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png"
//   },
//   {
//       name= "Bridged USDC",
//       symbol= "USDC.e",
//       address= "0xE0870ba18492E46a8137daE711d583aae26E7337",
//       decimals= 6,
//       logoURI= "https=//coin-images.coingecko.com/coins/images/6319/large/usdc.png?1696506694"
//   },
//   {
//       name= "DAI",
//       symbol= "DAI",
//       address= "0xD0015150ef225D6762E8adBD682B4D7e941846D6",
//       decimals= 18,
//       logoURI= "https=//i.ibb.co/rGJ8WyX/eth-logo.png"
//   },
//   {
//       name= "BTC",
//       symbol= "BTC",
//       address= "0x33950C41c72D1a8c559aE312a81F9DA3e42D09D4",
//       decimals= 8,
//       logoURI= "https=//i.ibb.co/rGJ8WyX/eth-logo.png"
//   }
// ],

// DIRECT_SWAP_ROUTES= {
//     // SPHERE -> USD+
//     ["0x62f594339830b90ae4c084ae7d223ffafd9658a7".toLowerCase()]= "0x236eec6359fb44cce8f97e99387aa7f8cd5cde1f".toLowerCase(),
//     // penDYST -> DYST
//     ["0x5b0522391d0a5a37fd117fe4c43e8876fb4e91e6".toLowerCase()]= "0x39aB6574c289c3Ae4d88500eEc792AB5B947A5Eb".toLowerCase(),
//   },
  
//    MULTISWAP_INCLUDE =[
//     // TETU
//     // "0x255707B70BF90aa112006E1b07B9AeA6De021424".toLowerCase(),
//   ],
  
//   ALLOWED_DUPLICATE_SYMBOLS= [
//     "FXS",
//   ],
//   // changed
//    VE_DIST_ADDRESS = '0xE6750f743A8d91A7D16dA5E3cdE69cb2e70c28Aa',
//    VE_DIST_ABI = abis.veDistABI,
  
//   // changed
//   VOTER_ADDRESS = '0x48950a60e12CAcb8043F32fFeF85d56D561D5671',
//   VOTER_ABI = abis.voterABI,
  
//   // changed
//    LIBRARY_ADDRESS = '0x6845cf30A9211050a0C706D85C09FcAe38734DDf',
//    LIBRARY_ABI = abis.dystopiaLibraryABI,
  
//    REWARD_ADDRESS = '0xf53EcB45A7D0048fb73Be03ab1776eb00f953D41', //DCC
//   ERC20_ABI = abis.erc20ABI,
//    PAIR_ABI = abis.pairABI,
//    GAUGE_ABI = abis.gaugeABI,
//    BRIBE_ABI = abis.bribeABI,
//   TOKEN_ABI = abis.tokenABI,
  
//    MULTICALL_ADDRESS = '0x08411ADd0b5AA8ee47563b146743C13b3556c9Cc',
  
//   //LOAN 
//    LENDPOOL_ADDRESS= "",
//    AUCTION_ADDRESS = "",
  
//    LENDPOOL_ABI = "",
//    AUCTION_ABI = "",
  
//   // CROSS_CHAIN 
//    CROSSCHAIN_ADDRESS = "",
//    CROOSSCHAIN_ABI = "",

//   }

// };


// // export default CONTRACT_TESTNET;