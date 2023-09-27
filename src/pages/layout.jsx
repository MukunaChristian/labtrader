import { useLocation } from 'react-router-dom';
import { Bars3Icon } from "@heroicons/react/20/solid";
import { LanguageDropdown } from '../components/dropdowns/languageDropdown';
import { CurrencyDropdown } from '../components/dropdowns/currencyDropdown';


export const Layout = ({ children }) => {
  const location = useLocation();
  console.log(location.pathname);

  let isLogin = location.pathname === '/login';

  return (
    <div className='w-full h-full'>
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
            <LanguageDropdown />
            <CurrencyDropdown />
          </div>
          
        </div>
      }
      <div>
        {children}
      </div>
      
    </div>
  )
}

