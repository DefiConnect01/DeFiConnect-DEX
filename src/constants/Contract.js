import { ONE_DAY } from '../utils/common'
import tokenAbi from './abis/token.json'
import stakingAbi from './abis/staking.json'

export const tokenAddresses = {
    84532: '0xDc52bC266670Ad5529b7B480881C9ED1ff1d09b4',
    97: '0xF1308fB5Fd5aA9073AdF470Df99ae1b7cfe83713',
    56: '0xB021A0e505eCfe41dCB497b70Fb123430e30d94d',
}

export const contractAddresses = {
    84532: {
        [30 * ONE_DAY]: '0x03aDDD7B5331c2aF4E326bf150c97a63FFBa7478',
        [60 * ONE_DAY]: '0x924e71c52528eaD99a6d7C1B977993a747B75367',
        [90 * ONE_DAY]: '0x927E346a006D27F291fdD123665F92e22264C83A',
        [120 * ONE_DAY]: '0x41AA851e80e3b79Cc8dEfE479792559C6bf56b45',
    },
    97: {
        [30 * ONE_DAY]: '0x1d8D0aE34f6cFb6fec624A00F9b9C0415Bfa688A',
        [60 * ONE_DAY]: '0xa3d59fFDa1848CECD80C3acAc4468865d947c205',
        [90 * ONE_DAY]: '0xe283F8138D54557C1A26E101E6A0581A6b89bbcB',
        [120 * ONE_DAY]: '0xCdA31fB24453314b66165199Dc980D81dcDB267E',
    },
    56: {
        [30 * ONE_DAY]: '0x3ba284085Aa7B49324BbE7B8dfAcd930FE9A5213',
        [60 * ONE_DAY]: '0xC948F751E9725bBbEa5Df15061eeb433Ec356B8B',
        [90 * ONE_DAY]: '0x75FADa9b320B5a162B727E40898A26c881738D27',
        [120 * ONE_DAY]: '0xABcfEFfC2b9151b6C9441b2737f2F691d9ca68B5',
    },
}

export const getContractAddressesList = (network) => {
    const addresses = contractAddresses[network];
    return addresses ? Object.values(addresses) : [];
}

export const TOKEN_ABI = tokenAbi
export const DCC_STAKING_ABI = stakingAbi