import { useSelector, useDispatch } from "react-redux"
import { useState, useEffect } from "react"
import { ArrowLeftIcon } from "@heroicons/react/20/solid"
import { TrashIcon } from "@heroicons/react/20/solid"
import { useNavigate } from "react-router-dom"
import { checkout } from "../api/checkout"
import { clearCart, removeDiamondFromCart, addDiamondToCart } from "../reducers/UserSlice"
import { CheckoutDropdown } from "../components/dropdowns/CheckoutDropdown"
import { calculateDeliveryFee } from "../api/checkout"
import { getJewellersByReseller } from "../api/getSupplimentalData"
import { getUsersCompany } from "../api/company"

const optionsDelivery = [
  "Collect",
  "Deliver"
];


export const Cart = () => {
    const diamonds_in_cart = useSelector(state => state.user.diamonds_in_cart)
    const dispatch = useDispatch()
    const user_id = useSelector(state => state.user.user.id)
    const user_role = useSelector(state => state.user.user.role)
    const currency = useSelector(state => state.app.currency)
    const [selectedDiamond, setSelectedDiamond] = useState()

    const [delivery, setDelivery] = useState(false)
    const [deliveryFee, setDeliveryFee] = useState(0)

    const [repPurchase, setRepPurchase] = useState(false)
    const [jewellers, setJewellers] = useState([])
    const [jewellerCompanyNames, setJewellerCompanyNames] = useState([])
    const [selectedJeweller, setSelectedJeweller] = useState({})

    const rates = useSelector(state => state.app.rates);
    const navigate = useNavigate()

    const subTotal = diamonds_in_cart.reduce((acc, curr) => acc + parseFloat(curr.total) * curr.amount_in_cart * rates[currency.code], 0).toFixed(2)
    const total = (parseFloat(subTotal) + parseFloat(deliveryFee)).toFixed(2)

    const formatNumberWithSpaces = (number) => {
      // Specify options to retain up to 2 decimal places, for example
      const options = {
        minimumFractionDigits: 2, // Minimum decimal places to show
        maximumFractionDigits: 2, // Maximum decimal places to show
      };
      
      const formatter = new Intl.NumberFormat('en-US', options);
      return formatter.format(number).replace(/,/g, ' ');
    };

    const toggleDelivery = (option) => {
      if (option === "Deliver") {
        setDeliveryFee(200.00)
        setDelivery(true)
        return;
        calculateDeliveryFee().then(
          res => {
            console.log(res)
            setDeliveryFee((res.delivery_fee * rates[currency.code]).toFixed(2))
          }
        )
      } else {
        setDelivery(false)
        setDeliveryFee(0)
      }
    }

    const toggleJeweller = (option) => {
      setSelectedJeweller(jewellers.find(jeweller => jeweller.email === option))
    }

    useEffect(() => {
      if (!(user_id && user_role)) {
        return
      }

      console.log(user_role)
      if (user_role === 'Admin') {
        getUsersCompany(user_id).then(
          res => {
            console.log(res)
            if (!(res.type_id === 2)) {
              return
            }

            getJewellersByReseller(res.id, null).then(
              res => {
                console.log(res)
                setJewellers(res.data)
                setJewellerCompanyNames(res.company_names)
                setRepPurchase(true)
              }
            )
          }
        )
      } else if (user_role === 'Sales Rep') {
        getJewellersByReseller(null, user_id).then(
          res => {
            console.log(res)
            setJewellers(res.data)
            setJewellerCompanyNames(res.company_names)
            // iter though jewellers and append to jewellerNames
            setRepPurchase(true)
          }
        )
      }
    }, [user_id, user_role])

    const handleCheckout = () => {
      
      console.log(repPurchase)
      console.log(selectedJeweller)
      if (repPurchase && selectedJeweller.email === "---") {
        return
      }

      if (repPurchase) {
        checkout(diamonds_in_cart, selectedJeweller.id, 0, deliveryFee, currency.code, delivery).then(
          res => {
            console.log(res)
            console.log("repurchase")
            dispatch(clearCart())
            navigate("/confirm")   
          }
        )
        return
      } else {
        checkout(diamonds_in_cart, user_id, 0, deliveryFee, currency.code, delivery).then(
          res => {
            console.log(res)
            dispatch(clearCart())
            navigate("/confirm")   
          }
        )
      }
      
    }


    const updateCurrentAmount = (e) => {
      let amount;
      if (e.target.value === "") {
        amount = 0
      } else {
        amount = e.target.value
      }

      

      console.log(amount)
      
      if (amount >= 0) {
        const diamond = {...selectedDiamond, amount_in_cart: parseInt(amount)}
        setSelectedDiamond(diamond)
        const diamondIndex = diamonds_in_cart.findIndex(diamond => diamond.id === selectedDiamond.id)
        dispatch(removeDiamondFromCart(selectedDiamond.id))
        dispatch(addDiamondToCart({diamond: diamond, index: diamondIndex}))
      }
    }

    
    return (
      <div className="pt-24 px-24 bg-light-grey pb-24 relative">
        <div className="hover:bg-grey rounded-full mb-4 p-2 w-11 h-11 cursor-pointer">
          <ArrowLeftIcon className="h-7 w-7" onClick={() => window.history.back()}/>
        </div>
        
        <div className="flex flex-col items-start pb-2">
          <p className="text-2xl font-bold h-full mr-4">Cart</p>
          <p className="inline-block h-full font-semibold pb-[2px] text-text">{diamonds_in_cart.length} items in Cart</p>
        </div>

        <div className="border-solid h-[32rem] border-[1px] border-b-0 rounded-t-lg z-0 overflow-auto text-white" style={{ backgroundColor: 'rgb(50 50 50)' }}>
          {
            diamonds_in_cart.length === 0 ? (
              <div className="flex justify-center items-center h-[100%] text-[25px]">There are no items in your cart.</div>
            ) : (
            diamonds_in_cart.map((diamond, index) => {
              return (
                <div key={diamond.id} onClick={() => setSelectedDiamond(diamond)} className={`relative flex items-center cursor-pointer justify-between border-solid border-0 border-b-[1px] h-[6rem] border-gray-500 pl-4 ${index === 0 && 'rounded-t-lg'} ${selectedDiamond === diamond ? 'bg-grey/40' : ''}`}>
                  <div className="flex items-center w-full">
                    <img src={diamond.image} alt="" className="h-[4rem] w-[4rem]"/>
                    <div className="ml-10 h-full">
                      <div className='font-semibold text-sm pb-1'>
                        {diamond.shape.toUpperCase()} {diamond.specifications.carat}ct {diamond.specifications.color} {diamond.specifications.clarity.toUpperCase()} {diamond.specifications.cut.toUpperCase()} {diamond.finish.polish.toUpperCase()} {diamond.finish.symmetry.toUpperCase()} {diamond.finish.fluorescence.toUpperCase()}
                      </div>
                      <p className="text-sm">{diamond.id}</p>
                      <p className='text-sm'>{diamond.ratio_measurements.measurements.width} - {diamond.ratio_measurements.measurements.height} x {diamond.ratio_measurements.measurements.depth}</p>
                    </div>

                    {diamond.diamond_type_id == 2 &&
                      <div className="ml-auto text-right border-solid border-0 border-r-[1px] pr-4 mr-32 border-white">
                        <p className='mb-2'>
                          {diamond.amount ? diamond.amount : 0} Available
                        </p>
                        <div className="flex">
                          <input className={`w-[6rem] h-[1.5rem] px-2 rounded-sm mr-2`} value={diamond.amount_in_cart === 0 ? null : diamond.amount_in_cart} onChange={(e) => {updateCurrentAmount(e)}} />
                          <p>~ pcs</p>
                        </div>
                      </div>
                    }

                    <div className={`${diamond.diamond_type_id === 2 ? 'ml-0' : 'ml-auto'} text-right border-solid border-0 border-r-[1px] pr-4 mr-4 border-white`}>
                      <p className="text-sm">Price in USD</p>
                      <p className="font-semibold text-sm">$ {formatNumberWithSpaces((diamond.total * diamond.amount_in_cart).toFixed(2))}</p>
                    </div>

                    <div className="text-right mr-4">
                      <p className="text-sm">Price in {currency.name}</p>
                      <p className="font-semibold text-sm">{diamond.total  ? currency.symbol + " " + formatNumberWithSpaces((parseFloat(diamond.total) * diamond.amount_in_cart * rates[currency.code] * 10 / 10).toFixed(2)) : 'N/A'}</p>
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
            
            }))
          }
        </div>
        
        <div className="flex items-center border-solid px-8 h-[8rem] border-[1px] border-black rounded-b-lg bg-black">
          <div className="text-white">
            <p className="mb-2">Sub Total</p>
            <p className="mb-2">Delivery Fee</p> 
            <p className="font-semibold text-lg">Total (Excluding VAT)</p>
          </div>
          <div className="ml-auto text-white">
            <p className="mb-2">{currency.symbol} {formatNumberWithSpaces(subTotal)}</p>
            <p className="mb-2">{currency.symbol} {formatNumberWithSpaces(deliveryFee.toFixed(2))}</p>
            <p className="font-semibold text-lg">{currency.symbol} {formatNumberWithSpaces(total)}</p> 
          </div>
        </div>
        {diamonds_in_cart.length > 0 && 
          <div className="flex items-center justify-end mt-6">
            <CheckoutDropdown toggleDelivery={toggleDelivery} initialState="Collect" options={optionsDelivery}/>

            {repPurchase && 
              <CheckoutDropdown 
                toggleDelivery={toggleJeweller} 
                initialState="---" 
                options={jewellers.map((jeweller, index) => { return jeweller.email})} 
                display={jewellers.map((jeweller, index) => { return `${jewellerCompanyNames[index]} (${jeweller.email})`})} 
              />
            }
            <button onClick={() => handleCheckout()} className="bg-accent rounded-lg text-white px-8 py-3 h-10">Confirm order</button>

          </div>
        }
      </div>
    )
}