const TokenInput = ({
    // ... other props remain the same ...
}) => {
    // Helper function to format numbers with fewer decimals
    const formatNumber = (value, decimals = 4) => {
        const num = parseFloat(value);
        return num.toFixed(decimals);
    };

    // Format fee to a reasonable number of decimals
    const getFormattedFee = () => {
        if (!fee) return "0";
        const feeInEther = parseFloat(formatUnits(fee, 18));
        return formatNumber(feeInEther, 4); // Show 4 decimal places for fee
    };

    const handleAmountChange = (e) => {
        const inputValue = e.target.value;
        if (!inputValue) {
            setAmount("");
            return;
        }

        const parsedValue = parseFloat(inputValue);
        if (isNaN(parsedValue)) {
            return;
        }

        const isCybriaChain = chain === "Cybria Testnet";
        const isCYBA = selectedToken === "CYBA";
        const feeInEther = fee ? parseFloat(formatUnits(fee, 18)) : 0;

        // Calculate max amount considering the fee
        const maxAmount = isCybriaChain && isCYBA
            ? parseFloat(formattedFromBalance) - feeInEther
            : parseFloat(formattedFromBalance);

        // Ensure amount cannot exceed balance minus fee
        const validAmount = Math.max(0, Math.min(parsedValue, maxAmount));
        setAmount(formatNumber(validAmount, 4)); // Round to 4 decimal places
    };

    const getDisplayAmount = () => {
        if (!amount) return "0";

        const isCybriaChain = chain === "Cybria Testnet";
        const isCYBA = selectedToken === "CYBA";
        const feeInEther = fee ? parseFloat(formatUnits(fee, 18)) : 0;

        if (isReadOnly) {
            // For "To" field, show amount after fee deduction
            return formatNumber(amount, 4); // Round to 4 decimals
        } else {
            // For "From" field
            if (isCybriaChain && isCYBA && fee) {
                return formatNumber(parseFloat(amount) + feeInEther, 4); // Round total to 4 decimals
            }
            return formatNumber(amount, 4);
        }
    };

    // Rest of the component remains the same until the return...

    return (
        <div>
            {/* ... other JSX remains the same ... */}

            {!isReadOnly ? (
                <div className="text-left">
                    {/* ... input and percentage buttons remain the same ... */}

                    {chain === "Cybria Testnet" && selectedToken === "CYBA" && fee && (
                        <>
                            <div className="mt-4 text-gray-500">
                                <div className="flex justify-between items-center">
                                    <span>Network Fee:</span>
                                    <span>{getFormattedFee()} CYBA</span>
                                </div>
                                <div className="flex justify-between items-center mt-2 text-accent font-semibold">
                                    <span>Total to Pay:</span>
                                    <span>{getDisplayAmount()} CYBA</span>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            ) : (
                <div className="text-black dark:text-white">
                    <p className="font-normal sm:text-2xl bg-transparent outline-none">
                        {getDisplayAmount()} {selectedToken}
                    </p>
                    {chain === "Base Sepolia" && selectedToken === "CYBA" && (
                        <p className="text-sm text-gray-500 mt-1">
                            Amount you will receive
                        </p>
                    )}
                </div>
            )}

            <em className="mr-auto mt-2 text-sm">
                ${selectedToken === "USDT"
                    ? getDisplayAmount()
                    : (parseFloat(getDisplayAmount()) * cybaPrice).toFixed(2)}
            </em>
        </div>
    );
};