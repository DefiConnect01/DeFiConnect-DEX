import React, { useState } from "react";
import { useTable } from "react-table";
import { voteTableColumns, voteData } from "../../constants/tableConfig";
import { FiPlusSquare } from "react-icons/fi";
import NavigateButton from "../shared/NavigateButton";
import LoanCard from "./LoanCard";

const LoanTable = () => {
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns: voteTableColumns, data: voteData });

  return (
    <div className="m-5 overflow-x-auto min-h-[400px]">
      <div className="flex justify-start mb-8 mt-2">
        <NavigateButton text="Create Loan" link="/loan" icon={<FiPlusSquare />} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
        <LoanCard/>
        <LoanCard/>
        <LoanCard/>
        <LoanCard/>
      </div>

    </div>
  );
};

export default LoanTable;
