import { FaCalendarDay } from "react-icons/fa";
import moment from "moment";

const StakeDate = ({
  stakeTime
}) => {

  return (
    <div>

      <div className="p-4 flex flex-col bg-lightModeGray dark:bg-darkModeGray rounded-2xl">
        <div className="flex items-center justify-between mb-2">
          <div
            className="flex items-center cursor-pointer"
          >
            <div className="p-3 border-2 border-primary dark:border-white rounded-full">
                <FaCalendarDay className="text-3xl text-primary dark:text-white"/>
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-semibold text-primary dark:text-textGray">
                {moment().add(stakeTime, 'days').format("DD-MM-YYYY")}
            </h1>
            <p className="font-bold ">Stake Duration Date</p>
          </div>
        </div>

        
      </div>

    </div>
  );
};

export default StakeDate;
