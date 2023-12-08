import { SaveResetButtons } from "./SaveResetButtons"
import { useState } from "react"


export const InvoiceForm = ({ details }) => {
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
      <p className="font-semibold text-lg text-black">Invoice Details</p>
      <div className="flex flex-wrap">
        <div className="w-[45%] mr-16 mt-4">
          <p className="">Bank Name</p>
          <input className="default-input w-[50%] mt-1" type="text" />
        </div>

        <div className="w-[45%] mr-8 mt-4">
          <p className="">Branch</p>
          <input className="default-input w-[50%] mt-1" type="text" />
        </div>

        <div className="w-[45%] mr-8 mt-4">
          <p className="">Branch Number</p>
          <input className="default-input w-[50%] mt-1" type="text" />
        </div>

        <div className="w-[45%] mr-8 mt-4">
          <p className="">Account Number</p>
          <input className="default-input w-[50%] mt-1" type="text" />
        </div>

        <div className="w-[45%] mr-8 mt-4">
          <p className="">Account Type</p>
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