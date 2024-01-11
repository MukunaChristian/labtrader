import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from '../api/password';
import { useState } from "react";

export const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [invalidPassword, setinvalidPassword] = useState(false);

  const token = searchParams.get('token');

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const password = e.target["password"].value.trim();
    const confirm_password = e.target["confirm_password"].value.trim();

    if (password !== confirm_password) {
      console.error("Passwords do not match");
      setinvalidPassword(true)
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
    <div className="h-[100vh] overflow-hidden w-full flex justify-center bg-light-grey">
      <div className="relative w-[24rem] h-[20rem] border-[1.5px] flex flex-col items-center border-solid border-text my-auto p-5 shadow-lg">
        <ArrowLeftIcon className="h-8 w-8 absolute top-5 left-5 cursor-pointer hover:bg-grey/40 rounded-md" onClick={() => { navigate("/login") }} />
        <p className="text-3xl mb-6">Reset Password</p>
        {invalidPassword && <p className="text-red-400 text-sm">Passwords do not match</p>}
        <form className="mb-4" onSubmit={(e) => { handleResetPassword(e) }}>
          <input name="password" className="default-input mt-5" type="password" placeholder="Password" />
          <input name="confirm_password" className="default-input mt-5" type="password" placeholder="Confirm Password" />
          <button type="submit" className="w-full h-10 bg-black text-white rounded-md mt-5">Submit</button>
        </form>
      </div>
    </div>
  )
}