// tableConfig.js
export const tableColumns = [
    {
      Header: "Pool",
      accessor: "pool",
    },
    {
      Header: "Wallet",
      accessor: "wallet",
    },
    {
      Header: "APR",
      accessor: "apr",
    },
    {
      Header: "TVL",
      accessor: "tvl",
    },
    {
      Header: "My Pool Amount",
      accessor: "myPoolAmount",
    },
    {
      Header: "My Stake Amount",
      accessor: "myStakeAmount",
    },
  ];
  
  export const sampleData = [
    {
      pool: "Pool 1",
      wallet: "0x1234...abcd",
      apr: "12%",
      tvl: "$1,000,000",
      myPoolAmount: "100",
      myStakeAmount: "50",
    },
    {
      pool: "Pool 2",
      wallet: "0x5678...efgh",
      apr: "8%",
      tvl: "$500,000",
      myPoolAmount: "200",
      myStakeAmount: "75",
    },
    {
      pool: "Pool 3",
      wallet: "0x9101...ijkl",
      apr: "15%",
      tvl: "$2,000,000",
      myPoolAmount: "300",
      myStakeAmount: "150",
    },
  ];
  