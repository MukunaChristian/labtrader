import { useLocation, useNavigate } from 'react-router-dom';
import { LanguageDropdown } from '../components/dropdowns/languageDropdown';
import { CurrencyDropdown } from '../components/dropdowns/currencyDropdown';
import { useApp } from "../hooks/useApp";
import { useSelector } from "react-redux";
import { validateToken } from "../api/login";
import { useEffect } from 'react';
import { default as Logo } from '../assets/teomim-logo.svg';
import { MenuSideBar } from '../components/MenuSideBar/MenuSideBar';
import { useDispatch } from 'react-redux';
import { setUserState, setUserDetailsState } from '../reducers/UserSlice';
import { loadCart } from '../reducers/UserSlice';
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
    dispatch(loadCart())

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
        <div className='w-full z-30 h-16 bg-black flex items-center justify-end px-5 fixed border-solid border-0 border-b-[1px]'>
          <div className='h-24 flex justify-start items-center'>
            <MenuSideBar setLoggedIn={setLoggedIn} />
          </div>

          <div className='flex absolute left-[50%] -translate-x-1/2 cursor-pointer' onClick={() => navigate("/")}>
            <div className="rounded-full bg-black">
                <img className='h-8 m-2 bg-black' src={Logo} />
            </div>
            <p className="font-bold text-lg pl-2 flex items-center text-white">Teomim</p>
          </div>


          <div className='h-24 flex justify-start ml-auto'>
            <div className='h-full flex items-center ml-auto mr-6'>
              <CurrencyDropdown />
              <div className='relative h-10 w-10 flex items-center justify-center ml-4 border-solid border-[2px] border-white rounded-full hover:bg-grey cursor-pointer' onClick={() => navigate("/cart")}>
                <ShoppingCartIcon className='h-6 w-6 text-white' />
                {diamonds_in_cart.length > 0 && 
                  <span className='absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full flex items-center justify-center w-5 h-5'>
                    {diamonds_in_cart.length}
                  </span>
                }
              </div>
            </div>
          </div>
        </div>
      }
      {/* <div className='h-full' style={{ backgroundColor: 'rgb(220 220 220)' }}> */}
      <div className='h-full bg-light-grey'>
        {children}
      </div>
      
    </div> :
    <div></div>
  )
}

