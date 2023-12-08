import { createSlice } from "@reduxjs/toolkit"


const UserSlice = createSlice({
  name: 'user',
  initialState: {
    user: {
      email: "",
      role: "",
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
  },
  reducers: {
    setUserState: (state, action) => {
      console.log(action.payload)
      state.user = action.payload
    },

    setUserDetailsState: (state, action) => {
      state.userDetails = action.payload
    },
    setCompanyDetailsState: (state, action) => {
      state.companyDetails = action.payload
    },
    setDeliveryDetailsState: (state, action) => {
      state.deliveryDetails = action.payload
    },
    setInvoiceDetailsState: (state, action) => {
      state.invoiceDetails = action.payload
    }
  },
});

export const { 
  setUserState,
  setUserDetailsState,
  setCompanyDetailsState,
  setDeliveryDetailsState,
  setInvoiceDetailsState
} = UserSlice.actions
export default UserSlice.reducer;
