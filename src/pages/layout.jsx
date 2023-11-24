import { useLocation, useNavigate } from 'react-router-dom';
import { Bars3Icon } from "@heroicons/react/20/solid";
import { LanguageDropdown } from '../components/dropdowns/languageDropdown';
import { CurrencyDropdown } from '../components/dropdowns/currencyDropdown';
import { useApp } from "../hooks/useApp";
import { useSelector } from "react-redux";
import { validateToken } from "../api/login";
import { useEffect, useState } from 'react';
import { default as Logo } from '../assets/Color logo with background (3).svg';
import { getResponse } from './api_test';


export const Layout = ({ children }) => {
  const location = useLocation();
  const { setLoggedIn } = useApp();
  const loggedIn = useSelector(state => state.app.loggedIn);
  const navigate = useNavigate();
  const develop = import.meta.env.VITE_DEVELOPMENT

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

  useEffect(() => {
    if (loggedIn && isLogin) {
      navigate("/")
      return
    }
  }, [loggedIn])


  return (
    <div className='w-[100%] h-full'>
      {isLogin ? null : 
        <div className='w-full z-30 h-16 bg-white flex relative items-center justify-start px-5 pt-24 fixed'>
          <div className='h-24 w-[50vw] flex justify-start items-center pl-6 border-0 border-solid border-y-[1px] border-black'>
            <div className='flex items-center hover:bg-grey h-12 w-12 p-2 rounded-sm cursor-pointer'>
              <Bars3Icon className='h-8 w-8' />
            </div>
          </div>

          <div className='absolute left-[50%] translate-x-[-50%] bg-black w-48 h-48 rounded-full flex items-center justify-center border-solid border-[12px] border-white'> 
            <img src={Logo} className='w-32 h-32' />
          </div>

          
          <div className='h-24 w-[50vw] flex justify-start border-0 border-solid border-y-[1px] border-black'>
            <div className='h-full flex items-center ml-auto mr-6'>
              <CurrencyDropdown />
              {/* <LanguageDropdown />  */}
            </div>
          </div>
          
        </div>
      }
      <div className=''>
        {children}
      </div>
      
    </div>
  )
}

