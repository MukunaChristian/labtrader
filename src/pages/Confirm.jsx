import { EnvelopeIcon } from "@heroicons/react/24/outline"
import { useNavigate } from "react-router-dom"

export const Confirm = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-light-grey overflow-hidden h-full">
      <div className="max-w-[48rem] w-[80%] max-h-[32rem] h-[60%] border-solid border-[1px] rounded-xl shadow-sm m-auto mt-32" style={{ backgroundColor: 'rgb(220 220 220)' }}>
        <div className="flex justify-center items-center h-[80%] px-12">
          <div className="flex flex-col justify-center items-center">
            <EnvelopeIcon className="h-24 w-24 text-black" />
            <p className="text-2xl font-semibold">Confirmed.</p>
            <p className="text-sm mt-12">We have sent you an email. Please check your inbox to start the EFT process with us</p>
          </div>
        </div>
      </div>
      <div className="max-w-[48rem] w-[80%] mx-auto">
        <div onClick={() => navigate("/")} className="flex items-center justify-end mt-6">
          <button className="bg-accent rounded-lg text-white px-8 py-3">Return home</button>
        </div>
      </div>
      
    </div>
  )
}