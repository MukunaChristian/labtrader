import { XMarkIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { Bars3Icon } from "@heroicons/react/20/solid";
import Logo from '/assets/teomim-logo.png';
import { HomeIcon } from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/outline";
import { BuildingOffice2Icon } from "@heroicons/react/24/outline";
import { BookOpenIcon } from "@heroicons/react/24/outline";
import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { UserIcon } from '@heroicons/react/24/outline';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from "react-redux";


export const MenuSideBar = ({ setLoggedIn }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector(state => state.user.user);


  const handleToggle = (event) => {


    if (event.type === "keydown" && open && (event.key === "Tab" || event.keyCode === 27 || event.key === "Shift")) {
      setOpen(false);
    }
  }
  document.addEventListener('keydown', handleToggle)

  const onLogout = () => {
    localStorage.removeItem("jwt");
    setLoggedIn(false);
    navigate("/login");
  }


  return (
    <div>
      <div onClick={() => setOpen(true)} className='flex items-center hover:bg-grey h-11 w-11 p-2 rounded-sm cursor-pointer'>
        <Bars3Icon className='h-8 w-8 text-white' />
      </div>
      <div onClick={() => { setOpen(false) }} className={`fixed h-full top-0 left-0 w-full z-40 bg-dark-grey/40 duration-500 cursor-pointer ${open ? "block" : "hidden"}`}></div>
      <div className={`flex flex-col fixed h-[100%] w-[50vh] bg-black overflow-auto z-50 px-4 shadow-2xl duration-300 top-0 ${open ? "left-0" : "left-[-100%]"}`}>
        <div className="py-4">
          <div className="flex">
            <div className="flex items-center justify-center rounded-full w-20 h-20 bg-black">
              <img src="/assets/teomim-logo.png" className='h-12' />
            </div>
            <div className="flex justify-center flex-col w-[70%] mx-4 pt-2">
              <p className="text-white text-sm truncate text-ellipsis">{user.email ? user.email : 'N/A'}</p>
              <p className="text-white text-xs">{user.role ? user.role : 'N/A'}</p>
            </div>

          </div>

          <div className="container flex flex-col mt-6">
            <div onClick={() => { navigate("/profile") }} className={`flex py-2 rounded-md cursor-pointer group ${location.pathname === "/profile" ? 'bg-white' : 'hover:bg-white'}`}>
              <UserIcon className={`h-6 w-6 mx-4 ${location.pathname === "/profile" ? '' : 'text-white group-hover:text-black'}`} />
              <p className={`pt-[1px] ${location.pathname === "/profile" ? '' : 'text-white group-hover:text-black'}`}>Profile</p>
            </div>

            <div onClick={() => { navigate("/") }} className={`flex py-2 mt-4 rounded-md cursor-pointer group ${location.pathname === "/" ? 'bg-white' : 'hover:bg-white'}`}>
              <HomeIcon className={`h-6 w-6 mx-4 ${location.pathname === "/" ? '' : 'text-white group-hover:text-black'}`} />
              <p className={`pt-[1px] ${location.pathname === "/" ? '' : 'text-white group-hover:text-black'}`}>Home</p>
            </div>

            {user.role !== "Buyer" && (
              <div onClick={() => { navigate("/company") }} className={`flex py-2 mt-4 rounded-md cursor-pointer group ${location.pathname === "/company" ? 'bg-white' : 'hover:bg-white'}`}>
                <BuildingOffice2Icon className={`h-6 w-6 mx-4 ${location.pathname === "/company" ? '' : 'text-white group-hover:text-black'}`} />
                <p className={`pt-[1px] ${location.pathname === "/company" ? '' : 'text-white group-hover:text-black'}`}>Companies</p>
              </div>
            )}

            <div onClick={() => { navigate("/reports") }} className={`flex py-2 mt-4 rounded-md cursor-pointer group ${location.pathname === "/reports" ? 'bg-white' : 'hover:bg-white'}`}>
              <BookOpenIcon className={`h-6 w-6 mx-4 ${location.pathname === "/reports" ? '' : 'text-white group-hover:text-black'}`} />
              <p className={`pt-[1px] ${location.pathname === "/reports" ? '' : 'text-white group-hover:text-black'}`}>Reports</p>
            </div>

            <div onClick={() => { navigate("/orders") }} className={`flex py-2 mt-4 rounded-md cursor-pointer group ${location.pathname === "/orders" ? 'bg-white' : 'hover:bg-white'}`}>
              <StarIcon className={`h-6 w-6 mx-4 ${location.pathname === "/orders" ? '' : 'text-white group-hover:text-black'}`} />
              <p className={`pt-[1px] ${location.pathname === "/orders" ? '' : 'text-white group-hover:text-black'}`}>Orders</p>
            </div>

            <div className={`fixed bottom-0 left-0 mx-4 mb-4 w-36 duration-300 ${open ? "left-0" : "left-[-100%]"}`}>
              <div onClick={() => onLogout()} className="flex flex-row hover:bg-white py-2 rounded-md cursor-pointer group">
                <ArrowLeftOnRectangleIcon className="h-6 w-6 text-white mx-4 group-hover:text-black" />
                <p className="text-white pt-[1px] group-hover:text-black">Logout</p>
              </div>
            </div>

          </div>


        </div>
      </div>
    </div>
  );
}