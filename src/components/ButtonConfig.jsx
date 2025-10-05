import { useAccount, useConnect, useWriteContract } from 'wagmi'
import { formatUnits } from 'viem'
import { DCC_STAKING_ABI, TOKEN_ABI } from '../constants/contracts'
// import { getSocket } from '../helper/socket'
import { toast } from 'react-toastify'
import { toastProps } from '../utils/common'
import ConfirmModal from './Modal/ConfirmModal'
import { useState } from 'react'

export default function ActionButton(props) {
    const {
        fee,
        amount,
        contractAddress,
        tokenAddress,
        isUnlocked,
        isStakingTab,
        amountStaked,
        totalBalance,
        duration,
        loading,
        activeTab,
        setLoading,
        pendingRewardData
    } = props;

    const { isConnected, address: connectedAddress, chain } = useAccount()
    const { connectAsync, connectors } = useConnect()
    const { writeContractAsync } = useWriteContract()
    // const socket = getSocket()
    const [isModalOpen, setIsModalOpen] = useState(false)

    async function stake(amount, contractAddress, tokenAddress, fee) {
        try {
            if (isUnlocked) {
                toast.info(
                    `Staking duration of ${duration.label} has ended. Unstake your tokens to stake again.`,
                    toastProps,
                )
            } else {
                await toast.promise(
                    Promise.resolve().then(async () => {
                        await writeContractAsync({
                            address: tokenAddress,
                            abi: TOKEN_ABI,
                            functionName: 'approve',
                            args: [contractAddress, BigInt(parseFloat(amount) * 1e9)],
                        })

                        const txHash = await writeContractAsync({
                            address: contractAddress,
                            abi: DCC_STAKING_ABI,
                            functionName: 'deposit',
                            value: fee,
                            args: [BigInt(parseFloat(amount) * 1e9)],
                        })

                        // socket.emit('stake', {
                        //     address: connectedAddress,
                        //     amount: amount,
                        //     token: 'DCC',
                        //     duration: duration.value,
                        //     network: chain?.name,
                        //     hash: txHash,
                        //     action: 'stake',
                        // })
                    }),
                    {
                        pending: {
                            render() {
                                return `Processing transaction...`
                            },
                            icon: () => (
                                <span role='img' aria-label='pending'>
                                    ⏳
                                </span>
                            ),
                        },
                        success: {
                            render() {
                                return `New transaction received! with ${amount} DCC`
                            },
                            icon: () => (
                                <span role='img' aria-label='success'>
                                    ✅
                                </span>
                            ),
                        },
                        error: {
                            render({ data }) {
                                return `Transaction failed: ${data?.shortMessage || 'Unknown error'}`
                            },
                            icon: () => (
                                <span role='img' aria-label='failed'>
                                    ❌
                                </span>
                            ),
                        },
                    },
                    toastProps,
                )
            }
        } catch (err) {
            console.error(err)
        }
    }

    async function unstake(amount, contractAddress, fee) {
        try {
            if (isUnlocked) {
                await toast.promise(
                    Promise.resolve().then(async () => {
                        const txHash = await writeContractAsync({
                            address: contractAddress,
                            abi: DCC_STAKING_ABI,
                            functionName: 'withdraw',
                            value: fee,
                            args: [BigInt(parseFloat(amount) * 1e9)],
                        })

                        // socket.emit('unstake', {
                        //     address: connectedAddress,
                        //     amount: amount,
                        //     token: 'DCC',
                        //     duration: duration.value,
                        //     network: chain?.name,
                        //     hash: txHash,
                        //     action: 'unstake',
                        // })
                    }),
                    {
                        pending: {
                            render() {
                                return `Unstaking tokens...`
                            },
                            icon: () => (
                                <span role='img' aria-label='pending'>
                                    ⏳
                                </span>
                            ),
                        },
                        success: {
                            render() {
                                return `Tokens unstaked successfully!`
                            },
                            icon: () => (
                                <span role='img' aria-label='success'>
                                    ✅
                                </span>
                            ),
                        },
                        error: {
                            render({ data }) {
                                return `Failed to unstake tokens: ${data?.shortMessage || 'Unknown error'}`
                            },
                            icon: () => (
                                <span role='img' aria-label='failed'>
                                    ❌
                                </span>
                            ),
                        },
                    },
                    toastProps,
                )
            } else {
                await toast.promise(
                    Promise.resolve().then(async () => {
                        await writeContractAsync({
                            address: contractAddress,
                            abi: DCC_STAKING_ABI,
                            functionName: 'emergencyWithdraw',
                        })
                    }),
                    {
                        pending: {
                            render() {
                                return `Emergency withdrawal in progress...`
                            },
                            icon: () => (
                                <span role='img' aria-label='pending'>
                                    🚨
                                </span>
                            ),
                        },
                        success: {
                            render() {
                                return `Emergency withdrawal successful!`
                            },
                            icon: () => (
                                <span role='img' aria-label='success'>
                                    ✅
                                </span>
                            ),
                        },
                        error: {
                            render({ data }) {
                                return `Emergency withdrawal failed: ${data?.shortMessage || 'Unknown error'}`
                            },
                            icon: () => (
                                <span role='img' aria-label='failed'>
                                    ❌
                                </span>
                            ),
                        },
                    },
                    toastProps,
                )
            }
        } catch (err) {
            console.error('❌ Unstake error:', err)
        }
    }

    const handleConnect = () => {
        (async () => {
            try {
                setLoading(true)
                if (isConnected && isStakingTab) {
                    await stake(amount, contractAddress, tokenAddress, fee)
                } else if (isConnected && !isStakingTab) {
                    await unstake(amountStaked, contractAddress, fee)
                } else {
                    await connectAsync({
                        connector: connectors[3]
                    })
                }
            } catch (error) {
                console.error('Failed to connect wallet:', error)
            } finally {
                setLoading(false)
            }
        })()
    }

    const isButtonDisabled = () => {
        if (!isConnected) return true
        if (isStakingTab && !amount) return true
        if (!isStakingTab && amountStaked === '0') return true
        if (activeTab === 'unstake' && !isUnlocked) return true
        if (activeTab === 'emergency' && isUnlocked) return true
        if ((isStakingTab && Number(amount) > Number(totalBalance)) || (isStakingTab && totalBalance === '0'))
            return true
        if (loading) return true
        return false
    }

    const buttonText = () => {
        if (isConnected) {
            return isStakingTab ? 'Stake' : 'Unstake'
        } else {
            return 'Connect Wallet'
        }
    }

    return (
        <>
            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConnect}
                amount={isStakingTab ? amount : amountStaked}
                fee={parseFloat(formatUnits(fee, 18)).toFixed(6)}
                type={activeTab}
                duration={duration}
                reward={pendingRewardData}
            />

            <button
                id='submit'
                className='h-14 w-full rounded-2xl bg-orange text-lg font-medium text-white hover:-translate-y-0.5 active:-translate-y-0.5 disabled:opacity-80 dark:text-white'
                disabled={isButtonDisabled()}
                onClick={() => setIsModalOpen(true)}
            >
                {buttonText()}
            </button>
        </>
    )
}