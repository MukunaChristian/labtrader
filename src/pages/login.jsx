import { useNavigate } from "react-router-dom"
import { login } from "../api/login";
import { useApp } from "../hooks/useApp";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUserState, setUserDetailsState } from "../reducers/UserSlice";
import { getUserData } from "../api/profileData";
import { loadCart } from "../reducers/UserSlice";


export const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { setLoggedIn } = useApp();
  const [invalidCredentials, setInvalidCredentials] = useState(false);


  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target["email"].value.trim();
    const password = e.target["password"].value.trim();
    const res = await login(email, password);
    if (res.status === 200) {
      localStorage.setItem("jwt", res.data.token)
      setLoggedIn(true)
      dispatch(setUserState({"email": email, "role": res.data.role, "id": res.data.user_id}))
      getUserData(res.data.user_id, setUserDetailsState, dispatch)
      navigate("/")
    } else if (res.status === 401) {
      setInvalidCredentials(true)
    }
  }


  return (
    <div className="w-full min-h-screen flex items-center justify-center flex-col login-color">
      <img className="w-[20rem]" src="../assets/diamond-login.png"></img>
      <img className="w-[35rem] pb-10" src="../assets/labtrader-login.png"></img>
      <div className="w-[25rem] p-5">
        {invalidCredentials && <p className="text-red-400 text-sm flex justify-center">Invalid Password or Email</p>}
        <form className="mb-4" onSubmit={(e) => {handleLogin(e)}}>
          <input name="email" className="default-input mt-5" type="text" placeholder="Email" />
          <input name="password" className="default-input mt-5" type="password" placeholder="Password" />
          <button type="submit" className="w-full h-10 bg-light-grey text-black rounded-md mt-5 login-button">Log in</button>
        </form>
        <div className="w-full flex justify-end">
          <a href="/forgot-password" className="text-sm text-right forgot-color">Forgot Password?</a>
        </div> 
      </div>
    </div>
  )
}