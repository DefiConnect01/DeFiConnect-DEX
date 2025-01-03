import { IoSearchOutline } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";

export default function AddCustomToken({
  setAddCustomToken,
  addCustomToken,
  setSelectTokenModal,
}) {
  if (addCustomToken) {
    return (
      <div
        className="absolute w-full h-full inset-0 z-20"
        // onClick={() => setAddCustomToken(false)}
      >
        <div className="absolute w-full h-full  bg-[hsla(0,0%,0%,0.7)] top-0 z-5">
          <div className=" sm:p-8 p-4 rounded-2xl  w-[500px]  max-w-[90vw] z-15 absolute left-[50%] top-[50%] transform translate-x-[-50%] translate-y-[-50%]   bg-lightBackground dark:bg-darkBackground text-lightText dark:text-darkText">
            <h2 className="text-lg font-bold mb-2">Add Custom Token</h2>{" "}
            {/* <div className="w-full h-[100px] bg-[#eef4fd]"></div> */}
            <div className="sm:mt-8 mt-4 flex flex-col sm:gap-6 gap-3 text-left">
              <div>
                <p>Token Contract Address</p>{" "}
                <input
                  className="w-full bg-inherit border-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-lg sm:p-2 p-1"
                  type="text"
                  placeholder="OxAbC ..."
                  autoFocus
                />{" "}
              </div>
              <div>
                <p>Token Symbol</p>{" "}
                <input
                  className="w-full bg-inherit border-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-lg sm:p-2 p-1"
                  type="text"
                  placeholder="Eth"
                />{" "}
              </div>
              <div>
                <p>Decimals of Precision</p>
                <input
                  className="w-full bg-inherit border-2 border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-lg sm:p-2 p-1"
                  type="number"
                  placeholder="0"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-8 justify-between">
              {" "}
              <button
                className="bg-[hsl(216,79%,96%)] text-[hsl(216,21%,51%)] hover:bg-[hsl(216,79%,89%)] sm:px-12 px-8 sm:py-2  py-1 rounded-lg sm:text-lg text-base font-semibold "
                onClick={() => {
                  setSelectTokenModal(true);
                  setAddCustomToken(false);
                }}
              >
                Back
              </button>
              <button className="bg-[hsl(212,99%,56%)] hover:bg-[hsl(212,99%,46%)] text-darkText sm:px-12 px-8 sm:py-2  py-1  rounded-lg sm:text-lg text-base font-semibold">
                Add Token
              </button>
            </div>
            <RxCross1
              onClick={() => setAddCustomToken(false)}
              className="hidden sm:block absolute top-[-40px] right-[-40px] text-white h-10 w-10 cursor-pointer hover:bg-[hsla(213,20%,65%,0.1)] rounded-lg p-2"
            />
          </div>
        </div>
      </div>
    );
  } else {
    return null;
  }
}
