import { useEffect, useState } from "react";
import TableComponent from "../components/shared/Table";
import { createColumnHelper } from "@tanstack/react-table";
import { UseGetLeaderBoard } from "../hooks/getLeaderBoard";
import { io } from "socket.io-client";
import { toast } from 'react-toastify';
import { formatUnits } from "viem";

export default function LeaderBoard() {
  const { data, error, isError, isFetching, isLoading, refetch } = UseGetLeaderBoard();
  const [realTimeData, setRealTimeData] = useState([]);
  const columnHelper = createColumnHelper();
  const cyberApiKey = import.meta.env.VITE_CYBER_API_KEY;
  const socketIoLink = import.meta.env.VITE_SOCKET_IO_LINK



  useEffect(() => {
    const socket = io(socketIoLink, {
      extraHeaders: { 'cyber-api-key': cyberApiKey}
    })

    socket.on('newTransaction', (newTxData) => {
      setRealTimeData((prevData) => [newTxData, ...prevData]);

      // Show toast when new transaction is received
      toast.success('New transaction received!');
    });

    socket.on('connect_error', (err) => {
      console.error('Connection Error:', err);
    });
// console.log(realTimeData)
    return () => {
      socket.disconnect();
    };
  }, []);

  const getDecimals = (token) => {
    // Base Sepolia Chain ID is 84532
    // TODO
    console.log("GEtting token decimals 1")
    if (token === "CYBA (on Ethereum)" ) {
      // console.log(9)
      return 9;

    }else{
      // console.log(18)
      return 18; // Default to 18 decimals for other cases

    }
    
  };

  const combinedData = [...realTimeData, ...(data?.data || [])];

  const customColumns = [
    columnHelper.accessor("sender", {
      header: "Sender/Receiver",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("token", {
      header: () => <span className="text-nowrap">Token</span>,
      cell: (info) => <p className="text-nowrap">{info.getValue()}</p>,
    }),
    columnHelper.accessor("srcChainId", {
      header: () => <p className="text-nowrap">Source Chain ID</p>,
      cell: (info) => <span className="text-center ">{info.getValue()}</span>,
    }),
    columnHelper.accessor("dstChainId", {
      header: () => <p className="text-nowrap">Destination Chain ID</p>,
      cell: (info) => <span className="text-center ">{info.getValue()}</span>,
    }),
    columnHelper.accessor("amount", {
      header: () => <span>Amount</span>,
      cell: (info) =>{
        const decimals = getDecimals(info.row.original.token);
        const formattedAmount = formatUnits(info.getValue(), decimals);
        // Round to 4 decimal places for cleaner display
        return parseFloat(formattedAmount).toFixed(2);
      }
    }),
    columnHelper.accessor("hash", {
      header: () => <span>Hash</span>,
      cell: (info) => info.getValue(),
    }),
  ];

  if (isError) {
    return <div>Error loading data: {error.message}</div>;
  }

  return (
    <section>
      <TableComponent
        columns={customColumns}
        data={combinedData}
        isFetching={isFetching}
        isLoading={isLoading}
        refetch={refetch}
      />
    </section>
  );
}
