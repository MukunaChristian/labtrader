import { SaveResetButtons } from "./SaveResetButtons"
import { useState } from "react"


export const PersonalForm = ({ details }) => {
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
      <p className="font-semibold text-lg text-black">Personal Details</p>
      <div className="flex mt-4">
        <div className="w-[40%] mr-8">
          <p className="">Name</p>
          <input className="default-input w-[50%] mt-1" type="text" />
        </div>

        <div className="w-[40%] mr-8">
          <p className="">Surname</p>
          <input className="default-input w-[50%] mt-1" type="text" />
        </div>
      </div>

      <div className="w-[40%] mr-8 mt-4">
        <p className="">Phone Number</p>
        <input className="default-input w-[50%] mt-1" type="text" />
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