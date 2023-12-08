import { SaveResetButtons } from "./SaveResetButtons"
import { useState } from "react"

export const CompanyForm = ({ details }) => {
  const [changesMade, setChangesMade] = useState(true)
  const [localDetails, setLocalDetails] = useState(details)

  const onSaved = () => {
    setChangesMade(false)
  }

  const onReset = () => {
    setChangesMade(false)
    setLocalDetails(details)
  }

  return (
    <div className="profile-block">
      <p className="font-semibold text-lg text-black">Company Details</p>
      <div className="flex flex-wrap">
        <div className="w-[45%] mr-8 mt-4">
          <p className="">Company Name</p>
          <input className="default-input w-[50%] mt-1" type="text" />
        </div>

        <div className="w-[95%] mr-8 mt-4">
          <p className="">Address Line 1</p>
          <input className="default-input w-[50%] mt-1" type="text" />
        </div>

        <div className="w-[95%] mr-8 mt-4">
          <p className="">Address Line 2</p>
          <input className="default-input w-[50%] mt-1" type="text" />
        </div>

        <div className="w-[45%] mr-8 mt-4">
          <p className="">City</p>
          <input className="default-input w-[50%] mt-1" type="text" />
        </div>

        <div className="w-[45%] mr-8 mt-4">
          <p className="">Country</p>
          <input className="default-input w-[50%] mt-1" type="text" />
        </div>

        <div className="w-[45%] mr-8 mt-4">
          <p className="">Zip Code</p>
          <input className="default-input w-[50%] mt-1" type="text" />
        </div>

        <div className="w-[45%] mr-8 mt-4">
          <p className="">Phone Number</p>
          <input className="default-input w-[50%] mt-1" type="text" />
        </div>
      </div>

      <SaveResetButtons
        saveButtonDisabled={!changesMade} 
        resetButtonDisabled={!changesMade} 
        saveButtonHandler={() => setChangesMade(false)}
        resetButtonHandler={() => setChangesMade(false)}
      />
      
    </div>
  )
}