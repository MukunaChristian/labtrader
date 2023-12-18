import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { EnvelopeIcon } from "@heroicons/react/20/solid";
import { PhoneIcon } from "@heroicons/react/20/solid";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import { useNavigate } from "react-router-dom";

export const ForgotPassword = () => {
  const inConstruction = true;
  const navigate = useNavigate();

  const handleForgotPassword = (e) => {
    e.preventDefault();
    const email = e.target["email"].value.trim();
    console.log(email)
  }

  return (
    (!inConstruction) ?
    <div className="h-[100vh] overflow-hidden w-full flex justify-center bg-light-grey">
      <div className="w-[20rem] h-[22rem] border-[1.5px] border-solid border-text my-auto p-5 shadow-lg">
        <p className="mb-2">Enter the email address associated with you account and we will send you a link to reset your password.</p>
        <form className="mb-4" onSubmit={(e) => {handleForgotPassword(e)}}>
          <input name="email" className="default-input" type="text" placeholder="Email" />
          <input name="password" className="default-input" type="password" placeholder="Password" />
          <button type="submit" className="w-full h-10 bg-black text-white rounded-md mt-5">Continue</button>
        </form>
      </div>
    </div> :
    <div className="h-[100vh] overflow-hidden w-full flex flex-row justify-center bg-light-grey">
      <div className="relative w-[24rem] h-[28rem] border-[1.5px] flex flex-col items-center border-solid border-text my-auto p-5 shadow-lg">
        <ArrowLeftIcon className="h-8 w-8 absolute top-5 left-5 cursor-pointer hover:bg-grey/40 rounded-md" onClick={() => {navigate("/login")}} />
        <InformationCircleIcon className="h-20 w-20 my-8" />
        <p className="mb-2 font-semibold">In order to reset your password;</p>
        <p className="mb-2 font-semibold">please contact your account administrator:</p>
        <div className="pt-12 pl-5 w-full">
          <div className="flex">
            <PhoneIcon className="h-5 w-5 inline-block mr-2" />
            <p className="mb-2 ml-2">EMAIL ADDRESS</p>
          </div>
          <div className="flex pt-4">
            <EnvelopeIcon className="h-5 w-5 inline-block mr-2" />
            <p className="mb-2 ml-2">PHONE NUMBER</p>
          </div>
        </div>
      </div>
    </div>
  )
}