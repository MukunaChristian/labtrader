import { useSelector, useDispatch } from "react-redux"
import { useState, useEffect } from "react"
import { ArrowLeftIcon } from "@heroicons/react/20/solid"
import { TrashIcon } from "@heroicons/react/20/solid"
import { useNavigate } from "react-router-dom"
import { checkout } from "../api/checkout"
import { clearCart, removeDiamondFromCart } from "../reducers/UserSlice"
import { CheckoutDropdown } from "../components/Dropdowns/CheckoutDropdown"
import { calculateDeliveryFee } from "../api/checkout"


export const Cart = () => {
    const diamonds_in_cart = useSelector(state => state.user.diamonds_in_cart)
    const dispatch = useDispatch()
    const user_id = useSelector(state => state.user.user.id)
    const currency = useSelector(state => state.app.currency)
    const [selectedDiamond, setSelectedDiamond] = useState()

    const [delivery, setDelivery] = useState(false)
    const [deliveryFee, setDeliveryFee] = useState(0)

    const rates = useSelector(state => state.app.rates);
    const navigate = useNavigate()

    const total = diamonds_in_cart.reduce((acc, curr) => acc + parseFloat(curr.total) * curr.specifications.carat * rates[currency.code], 0).toFixed(2)

    useEffect(() => {
      if (diamonds_in_cart.length > 0) {
        setSelectedDiamond(diamonds_in_cart[0])
      }
    }, [diamonds_in_cart])

    const toggleDelivery = (option) => {
      if (option === "Deliver") {
        setDelivery(false)
        setDeliveryFee(0)
        calculateDeliveryFee().then(
          res => {
            console.log(res)
          }
        )
      } else {
        setDelivery(true)
        setDeliveryFee(100)
      }
    }



    const handleCheckout = () => {

      checkout(diamonds_in_cart, user_id, 0, deliveryFee, currency.code, delivery).then(
        res => {
          console.log(res)
          dispatch(clearCart())
          navigate("/confirm")   
        }
      )
    }

    
    return (
      <div className="pt-24 px-24 bg-light-grey pb-24 relative">
        <div className="hover:bg-grey rounded-full mb-4 p-2 w-11 h-11 cursor-pointer">
          <ArrowLeftIcon className="h-7 w-7" onClick={() => window.history.back()}/>
        </div>
        
        <div className="flex items-end pb-2">
          <p className="text-2xl font-bold h-full mr-4">Cart</p>
          <p className="inline-block h-full font-semibold pb-[2px]">{diamonds_in_cart.length} items in Cart</p>
        </div>

        <div className="border-solid h-[32rem] border-[1px] border-b-0 rounded-t-lg z-0 overflow-auto bg-white">
          {
            diamonds_in_cart.map((diamond, index) => {
              return (
                <div key={diamond.id} onClick={() => setSelectedDiamond(diamond)} className={`relative flex items-center cursor-pointer justify-between border-solid border-0 border-b-[1px] h-[6rem] pl-4 ${index === 0 && 'rounded-t-lg'} ${selectedDiamond === diamond ? 'bg-grey/40' : ''}`}>
                  <div className="flex items-center w-full">
                    <img src={diamond.image} alt="" className="h-[4rem]"/>
                    <div className="ml-10 h-full">
                      <div className='font-semibold text-sm pb-1'>
                        {diamond.shape.toUpperCase()} {diamond.specifications.carat}ct {diamond.specifications.color} {diamond.specifications.clarity.toUpperCase()} {diamond.specifications.cut.toUpperCase()} {diamond.finish.polish.toUpperCase()} {diamond.finish.symmetry.toUpperCase()} {diamond.finish.fluorescence.toUpperCase()}
                      </div>
                      <p className="text-sm">{diamond.id}</p>
                      <p className='text-sm'>{diamond.ratio_measurements.measurements.width} - {diamond.ratio_measurements.measurements.height} x {diamond.ratio_measurements.measurements.depth}</p>
                    </div>

                    <div className="ml-auto text-right border-solid border-0 border-r-[1px] pr-4 mr-4 border-black">
                      <p className="text-sm">Price in USD</p>
                      <p className="font-semibold text-sm">$ {diamond.total * diamond.specifications.carat}</p>
                    </div>

                    <div className="text-right mr-4">
                      <p className="text-sm">Price in {currency.name}</p>
                      <p className="font-semibold text-sm">{diamond.total ? currency.symbol + " " + (parseFloat(diamond.total) * diamond.specifications.carat * rates[currency.code] * 10 / 10).toFixed(2) : 'N/A'}</p>
                    </div>
                    
                  </div>
                  <p className="">{diamond.price}</p>

                  {selectedDiamond === diamond && 
                    <div className="mr-5 ml-1 pt-2">
                      <TrashIcon className="h-7 w-7 text-text hover:text-black" onClick={() => dispatch(removeDiamondFromCart(diamond.id))}/>
                    </div> 
                  }
                </div>
              )
            
            })
          }
        </div>
        
        <div className="flex items-center border-solid px-8 h-[8rem] border-[1px] border-black rounded-b-lg bg-black">
          <div className="text-white">
            <p className="mb-2">Delivery fee</p>
            <p className="mb-2">Sub Total</p>
            <p className="font-semibold text-lg">Total</p>
          </div>
          <div className="ml-auto text-white">
            <p className="mb-2">{currency.symbol} {0}</p>
            <p className="mb-2">{currency.symbol} {total}</p>
            <p className="font-semibold text-lg">{currency.symbol} {total}</p> 
          </div>
        </div>
        {diamonds_in_cart.length > 0 && 
          <div className="flex items-center justify-end mt-6">
            <CheckoutDropdown toggleDelivery={toggleDelivery}/>
            <button onClick={() => handleCheckout()} className="bg-black text-white px-8 py-3">Confirm order</button>

          </div>
        }
      </div>
    )
}