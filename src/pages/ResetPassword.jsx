import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from '../api/password';
import { useState } from "react";

export const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [invalidPassword, setinvalidPassword] = useState(false);
  const [error, setError] = useState("");

  const token = searchParams.get('token');

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const password = e.target["password"].value.trim();
    const confirm_password = e.target["confirm_password"].value.trim();

    if (!password) {
      setError("Please enter your password");
      return
    }

    if (!confirm_password) {
      setError("Please confirm your password");
      return
    }

    if (password !== confirm_password) {
      setError("Passwords do not match");
      return;
    }

    try {
      await resetPassword(token, password);
      navigate("/login");

    } catch (error) {
      console.error("Error resetting password:", error);
    }
  }

  return (
    <div className="w-full h-full flex items-center justify-center flex-col login-color">
      <img className="w-[35rem] pb-10" src="../assets/labtrader-login.png"></img>
      <div className="relative w-[25rem] flex flex-col items-center p-5 text-white">
        <ArrowLeftIcon className="h-8 w-8 absolute top-5 left-5 cursor-pointer hover:bg-grey/40 rounded-md" onClick={() => { navigate("/login") }} />
        <p className="text-3xl mb-6">Reset Password</p>
        {error && <p className="text-red-500 text-med">{error}</p>}
        <form className="mb-4" onSubmit={(e) => { handleResetPassword(e) }}>
          <input name="password" className="default-input mt-5" type="password" placeholder="Password" />
          <input name="confirm_password" className="default-input mt-5" type="password" placeholder="Confirm Password" />
          <button type="submit" className="w-full h-10 bg-light-grey text-black rounded-md mt-5 login-button">Submit</button>
        </form>
      </div>
    </div>
  )
}