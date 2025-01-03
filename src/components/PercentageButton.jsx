function PercentageButton({ percentage, formattedFromBalance, setAmount }) {
    return (
      <button
        onClick={() => {
          const amount = percentage === "MAX"
            ? formattedFromBalance
            : (formattedFromBalance * percentage) / 100;
          setAmount(amount);  // Set the calculated amount
        }}
        className="text-black dark:text-white button_border border-2 px-2  rounded-full text-xs"
      >
        {percentage}
        {percentage === "MAX" ? "" : "%"}
      </button>
    );
  }


export default PercentageButton;