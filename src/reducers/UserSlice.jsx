import { cardActionsClasses } from "@mui/material";
import { createSlice } from "@reduxjs/toolkit"


const UserSlice = createSlice({
  name: 'user',
  initialState: {
    user: {
      email: "",
      role: "",
      id: ""
    },
    companyDetails: {
      company_name: "",
      company_address_1: "",
      company_address_2: "",
      company_city: "",
      company_country: "",
      company_pincode: ""
    },
    deliveryDetails: {
      delivery_address_1: "",
      delivery_address_2: "",
      delivery_city: "",
      delivery_country: "",
      delivery_pincode: "",
    },
    invoiceDetails: {
      bank_name: "",
      bank_branch: "",
      bank_account_number: "",
      bank_branch_number: "",
      bank_account_type: ""
    },
    userDetails: {
      name: "",
      surname: "",
      phone: ""
    },

    diamonds_in_cart: [],
  },
  reducers: {
    setUserState: (state, action) => {
      state.user = action.payload
    },

    setUserDetailsState: (state, action) => {
      if (action.payload.personal) {
        state.userDetails = action.payload.personal
      }
      if (action.payload.company) {
        state.companyDetails = action.payload.company
      }
      if (action.payload.delivery) {
        state.deliveryDetails = action.payload.delivery
      }
      if (action.payload.invoice) {
        state.invoiceDetails = action.payload.invoice
      }
    },

    addDiamondToCart: (state, action) => {
      console.log(action.payload)
      if (action.payload.diamond) {
        console.log("index exists")
        state.diamonds_in_cart.splice(action.payload.index, 0, action.payload.diamond)
        let cart = JSON.parse(localStorage.getItem('cartItems'));
        cart.splice(action.payload.index, 0, action.payload.diamond)
        localStorage.setItem('cartItems', JSON.stringify(cart));
        return
      }

      console.log("index does not exist")

      state.diamonds_in_cart.push(action.payload)
      let cart = JSON.parse(localStorage.getItem('cartItems'));
      cart = [...cart, action.payload]
      localStorage.setItem('cartItems', JSON.stringify(cart));
    },

    removeDiamondFromCart: (state, action) => {
      console.log(action.payload)
      console.log(state.diamonds_in_cart)
      state.diamonds_in_cart = state.diamonds_in_cart.filter(diamond => diamond.id !== action.payload)
      
      let cart = JSON.parse(localStorage.getItem('cartItems'));
      cart = cart.filter(diamond => diamond.id !== action.payload)
      localStorage.setItem('cartItems', JSON.stringify(cart));
    },

    clearCart: (state) => {
      console.log("clearing cart")
      state.diamonds_in_cart = []
      localStorage.setItem('cartItems', "[]");
    },

    loadCart: (state) => {
      if (!localStorage.getItem('cartItems')) {
        localStorage.setItem('cartItems', "[]");
      } else {
        state.diamonds_in_cart = JSON.parse(localStorage.getItem('cartItems'));
      }
      
    }
  },
});

export const { 
  setUserState,
  setUserDetailsState,
  setCompanyDetailsState,
  setDeliveryDetailsState,
  setInvoiceDetailsState,
  addDiamondToCart,
  removeDiamondFromCart,
  clearCart,
  loadCart
} = UserSlice.actions
export default UserSlice.reducer;
