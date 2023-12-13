import { useLocation, useNavigate } from 'react-router-dom';
import { LanguageDropdown } from '../components/Dropdowns/LanguageDropdown';
import { CurrencyDropdown } from '../components/Dropdowns/CurrencyDropdown';
import { useApp } from "../hooks/useApp";
import { useSelector } from "react-redux";
import { validateToken } from "../api/login";
import { useEffect } from 'react';
import { default as Logo } from '../assets/Color logo with background (3).svg';
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
    <div className='w-[100%] h-full'>
      {isLogin ? null : 
        <div className='w-full z-30 h-16 bg-white flex relative items-center justify-start px-5 pt-24 fixed'>
          <div className='h-24 w-[50vw] flex justify-start items-center pl-6 border-0 border-solid border-y-[1px] border-black'>
            <MenuSideBar setLoggedIn={setLoggedIn} />
          </div>

          <div className='absolute left-[50%] translate-x-[-50%] bg-black w-48 h-48 rounded-full flex items-center justify-center border-solid border-[12px] border-white'> 
            <img src={Logo} className='w-32 h-32' />
          </div>

          
          <div className='h-24 w-[50vw] flex justify-start border-0 border-solid border-y-[1px] border-black'>
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
      <div className='h-full'>
        {children}
      </div>
      
    </div> :
    <div></div>
  )
}

