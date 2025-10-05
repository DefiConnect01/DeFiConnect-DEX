import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Logo from '../../assets/logo.png';

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    amount,
    fee,
    type,
    duration,
    reward
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const formValues = {
        amount: amount,
        fee: fee.toString(),
    };

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                setIsVisible(true);
            }, 10);
        } else {
            setIsVisible(false);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    const handleSubmit = () => {
        onConfirm();
        handleClose();
    };

    const Token = {
        symbol: 'DCC',
        amount: formValues.amount,
        icon: (
            <div className='flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 dark:bg-primary/30'>
                <img src={Logo} alt='DCC' className='h-6 w-6' />
            </div>
        ),
    };

    if (!isOpen) return null;

    const getDisplayAmount = () => {
        const baseAmount = parseFloat(formValues.amount);
        if (type === 'unstake') return (baseAmount + Number(reward)).toFixed(6);
        if (type === 'emergency') return (baseAmount * 0.9).toFixed(6);
        return baseAmount.toFixed(6);
    };

    return (
        <div
            className='fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4'
            role='dialog'
            aria-modal='true'
        >
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-raisin/80 transition-opacity duration-300 dark:bg-black/80 ${isVisible ? 'opacity-100' : 'opacity-0'
                    }`}
                onClick={handleClose}
            />

            {/* Modal */}
            <div
                className={`relative w-full max-w-md transform rounded-t-3xl border border-gray-200 bg-milky shadow-2xl transition-all duration-300 ease-out dark:border-gray-700 dark:bg-raisin sm:rounded-3xl ${isVisible
                    ? 'translate-y-0 scale-100 opacity-100'
                    : 'translate-y-full opacity-0 sm:translate-y-8 sm:scale-95'
                    }`}
            >
                {/* Header */}
                <div className='flex items-center justify-between border-b border-gray-200 p-6 pb-4 dark:border-gray-700'>
                    <h2 className='text-xl font-semibold text-raisin dark:text-milky'>
                        Confirm {type === 'stake' ? 'Stake' : type === 'unstake' ? 'Unstake' : 'Emergency Unstake'}
                    </h2>
                    <button
                        type='button'
                        onClick={handleClose}
                        className='rounded-full p-1 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                        aria-label='Close modal'
                    >
                        <X className='h-6 w-6 text-gray-500 dark:text-gray-400' />
                    </button>
                </div>

                {/* Stake Details */}
                <div className='px-6 pb-6'>
                    {/* Token Amount */}
                    <div className='mb-8 mt-4 flex items-center justify-between'>
                        <div className='text-raisin dark:text-milky'>
                            <div className='text-2xl font-semibold'>
                                {getDisplayAmount()}
                            </div>
                            <div className='mt-1 text-sm text-gray-600 dark:text-gray-400'>
                                Amount to {type ? type.charAt(0).toUpperCase() + type.slice(1) : ''}
                            </div>
                        </div>
                        <div className='flex items-center gap-3'>
                            <span className='text-lg font-medium text-raisin dark:text-milky'>{Token.symbol}</span>
                            {Token.icon}
                        </div>
                    </div>

                    {/* Transaction Details */}
                    <div className='mb-6 space-y-4 rounded-2xl border border-gray-200 bg-gray-100 p-4 dark:border-gray-700 dark:bg-choco'>
                        <div className='flex items-center justify-between'>
                            <span className='text-sm font-medium text-gray-600 dark:text-gray-400'>Duration</span>
                            <span className='text-sm font-semibold text-orange'>{duration?.label || ''}</span>
                        </div>

                        <div className='flex items-center justify-between'>
                            <span className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                                You will {type === 'stake' ? 'stake' : 'receive'}
                            </span>
                            <span className='text-sm font-semibold text-raisin dark:text-milky'>
                                {getDisplayAmount()} TACC
                            </span>
                        </div>

                        <div className='flex items-center justify-between'>
                            <span className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                                {type === 'emergency' ? 'Penalty Fee' : 'Transaction Fee'}
                            </span>
                            <span className='text-sm font-semibold text-raisin dark:text-milky'>
                                {type === 'emergency'
                                    ? `${(parseFloat(formValues.amount) * 0.1).toFixed(6)} TACC`
                                    : `~${formValues.fee} BNB`}
                            </span>
                        </div>
                    </div>

                    {/* Confirm Button */}
                    <button
                        onClick={handleSubmit}
                        className='w-full transform rounded-2xl bg-gradient-to-r from-primary to-orange py-4 font-semibold text-raisin shadow-lg transition-all duration-200 hover:scale-[1.02] hover:from-orange hover:to-primary hover:shadow-primary/25 active:scale-[0.98] disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500 disabled:text-gray-600 dark:hover:shadow-primary/20'
                    >
                        Confirm {type === 'stake' ? 'Stake' : type === 'unstake' ? 'Unstake' : 'Emergency Unstake'}
                    </button>

                    {/* Additional Info */}
                    <div className='mt-4 text-center'>
                        <p className='text-xs text-gray-500 dark:text-gray-400'>
                            By confirming, you agree to {type || 'perform this action'} your
                            TACC tokens. This action cannot be undone immediately.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;