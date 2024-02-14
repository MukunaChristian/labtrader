import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { sendResetPasswordLink } from '../api/password';

export const ForgotPassword = () => {
  const navigate = useNavigate();
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    const email = e.target["email"].value.trim();

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email.");
      return;
    }

    try {
      await sendResetPasswordLink(email);
      setEmailSent(true);
      setError("");
    } catch (error) {
      console.error("Error sending link:", error);
      setError("Failed to send reset link. Please try again.");
    }
  }

  return (
    <div className="w-full min-h-screen flex items-center justify-center flex-col login-color">
      <img className="w-[20rem]" src="../assets/diamond-login.png"></img>
      <img className="w-[35rem] pb-10" src="../assets/labtrader-login.png"></img>
      <div className="relative w-[25rem] flex flex-col items-center p-5 text-white">
        <ArrowLeftIcon className="h-8 w-8 absolute top-5 left-5 cursor-pointer hover:bg-grey/40 rounded-md" onClick={() => {navigate("/login")}} />
        <p className="text-3xl mb-6">Reset Password</p>
        <p className="mb-2">In order to reset your password</p>
        <p className="mb-2">please provide us with your email</p>
        <p className="mb-2">so we can send a reset link</p>
        {emailSent && <div><p className="text-green-500 text-med">If an account is registered with this email</p> <p className="text-green-500 text-med flex justify-center">a reset link has been sent to you</p></div>}
        {error && <p className="text-red-500 text-med">{error}</p>}
        <form className="mb-4 w-full" onSubmit={handleForgotPassword}>
          <input name="email" className="default-input mt-5" type="text" placeholder="Email" />
          <button type="submit" className="w-full h-10 bg-light-grey text-black rounded-md mt-5 login-button">Submit</button>
        </form>
      </div>
    </div>
  )
}
