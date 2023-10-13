import { useDispatch } from "react-redux"
import { setCurrencyState, setLanguageState, setFiltersState, resetFiltersState, setLoggedInState } from "../reducers/appSlice"


export const useApp = () => {
  const dispatch = useDispatch()

  const setCurrency = (currency) => {
    dispatch(setCurrencyState(currency))
  }

  const setLanguage = (language) => {
    dispatch(setLanguageState(language))
  }

  const setFilters = (filters) => {
    dispatch(setFiltersState(filters))
  }

  const resetFilters = () => {
    dispatch(resetFiltersState())
  }

  const setLoggedIn = (loggedIn) => {
    dispatch(setLoggedInState(loggedIn))
  }

  return {
    setCurrency,
    setLanguage,
    setFilters,
    resetFilters,
    setLoggedIn
  }

}