import ton from './assets/ton.svg'
import hton from './assets/hton.svg'
import question from './assets/question.svg'
import questionDark from './assets/question-dark.svg'
import checkOrange from './assets/check-orange.svg'
import { useEffect, useState } from 'react'
import ActionButton from './components/ConnectButton'
import { useAccount, useBalance, useReadContract } from 'wagmi'
import { CHAIN } from './wagmi'
import { contractAddresses, DCC_STAKING_ABI, tokenAddresses } from './constants/contracts'
import { STAKING_DURATIONS } from './constants/stakingOptions'
import { addCommas, getTimeLeft, ONE_DAY, toastProps } from './utils/common'
import { toast } from 'react-toastify'
import { formatUnits } from 'viem'

const StakeUnstake = () => {
    const [timeLeft, setTimeLeft] = useState('0')
    const [activeTab, setActiveTab] = useState('stake')
    const [unstakeOption, setUnstakeOption] = useState('unstake')
    const [loading, setLoading] = useState(false)
    const { address, isConnected, chainId, chain } = useAccount()

    const currentChainId = chainId || CHAIN.id
    const currentTokenAddress = tokenAddresses[currentChainId]

    const { data: tokenBalanceData } = useBalance({
        address,
        chainId: currentChainId,
        token: currentTokenAddress,
        query: {
            enabled: !!address && isConnected,
            refetchInterval: 10000,
        },
    })

    const [selectedDuration, setSelectedDuration] = useState(STAKING_DURATIONS[0])
    const [stakeAmount, setStakeAmount] = useState('')
    const [contractConfig, setContractConfig] = useState({
        stakingAddress: null,
        tokenAddress: null,
    })

    const symbol = chain ? chain.nativeCurrency.symbol : CHAIN.nativeCurrency.symbol

    useEffect(() => {
        if (!currentChainId) {
            toast.error('No chain ID available', toastProps)
            return
        }

        const networkContracts = contractAddresses[currentChainId]
        if (!networkContracts) return

        const stakingAddress = networkContracts[selectedDuration.value]
        if (!stakingAddress) return

        setContractConfig({
            stakingAddress,
            tokenAddress: currentTokenAddress,
        })
    }, [selectedDuration, currentTokenAddress, currentChainId])

    useEffect(() => {
        if (isConnected) {
            toast('🎉 Wallet connected successfully!', toastProps)
        }
    }, [isConnected])

    const { data: apyData } = useReadContract({
        address: contractConfig.stakingAddress,
        abi: DCC_STAKING_ABI,
        functionName: 'apy',
        query: {
            enabled: !!contractConfig.stakingAddress && isConnected,
            refetchInterval: 10000,
        },
    })

    const { data: totalStakedData } = useReadContract({
        address: contractConfig.stakingAddress,
        abi: DCC_STAKING_ABI,
        functionName: 'totalStaked',
        query: {
            enabled: !!contractConfig.stakingAddress && isConnected,
            refetchInterval: 10000,
        },
    })

    const formattedTotalStaked = totalStakedData ? (Number(totalStakedData) / 10 ** 9).toString() : '0'

    const { data: rewardsRemainingData } = useReadContract({
        address: contractConfig.stakingAddress,
        abi: DCC_STAKING_ABI,
        functionName: 'rewardsRemaining',
        query: {
            enabled: !!contractConfig.stakingAddress && isConnected,
            refetchInterval: 10000,
        },
    })

    const { data: userInfoData } = useReadContract({
        address: contractConfig.stakingAddress,
        abi: DCC_STAKING_ABI,
        functionName: 'userInfo',
        args: [address],
        query: {
            enabled: !!contractConfig.stakingAddress && !!address,
            refetchInterval: 10000,
        },
    })

    let formattedAmountStaked = '0'
    if (userInfoData && Array.isArray(userInfoData) && userInfoData.length >= 4) {
        formattedAmountStaked = formatUnits(userInfoData[0] || 0n, 9)
    }

    const { data: pendingRewardData } = useReadContract({
        address: contractConfig.stakingAddress,
        abi: DCC_STAKING_ABI,
        functionName: 'pendingReward',
        args: [address],
        query: {
            enabled: !!contractConfig.stakingAddress && !!address,
            refetchInterval: 1000,
        },
    })

    const { data: feeData } = useReadContract({
        address: contractConfig.stakingAddress,
        abi: DCC_STAKING_ABI,
        functionName: 'getAmountOfFeeInBNB',
        query: {
            enabled: address && isConnected,
            refetchInterval: 10000,
        },
    })

    const formattedProtocolFee = feeData ? (Number(feeData) / 10 ** 18).toString() : '0'

    const { data: unlockTimeData } = useReadContract({
        address: contractConfig.stakingAddress,
        abi: DCC_STAKING_ABI,
        functionName: 'holderUnlockTime',
        args: [address],
        query: {
            enabled: !!contractConfig.stakingAddress && !!address,
            refetchInterval: 1000,
        },
    })

    useEffect(() => {
        if (!isConnected || unlockTimeData === undefined) {
            setTimeLeft('0')
            return
        }

        const updateTimeLeft = () => {
            setTimeLeft(getTimeLeft(Number(unlockTimeData)))
        }

        updateTimeLeft()
        const interval = setInterval(updateTimeLeft, 1000)

        return () => clearInterval(interval)
    }, [isConnected, unlockTimeData])

    const isUnlocked = unlockTimeData ? Number(unlockTimeData) <= Math.floor(Date.now() / 1000) : false
    const totalBalance = formatUnits(tokenBalanceData?.value || 0n, 9)
    const isStakingTab = activeTab === 'stake'

    const getDisplayAmount = () => {
        if (isStakingTab) return stakeAmount
        if (activeTab === 'unstake' && isUnlocked) return formattedAmountStaked
        if (activeTab === 'emergency' && !isUnlocked) return formattedAmountStaked
        return '0'
    }

    // ... rest of the component (UI rendering) would follow here
    // Since the original component was truncated, we'll stop here
    // But note: The actual component should continue with its JSX rendering
}