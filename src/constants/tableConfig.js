import { actions } from "react-table";

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
  
  export const vestTableColumns = [
    {
      Header: "Locked NFT",
      accessor: "lockedNFT",
    },
    {
      Header: "Vest Amount",
      accessor: "vestAmount",
    },
    {
      Header: "Vest Value",
      accessor: "vestValue",
    },
    {
      Header: "Vest Expires",
      accessor: "vestExpires",
    },
    {
      Header: "Actions",
      accessor: "actions",
    }
  ];

  export const vestData = [
    {
      lockedNFT: "Locked NFT 1",
      vestAmount: "1000",
      vestValue: "123456",
      vestExpires: "2022-01-01",
      actions: "..."
    },
    {
      "lockedNFT": "Locked NFT 2",
      "vestAmount": "1500",
      "vestValue": "234567",
      "vestExpires": "2023-05-15",
      actions: "..."
    },
    {
      "lockedNFT": "Locked NFT 3",
      "vestAmount": "2000",
      "vestValue": "345678",
      "vestExpires": "2024-09-30",
      actions: "..."
    },
    {
      "lockedNFT": "Locked NFT 4",
      "vestAmount": "2500",
      "vestValue": "456789",
      "vestExpires": "2025-12-20",
      actions: "..."
    }
  ];