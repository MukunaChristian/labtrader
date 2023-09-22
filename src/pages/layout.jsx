import { useLocation } from 'react-router-dom';
import { Bars3Icon } from "@heroicons/react/20/solid";
import { LanguageDropdown } from '../components/dropdowns/languageDropdown';


export const Layout = ({ children }) => {
  const location = useLocation();
  console.log(location.pathname);

  let isLogin = location.pathname === '/login';

  return (
    <div className='w-full h-full'>
      {isLogin ? null : 
        <div className='w-full h-16 bg-navy-blue flex items-center justify-between px-5'>
          <div className='flex items-center'>
            <Bars3Icon className='h-6 w-6 text-white' />
            <p className='text-white ml-2'>Menu</p>
          </div>

          <form className='ml-4 w-[40%] flex items-center'>
            <input className='w-full h-8 p-2 border border-solid rounded-sm' type="text" placeholder='Search' />
          </form>

          <div className='h-full flex items-center'>
            <LanguageDropdown />
          </div>
        </div>
      }
      {children}
    </div>
  )
}

