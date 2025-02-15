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
      cell: ({ row }) => {
        return (
          <div className='relative flex justify-center item-center'>
            <p className="font-bold text-sm">...</p>
          </div>
        );
      }
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


  export const voteTableColumns = [
    {
      Header: "Asset",
      accessor: "asset",
      cell: ({ row }) => {
        return (
          <div>
            <div className='relative aspect-square flex item-center'>
              <img
                src={row.getValue('fromPhotoUrl')}
                alt={row.getValue('fromName')}
                fill
                className='rounded-full w-5 h-5 border border-primary'
              />
              <img
                src={row.getValue('toPhotoUrl')}
                alt={row.getValue('toName')}
                fill
                className='rounded-full w-5 h-5 border border-primary -ml-3'
              />
            </div>

            <div className="flex flex-col gap-1 ml-4">
              <p className="font-bold text-sm">{row.getValue('fromName')} / {row.getValue('toName')}</p>
              <p className="font-bold text-xs">{row.getValue('poolType')}</p>
            </div>
          </div>
          
        );
      }
    },
    {
      Header: "TVL",
      accessor: "tvl",
    },
    {
      Header: "APR %",
      accessor: "apr",
      cell: ({ row }) => {
        return (
          <div>
            <div className='relative gap-1 flex flex-col item-center'>
              <p className="font-bold text-sm">{row.getValue('currentAPR')}</p>
              <p className="font-bold text-xs">{row.getValue('ExpectedAPR')}</p>
            </div>

            <div className="flex gap-1 flex-col ml-2">
              <p className="font-bold text-sm">{row.getValue('Current')}</p>
              <p className="font-bold text-xs">{row.getValue('Expected')}</p>
            </div>
          </div>
          
        );
      }
    },
    {
      Header: "My Stake",
      accessor: "myStake",
      cell: ({ row }) => {
        return (
          <div>
            <div className='relative gap-1 flex flex-col item-center'>
              <p className="font-bold text-sm">{row.getValue('fromStake')}</p>
              <p className="font-bold text-xs">{row.getValue('toStake')}</p>
            </div>

            <div className="flex gap-1 flex-col ml-2">
              <p className="font-bold text-sm">{row.getValue('fromName')}</p>
              <p className="font-bold text-xs">{row.getValue('toName')}</p>
            </div>
          </div>
          
        );
      }
    },
    {
      Header: "Total Liquidity",
      accessor: "totalLiquidity",
      cell: ({ row }) => {
        return (
          <div>
            <div className='relative gap-1 flex flex-col item-center'>
              <p className="font-bold text-sm">{row.getValue('fromLiquidity')}</p>
              <p className="font-bold text-xs">{row.getValue('toLiquidity')}</p>
            </div>

            <div className="flex gap-1 flex-col ml-2">
              <p className="font-bold text-sm">{row.getValue('fromName')}</p>
              <p className="font-bold text-xs">{row.getValue('toName')}</p>
            </div>
          </div>
          
        );
      }
    },
    {
      Header: "Total Votes",
      accessor: "totalVotes",
      cell: ({ row }) => {
        return (
          <div>
            <div className='relative gap-1 flex flex-col item-center'>
              <p className="font-bold text-sm">{row.getValue('fromVotesPercentage')}</p>
              <p className="font-bold text-xs">{row.getValue('toVotesPercentage')}</p>
            </div>
            
          </div>
          
        );
      }
    },
    {
      Header: "Bribes",
      accessor: "bribes",
      cell: ({ row }) => {
        return (
          <div>
            <div className='relative gap-1 flex flex-col item-center'>
              <p className="font-bold text-sm">{row.getValue('fromBribe')}</p>
              <p className="font-bold text-xs">{row.getValue('toBribe')}</p>
            </div>

            <div className="flex gap-1 flex-col ml-2">
              <p className="font-bold text-sm">{row.getValue('fromName')}</p>
              <p className="font-bold text-xs">{row.getValue('toName')}</p>
            </div>
          </div>
          
        );
      }
    },
    {
      Header: "My Votes",
      accessor: "myVotes",
      cell: ({ row }) => {
        return (
          <div>
            <div className='relative gap-1 flex flex-col item-center'>
              <p className="font-bold text-sm">{row.getValue('fromMyVotes')}</p>
              <p className="font-bold text-xs">{row.getValue('toMyVotes')}</p>
            </div>
          </div>
        );
      }
    },
    {
      Header: "My Vote",
      accessor: "myVote",
      cell: ({ row }) => {
        return (
          <div>
            <div className='relative gap-1 flex flex-col item-center'>
              <p className="font-bold text-sm">{row.getValue('fromMyVote')}</p>
              <p className="font-bold text-xs">{row.getValue('toMyVote')}</p>
            </div>
          </div>
        );
      }
    }
  ];


