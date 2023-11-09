import { useNavigate } from "react-router-dom"
import { login } from "../api/login";
import { useApp } from "../hooks/useApp";


export const Login = () => {
  const navigate = useNavigate();
  const { setLoggedIn } = useApp();

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target["email"].value;
    const password = e.target["password"].value;
    const res = await login(email, password);
    if (res.status === 200) {
      console.log("success")
      localStorage.setItem("jwt", res.data.token)
      console.log(res.data.token)
      setLoggedIn(true)
      navigate("/")
    }
  }


  return (
    <div className="h-[100vh] overflow-hidden w-full flex justify-center bg-white">
      <div className="w-[20rem] h-[22rem] border-[1.5px] border-solid border-text bg-text/20 my-auto p-5 shadow-lg">
        <p className="text-3xl mb-2">Login</p>
        <p className="text-sm">Please enter your username and password</p>
        <form className="mb-4" onSubmit={(e) => {handleLogin(e)}}>
          <input name="email" className="default-input" type="text" placeholder="Email" />
          <input name="password" className="default-input" type="password" placeholder="Password" />
          <button type="submit" className="w-full h-10 bg-navy-blue text-white rounded-md mt-5">Log in</button>
        </form>
        <div className="w-full flex justify-end">
          <a className="text-delete-red text-sm text-right hover:text-light-red">Forgot Password?</a>
        </div> 
      </div>
    </div>
  )
}