import { RxHamburgerMenu, RxCross1 } from "react-icons/rx";

const MenuToggle = ({ toggleSidebar, isSidebarOpen }) =>
  isSidebarOpen ? (
    <RxCross1
      className="md:hidden"
      onClick={toggleSidebar}
      style={{ width: "30px", height: "30px" }}
    />
  ) : (
    <RxHamburgerMenu
      className="block md:hidden w-[40px]"
      style={{ width: "30px", height: "30px" }}
      onClick={toggleSidebar}
    />
  );

export default MenuToggle;
