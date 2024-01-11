import { useLocation, useNavigate } from 'react-router-dom';
import { LanguageDropdown } from '../components/Dropdowns/LanguageDropdown';
import { CurrencyDropdown } from '../components/Dropdowns/CurrencyDropdown';
import { useApp } from "../hooks/useApp";
import { useSelector } from "react-redux";
import { validateToken } from "../api/login";
import { useEffect } from 'react';
import { default as Logo } from '../assets/teomim-logo.png';
import { MenuSideBar } from '../components/MenuSideBar/MenuSideBar';
import { useDispatch } from 'react-redux';
import { setUserState, setUserDetailsState } from '../reducers/UserSlice';
import { getUserData } from '../api/profileData';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { getSupplimentalData } from '../api/getSupplimentalData';


export const Layout = ({ children }) => {
  const location = useLocation();
  const { setLoggedIn } = useApp();
  const loggedIn = useSelector(state => state.app.loggedIn);
  const user_id = useSelector(state => state.user.user.id);
  const warehouses = useSelector(state => state.app.warehouses);
  const diamonds_in_cart = useSelector(state => state.user.diamonds_in_cart);
  console.log(diamonds_in_cart.length)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  let isLogin = location.pathname === '/login' || location.pathname === '/forgot-password' || location.pathname === '/reset-password';

  const checkToken = () => {
    console.log("checking")
    console.log(isLogin)
    setLoggedIn(false)

    const token = localStorage.getItem("jwt");  
    if (!token && !isLogin) {
      navigate("/login")
      return
    }


    if (!(location.pathname === '/forgot-password' || location.pathname === '/reset-password')) {
      console.log("validating")
      validateToken(token, navigate, setLoggedIn, setUserState, dispatch);
    }
  }

  useEffect(() => {
    checkToken()
  }, [])

  useEffect(() => {
    if (loggedIn) {
      console.log("STARTING LOOP")
      getSupplimentalData(dispatch);

      const interval = setInterval(() => {
        getSupplimentalData(dispatch);
      }, 900000); // 60000 ms = 1 minute

      // Clear the interval on component unmount
      return () => clearInterval(interval);
    }


    if (loggedIn && isLogin) {
      navigate("/")
      return
    }

    if (user_id) {
      getUserData(user_id, setUserDetailsState, dispatch)
    }
  }, [loggedIn])


  return (
    (loggedIn || isLogin) ?
    <div className='relative w-[100%] h-full '>
      {isLogin ? null : 
        <div className='w-full z-30 h-16 bg-white flex items-center justify-end px-5 fixed border-solid border-0 border-b-[1px]'>
          <div className='h-24 flex justify-start items-center'>
            <MenuSideBar setLoggedIn={setLoggedIn} />
          </div>

          <div className='flex absolute left-[50%] -translate-x-1/2'>
            <div className="rounded-full bg-black">
                <img className='h-8 m-2 bg-black' src={Logo} />
            </div>
            <p className="font-bold text-lg pl-2 flex items-center">Teomim</p>
          </div>


          <div className='h-24 flex justify-start ml-auto'>
            <div className='h-full flex items-center ml-auto mr-6'>
              <CurrencyDropdown />
              {/* <LanguageDropdown />  */}
              <div onClick={() => navigate("/cart")} className='relative h-10 w-10 flex items-center justify-center ml-4 border-solid border-[1px] border-black rounded-full hover:bg-grey cursor-pointer'>
                <ShoppingCartIcon className='relative h-5 w-5 text-black' />
                {/* {diamonds_in_cart.length > 0 && 
                  <p className='abolute bg-black rounded-full bottom-0 right-0 text-white text-xs w-4 h-4'>{diamonds_in_cart.length}</p>
                } */}
              </div>
            </div>
          </div>

        </div>
      }
      <div className='h-full bg-light-grey'>
        {children}
      </div>
      
    </div> :
    <div></div>
  )
}

