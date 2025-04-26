import React, { useContext, useMemo } from "react";
import { useTable } from "react-table";
import { domainTableColumns, domainTableData } from "../../constants/tableConfig";
import DomainSearch from "./DomainSearch";
import { ZNSContext } from "../../context/znsContext";
import { useEffect } from "react";
import { useAppKitAccount } from "@reown/appkit/react";

const DomainTable = () => {
  const { address } = useAppKitAccount();
    const {
       domains, 
       isLoading
    } = useContext(ZNSContext);

    const data = useMemo(() => {
        return domains !== undefined ? domains.map((domain) => {
            return {  
                address: address || "",
                network: "Creator",
                domainName: domain
            }
        }) : []
    }
    , [domains]);
    
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns: domainTableColumns, data: data });

  return (
    <div className="m-5 overflow -x-auto min-h-[400px]">
        <div className="w-full flex justify-center items-center my-4">
            <DomainSearch/>
        </div>
        
      <table
        {...getTableProps()}
        className="w-full border-collapse table-auto text-left overflow-auto  "
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} className="glassmorphic-black dark:glassmorphic">
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps()}
                  className="border-b border-white/30 text-xs px-4 py-3 whitespace-nowrap text-white dark:text-white"
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          <tr className="h-3 bg-transparent border-none">
            <td colSpan={headerGroups[0]?.headers?.length || 1} className="border-0 p-0"></td>
          </tr>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                className="first:mt-4 hover:bg-black/70 dark:hover:bg-darkModeGray glassmorphic-black dark:glassmorphic"
              >
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    className="px-4 py-3 whitespace-nowrap text-sm border-b border-white/20 text-white dark:text-white"
                  >
                    {cell.render("Cell")}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DomainTable;
