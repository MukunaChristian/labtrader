import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { XMarkIcon } from '@heroicons/react/24/outline';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import loader from '../../assets/loader.gif';
import { addDiamondToCart, removeDiamondFromCart } from '../../reducers/UserSlice';
import { useDispatch } from 'react-redux';
import { current } from '@reduxjs/toolkit';


export const DataRowsMelee = ({ row, columns }) => {
  const currency = useSelector(state => state.app.currency);
  const rates = useSelector(state => state.app.rates);
  const diamonds_in_cart = useSelector(state => state.user.diamonds_in_cart);

  const [isExpanded, setIsExpanded] = useState(false);
  const [currentAmount, setCurrentAmount] = useState('');
  const dispatch = useDispatch();

  let spotPrice = null;
  if (row.total) {
    spotPrice = ((parseFloat(row.total) * rates[currency.code]) * 10 / 10).toFixed(2)
  }

  let missingImage = false;
  if (!row["video_link"].includes("videos.gem360.in") && !row["video_link"].includes("view.gem360.in")) {
    missingImage = true;
  }

  const handleExpand = () => {
    console.log("expand")
    if (isExpanded) {
      setTimeout(() => {
        setGemDisabled(true);
      }, 1000);
    
    } else {
      setGemDisabled(false);
    }

    setIsExpanded(!isExpanded);
  }

  const handleAddToCart = () => {
    if (diamonds_in_cart.some(item => item.id === row.id)) {
      dispatch(removeDiamondFromCart(row.id));
    } else {
      dispatch(addDiamondToCart({...row , amount_in_cart: parseInt(currentAmount)}));
    }
  }

  const calcTotalPrice = (convert) => {
    if (!currentAmount > 0) {
      return 0;
    }

    if (convert) {
      return ((parseFloat(row.total) * rates[currency.code] * 10) / 10 * currentAmount).toFixed(2);
    } else {
      return ((parseFloat(row.total) * 10) / 10 * currentAmount).toFixed(2);
    }
  }

  const updateCurrentAmount = (e) => {
    console.log(e.target.value)
    if (!/^[^0-9]*$/.test(e.target.value) || e.target.value === '') {
      setCurrentAmount(e.target.value);
    }
  }

  useState(() => {
    if (diamonds_in_cart.some(item => item.id === row.id)) {
      setCurrentAmount(diamonds_in_cart.find(item => item.id === row.id).amount_in_cart);
    } else {
      setCurrentAmount('');
    }
  }, [diamonds_in_cart])


  const inCart = diamonds_in_cart.some(item => item.id === row.id);
  const checkoutUnallowed = (currentAmount === "0" || currentAmount === '' || currentAmount > row.amount) && !inCart;

  return (
    <>
      <tr>
        {columns.map((column, colIndex) => (
          <>
          <td key={colIndex} className={`px-2 py-4 whitespace-nowrap text-text border-solid border-[1.5px] bg-black border-dark-grey ${column.field === "image" ? "align-middle text-center" : ""}`}>
            {
            column.field === "total" ? 
            <div className='w-[100%]'>
              {spotPrice ? <div className="flex flex-col">
                <div className="flex"><p className=''>$ {calcTotalPrice(false)}</p></div>
                <div className="flex"><p>R {calcTotalPrice(true)}</p></div>
              </div> : <div className="flex flex-col">
                <div className="flex"><p className='text-lg'>N/A</p></div>
              </div>}
            </div> : column.field === "ppc" ? 
            <div className="flex flex-col">
            <div className="flex">
              <p>
                $ {((parseFloat(row["total"]) / parseFloat(row.specifications.carat)).toFixed(2))}
              </p>
            </div>
            <div className="flex">
              <p className="">
                R {(spotPrice / parseFloat(row.specifications.carat)).toFixed(2)}
              </p>
            </div>
          </div> : column.field === "order" ? 
          <>
            <p className='mb-2'>
              {row.amount ? row.amount : 0} Available
            </p>
            <div className="flex">
              <input disabled={inCart} className={`w-[6rem] h-[1.5rem] px-2 rounded-sm mr-2 ${inCart ? 'bg-light-grey' : ''}`} value={currentAmount} onChange={(e) => {updateCurrentAmount(e)}} />
              <p>~ pcs</p>
            </div>
          </> : 
            column.field === "cart" ? <div className='w-full flex justify-center'>
              <button 
                disabled={checkoutUnallowed} 
                onClick={() => handleAddToCart()} 
                className={`h-8 w-8 bg-black rounded-full border-solid border-[2px] flex justify-center items-center 
                            ${checkoutUnallowed ? 'cursor-default border-gray-200' : 'border-white'} 
                            ${inCart ? 'bg-red-400' : ''}`}
                >
                {inCart ? 
                <XMarkIcon className={`w-5 h-5 text-red`}/> :
                <ShoppingCartIcon className={`w-5 h-5 ${checkoutUnallowed ? 'text-gray-200' : 'text-white'}`}/>}
              </button>  
            </div> :
            column.renderCell ? column.field === "information" ?
            column.renderCell({ value: {"id": row.id, "cert_id": row.cert_id}, row: row }) :
            column.renderCell({ value: row[column.field], row: row }) : 
            row[column.field]
            }
          </td>
          </>
        ))}
      </tr> 
    </>
  )
}