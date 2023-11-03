import { useLocation, useNavigate } from 'react-router-dom';
import { Bars3Icon } from "@heroicons/react/20/solid";
import { LanguageDropdown } from '../components/dropdowns/languageDropdown';
import { CurrencyDropdown } from '../components/dropdowns/currencyDropdown';
import { useApp } from "../hooks/useApp";
import { useSelector } from "react-redux";
import { validateToken } from "../api/login";
import { useEffect } from 'react';
import { getResponse } from './api_test';


export const Layout = ({ children }) => {
  const location = useLocation();
  const { setLoggedIn } = useApp();
  const loggedIn = useSelector(state => state.app.loggedIn);
  const navigate = useNavigate();

  let isLogin = location.pathname === '/login';

  const checkToken = () => {
    console.log("checking")
    setLoggedIn(false)

    const token = localStorage.getItem("jwt");
    if (!token) {
      navigate("/login")
      return
    }

    validateToken(token, navigate, setLoggedIn);
  }

  useEffect(() => {
    checkToken()
  }, [])

  if (!loggedIn && !isLogin) {
    navigate("/login")
    return
  }

  return (
    <div className='w-[100%] h-full'>
      {isLogin ? null : 
        <div className='w-full z-30 h-16 bg-navy-blue flex items-center justify-between px-5 fixed'>
          <div className='flex items-center hover:bg-light-blue p-2 rounded-sm cursor-pointer'>
            <Bars3Icon className='h-6 w-6 text-white' />
            <p className='text-white ml-2'>Menu</p>
          </div>

          <form className='ml-4 w-[40%] flex items-center'>
            <input className='w-full h-8 p-2 border border-solid rounded-sm' type="text" placeholder='Search' />
          </form>

          <div className='h-full flex items-center'>
            <CurrencyDropdown />
            <LanguageDropdown /> 
          </div>
          
        </div>
      }
      <div className='h-full'>
        {children}
      </div>
      
    </div>
  )
}

