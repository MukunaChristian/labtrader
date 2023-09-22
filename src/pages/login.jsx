import { useNavigate } from "react-router-dom"


export const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="h-full w-full flex justify-center">
      <div className="w-[20rem] h-[22rem] border-[1.5px] border-solid my-auto p-5">
        <p className="text-3xl mb-2">Login</p>
        <p className="text-sm">Please enter your username and password</p>
        <form className="mb-4" onSubmit={() => {navigate("/")}}>
          <input className="default-input" type="text" placeholder="Username" />
          <input className="default-input" type="password" placeholder="Password" />
          <button type="submit" className="w-full h-10 bg-navy-blue text-white rounded-md mt-5">Log in</button>
        </form>
        <div className="w-full flex justify-end">
          <a className="text-delete-red text-sm text-right hover:text-light-red">Forgot Password?</a>
        </div> 
      </div>
    </div>
  )
}