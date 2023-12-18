import { useLocation, useNavigate } from 'react-router-dom';
import { LanguageDropdown } from '../components/Dropdowns/LanguageDropdown';
import { CurrencyDropdown } from '../components/Dropdowns/CurrencyDropdown';
import { useApp } from "../hooks/useApp";
import { useSelector } from "react-redux";
import { validateToken } from "../api/login";
import { useEffect } from 'react';
import { default as Logo } from '../assets/1.svg';
import { MenuSideBar } from '../components/MenuSideBar/MenuSideBar';
import { useDispatch } from 'react-redux';
import { setUserState, setUserDetailsState } from '../reducers/UserSlice';
import { getUserData } from '../api/profileData';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';


export const Layout = ({ children }) => {
  const location = useLocation();
  const { setLoggedIn } = useApp();
  const loggedIn = useSelector(state => state.app.loggedIn);
  const user_id = useSelector(state => state.user.user.id);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  let isLogin = location.pathname === '/login' || location.pathname === '/forgot-password';

  const checkToken = () => {
    console.log("checking")
    console.log(isLogin)
    setLoggedIn(false)

    const token = localStorage.getItem("jwt");  
    if (!token && !isLogin) {
      navigate("/login")
      return
    }


    if (!(location.pathname === '/forgot-password')) {
      console.log("validating")
      validateToken(token, navigate, setLoggedIn, setUserState, dispatch);
    }
  }

  useEffect(() => {
    checkToken()
  }, [])

  useEffect(() => {
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
    <div className='w-[100%] h-full '>
      {isLogin ? null : 
        <div className='w-full z-30 h-16 bg-white flex relative items-center justify-end px-5 fixed'>
          <div className='h-24 flex justify-start items-center'>
            <MenuSideBar setLoggedIn={setLoggedIn} />
          </div>

          <div className='absolute left-[50%] -translate-x-1/2'>
            <img className='h-8' src={Logo} />
          </div>

          
          <div className='h-24 flex justify-start ml-auto'>
            <div className='h-full flex items-center ml-auto mr-6'>
              <CurrencyDropdown />
              {/* <LanguageDropdown />  */}
              <div onClick={() => navigate("/cart")} className='h-10 w-10 flex items-center justify-center ml-4 border-solid border-[1px] border-black rounded-full hover:bg-grey cursor-pointer'>
                <ShoppingCartIcon className='h-5 w-5 text-black' />
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

