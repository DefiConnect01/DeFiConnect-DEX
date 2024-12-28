import React, { useState } from "react";
import { useTable } from "react-table";
import { tableColumns, sampleData } from "../constants/tableConfig";
import { Link } from "react-router-dom";
import { FiPlusSquare } from "react-icons/fi";

const PoolTable = () => {
  const [addLiquidity, setLiquidity] = useState(false);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns: tableColumns, data: sampleData });

  return (
    <div className="m-5 overflow-x-auto min-h-[400px]">
      <div className="flex justify-start mb-8 mt-2">
        <Link to="/liquidity" className="flex items-center bg-headerBg border border-secondary pr-2 ">
          <span className="bg-secondary text-white py-3 px-2 mr-2 text-xl "><FiPlusSquare /></span>
          <span className="font-bold py-2 px-3">Add Liquidity</span>
        </Link>
      </div>

      <table
        {...getTableProps()}
        className="w-full border-collapse table-auto text-left overflow-auto"
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()} className="bg-headerBg ">
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps()}
                  className="border border-secondary px-4 py-2 whitespace-nowrap"
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                className="odd:bg-headerBg even:bg-headerBg"
              >
                {row.cells.map((cell) => (
                  <td
                    {...cell.getCellProps()}
                    className="border border-secondary px-4 py-3 whitespace-nowrap"
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

export default PoolTable;