export const voteData = [
    {
      "asset": "ETH/USDC",
      "fromPhotoUrl": "https://i.ibb.co/rGJ8WyX/eth-logo.png",
      "toPhotoUrl": "https://coin-images.coingecko.com/coins/images/6319/large/usdc.png?1696506694",
      "fromName": "Ethereum",
      "toName": "USD Coin",
      "poolType": "Stable Pool",
      "tvl": "1,200,000",
      "apr": "5.2",
      "currentAPR": "5.2%",
      "ExpectedAPR": "6.0%",
      "Current": "5.2%",
      "Expected": "6.0%",
      "myStake": "5000",
      "fromStake": "3000",
      "toStake": "2000",
      "totalLiquidity": "10,000,000",
      "fromLiquidity": "5,000,000",
      "toLiquidity": "5,000,000",
      "totalVotes": "7500",
      "fromVotesPercentage": "60%",
      "toVotesPercentage": "40%",
      "bribes": "2000",
      "fromBribe": "1200",
      "toBribe": "800",
      "myVotes": "100",
      "fromMyVotes": "60",
      "toMyVotes": "40",
      "myVote": "ETH",
      "fromMyVote": "ETH",
      "toMyVote": "USDC"
    },
    {
      "asset": "BTC/DAI",
      "fromPhotoUrl": "https://i.ibb.co/CP9393X/BTC.png",
      "toPhotoUrl": "https://i.ibb.co/vQTj584/dai.jpg",
      "fromName": "Bitcoin",
      "toName": "DAI",
      "poolType": "Volatile Pool",
      "tvl": "3,500,000",
      "apr": "7.8",
      "currentAPR": "7.8%",
      "ExpectedAPR": "8.5%",
      "Current": "7.8%",
      "Expected": "8.5%",
      "myStake": "8000",
      "fromStake": "5000",
      "toStake": "3000",
      "totalLiquidity": "20,000,000",
      "fromLiquidity": "12,000,000",
      "toLiquidity": "8,000,000",
      "totalVotes": "9500",
      "fromVotesPercentage": "55%",
      "toVotesPercentage": "45%",
      "bribes": "3000",
      "fromBribe": "1800",
      "toBribe": "1200",
      "myVotes": "150",
      "fromMyVotes": "80",
      "toMyVotes": "70",
      "myVote": "BTC",
      "fromMyVote": "BTC",
      "toMyVote": "DAI"
    },
    {
      "asset": "MATIC/USDT",
      "fromPhotoUrl": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
      "toPhotoUrl": "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
      "fromName": "Polygon",
      "toName": "Tether",
      "poolType": "Stable Pool",
      "tvl": "800,000",
      "apr": "4.5",
      "currentAPR": "4.5%",
      "ExpectedAPR": "5.0%",
      "Current": "4.5%",
      "Expected": "5.0%",
      "myStake": "4000",
      "fromStake": "2500",
      "toStake": "1500",
      "totalLiquidity": "6,000,000",
      "fromLiquidity": "3,000,000",
      "toLiquidity": "3,000,000",
      "totalVotes": "6700",
      "fromVotesPercentage": "52%",
      "toVotesPercentage": "48%",
      "bribes": "1500",
      "fromBribe": "900",
      "toBribe": "600",
      "myVotes": "90",
      "fromMyVotes": "50",
      "toMyVotes": "40",
      "myVote": "MATIC",
      "fromMyVote": "MATIC",
      "toMyVote": "USDT"
    }
  ]
  