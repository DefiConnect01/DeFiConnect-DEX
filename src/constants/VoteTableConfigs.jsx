import Image from 'next/image';


export const voteTableColumns = [
    {
      Header: "Asset",
      accessor: "asset",
      cell: ({ row }) => {
        return (
          <div>
            <div className='relative aspect-square flex item-center'>
              <Image
                src={row.getValue('fromPhotoUrl')}
                alt={row.getValue('fromName')}
                fill
                className='rounded-full w-5 h-5 border border-primary'
              />
              <Image
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