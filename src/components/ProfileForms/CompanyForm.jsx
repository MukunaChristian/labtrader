import { SaveResetButtons } from "./SaveResetButtons"

export const CompanyForm = (
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
      <p className="font-semibold text-lg text-black">Company Details</p>
      <div className="flex flex-wrap">
        <div className="w-[45%] mr-8 mt-4">
          <p className="">Company Name</p>
          <input name="company_name" onChange={(e) => updateDetails(e.target.name, e.target.value, "companyDetails" )} value={details.company_name} className="default-input w-[50%] mt-1" type="text" />
        </div>

        <div className="w-[95%] mr-8 mt-4">
          <p className="">Address Line 1</p>
          <input name="company_address_1" onChange={(e) => updateDetails(e.target.name, e.target.value, "companyDetails" )} value={details.company_address_1} className="default-input w-[50%] mt-1" type="text" />
        </div>

        <div className="w-[95%] mr-8 mt-4">
          <p className="">Address Line 2</p>
          <input name="company_address_2" onChange={(e) => updateDetails(e.target.name, e.target.value, "companyDetails" )} value={details.company_address_2} className="default-input w-[50%] mt-1" type="text" />
        </div>

        <div className="w-[45%] mr-8 mt-4">
          <p className="">City</p>
          <input name="company_city" onChange={(e) => updateDetails(e.target.name, e.target.value, "companyDetails" )} value={details.company_city} className="default-input w-[50%] mt-1" type="text" />
        </div>

        <div className="w-[45%] mr-8 mt-4">
          <p className="">Country</p>
          <input name="company_country" onChange={(e) => updateDetails(e.target.name, e.target.value, "companyDetails" )} value={details.company_country} className="default-input w-[50%] mt-1" type="text" />
        </div>

        <div className="w-[45%] mr-8 mt-4">
          <p className="">Zip Code</p>
          <input name="company_pincode" onChange={(e) => updateDetails(e.target.name, e.target.value, "companyDetails" )} value={details.company_pincode} className="default-input w-[50%] mt-1" type="text" />
        </div>
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