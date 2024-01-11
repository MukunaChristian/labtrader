import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { sendResetPasswordLink } from '../api/password';

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [emailSent, setemailSent] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const email = e.target["email"].value.trim();
    console.log(email)

    try {
      await sendResetPasswordLink(email);
      setemailSent(true)
    } catch (error) {
      console.error("Error sending link:", error);
    }
  }

  return (
    <div className="h-[100vh] overflow-hidden w-full flex justify-center bg-light-grey">
      <div className="relative w-[24rem] h-[20rem] border-[1.5px] flex flex-col items-center border-solid border-text my-auto p-5 shadow-lg">
        <ArrowLeftIcon className="h-8 w-8 absolute top-5 left-5 cursor-pointer hover:bg-grey/40 rounded-md" onClick={() => {navigate("/login")}} />
        <p className="text-3xl mb-6">Reset Password</p>
        <p className="mb-2 font-semibold">In order to reset your password</p>
        <p className="mb-2 font-semibold">please provide us with your email</p>
        <p className="mb-2 font-semibold">so we can send a reset link</p>
        {emailSent && <p className="text-green-500 text-med">Email Sent</p>}
        <form className="mb-4" onSubmit={(e) => { handleForgotPassword(e) }}>
          <input name="email" className="default-input mt-5" type="text" placeholder="Email" />
          <button type="submit" className="w-full h-10 bg-black text-white rounded-md mt-5">Submit</button>
        </form>
      </div>
    </div>
  )
}