import { createSlice } from "@reduxjs/toolkit"


const appSlice = createSlice({
  name: "app",
  initialState: {
    currency: { 
      id: 1, 
      name: 'Euro', 
      symbol: '€', 
      imgSrc: 'src/assets/euro.png', 
      code: 'EUR' 
    },
    language: "English",
    filters: {
      "delivery_time": [],
      "certificate": [],
      "shape": [],
      "carat_range": [],
      "color": [],
      "clarity": [],
      "cut": [],
      "polish": [],
      "symmetry": [],
      "fluorescence": [],
      "fluorescence_color": [],
      "eye_clean": [],
      "show_only_image": false,
      "show_only_video": false,
      "show_only_returnable": false,
      "show_only_immediate_purchase": false,
      "with_unknown_eye_clean": false,
      "with_unknown_shade": false,
      "with_unknown_luster": false,
      "no_bgm": false,
    },
    rates: {},
    diamondData: [],
    loadingData: true,
    loggedIn: false
  },
  reducers: {
    setLoggedInState: (state, action) => {
      state.loggedIn = action.payload
    },
    setCurrencyState: (state, action) => {
      state.currency = action.payload
    },
    setLanguageState: (state, action) => {
      state.language = action.payload
    },
    setFiltersState: (state, action) => {
      state.filters = action.payload
    },
    setDiamondDataState: (state, action) => {
      state.diamondData = action.payload
    },
    setCurrencyRateState: (state, action) => {
      state.rates = action.payload
    },
    setLoadingDataState: (state, action) => {
      state.loadingData = action.payload
    },
    resetFiltersState: (state) => {
      state.filters = {
        "delivery_time": [],
        "certificate": [],
        "shape": [],
        "carat_range": {},
        "color": [],
        "clarity": [],
        "cut": [],
        "polish": [],
        "symmetry": [],
        "fluorescence": [],
        "fluorescence_color": [],
        "eye_clean": [],
        "show_only_image": false,
        "show_only_video": false,
        "show_only_returnable": false,
        "show_only_immediate_purchase": false,
        "with_unknown_eye_clean": false,
        "with_unknown_shade": false,
        "with_unknown_luster": false,
        "no_bgm": false,
      }
    }
  },
})

export const { 
  setCurrencyState, 
  setLanguageState, 
  setFiltersState, 
  setCurrencyRateState, 
  resetFiltersState, 
  setDiamondDataState, 
  setLoggedInState, 
  setLoadingDataState 
} = appSlice.actions
export default appSlice.reducer;
