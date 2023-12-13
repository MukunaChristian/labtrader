import { useNavigate } from "react-router-dom"
import { login } from "../api/login";
import { useApp } from "../hooks/useApp";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUserState, setUserDetailsState } from "../reducers/UserSlice";
import { getUserData } from "../api/profileData";


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
      dispatch(setUserState({"email": email, "role": res.data.role}))
      getUserData(res.data.user_id, setUserDetailsState, dispatch)
      navigate("/")
    } else if (res.status === 401) {
      setInvalidCredentials(true)
    }
  }


  return (
    <div className="h-[100vh] overflow-hidden w-full flex justify-center bg-white">
      <div className="w-[20rem] h-[22rem] border-[1.5px] border-solid border-text my-auto p-5 shadow-lg">
        <p className="text-3xl mb-2">Login</p>
        {invalidCredentials && <p className="text-red-400 text-sm">Invalid Password or Email</p>}
        <form className="mb-4" onSubmit={(e) => {handleLogin(e)}}>
          <input name="email" className="default-input mt-5" type="text" placeholder="Email" />
          <input name="password" className="default-input mt-5" type="password" placeholder="Password" />
          <button type="submit" className="w-full h-10 bg-black text-white rounded-md mt-5">Log in</button>
        </form>
        <div className="w-full flex justify-end">
          <a href="/forgot-password" className="text-delete-red text-sm text-right hover:text-light-red">Forgot Password?</a>
        </div> 
      </div>
    </div>
  )
}