function PercentageButton({ setSlippage, percentage, formattedBalance, setAmount }) {
    return (
      <button
        onClick={() => {
          const calculatedPercentage = percentage === "MAX" ? 100 : percentage;
          setSlippage(calculatedPercentage);

          const amount = percentage === "MAX"
            ? formattedBalance
            : (formattedBalance * percentage) / 100;
          setAmount(parseFloat(amount).toFixed(2));  // Set the calculated amount
        }}
        className="text-black dark:text-white button_border border-2 px-2  rounded-full text-xs"
      >
        {percentage}
        {percentage === "MAX" ? "" : "%"}
      </button>
    );
  }


export default PercentageButton;