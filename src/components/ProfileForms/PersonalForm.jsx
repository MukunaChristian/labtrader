import { SaveResetButtons } from "./SaveResetButtons"

export const PersonalForm = (
    { 
      details, 
      changesMade, 
      updateDetails,
      resetDetails,
      saveDetails,
    }
  ) => {

  return (
    <div className="profile-block">
      <p className="font-semibold text-lg text-black">Personal Details</p>
      <div className="flex flex-wrap mt-4">
        <div className="w-[18rem] mr-8">
          <p className="">Name</p>
          <input name="name" onChange={(e) => updateDetails(e.target.name, e.target.value, "personalDetails" )} value={details.name} className="default-input w-[50%] mt-1" type="text" />
        </div>

        <div className="w-[18rem] mr-8">
          <p className="">Surname</p>
          <input name="surname" onChange={(e) => updateDetails(e.target.name, e.target.value, "personalDetails" )} value={details.surname} className="default-input w-[50%] mt-1" type="text" />
        </div>
      </div>

      <div className="w-[18rem] mr-8 mt-4">
        <p className="">Phone Number</p>
        <input name="number" onChange={(e) => updateDetails(e.target.name, e.target.value, "personalDetails" )} value={details.number} className="default-input w-[50%] mt-1" type="text" />
      </div>
      
      <SaveResetButtons
        saveButtonDisabled={!changesMade} 
        resetButtonDisabled={!changesMade} 
        saveButtonHandler={() => saveDetails()}
        resetButtonHandler={() => resetDetails()}
      />
      
    </div>
  )
}