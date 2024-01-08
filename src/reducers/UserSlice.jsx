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
      console.log(action.payload)
      state.user = action.payload
    },

    setUserDetailsState: (state, action) => {
      console.log(action.payload)
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
      state.diamonds_in_cart.push(action.payload)
    },

    removeDiamondFromCart: (state, action) => {
      state.diamonds_in_cart = state.diamonds_in_cart.filter(diamond => diamond.id !== action.payload)
    },

    clearCart: (state) => {
      console.log("clearing cart")
      state.diamonds_in_cart = []
    },
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
  clearCart
} = UserSlice.actions
export default UserSlice.reducer;
