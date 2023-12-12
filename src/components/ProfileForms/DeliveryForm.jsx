import { SaveResetButtons } from "./SaveResetButtons"
import { useState } from "react"


export const DeliveryForm = (
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
      <p className="font-semibold text-lg text-black">Delivery Details</p>
      <div className="flex flex-wrap">
        <div className="w-[95%] mr-8 mt-4">
          <p className="">Address Line 1</p>
          <input name="delivery_address_1" onChange={(e) => updateDetails(e.target.name, e.target.value, "deliveryDetails" )} value={details.delivery_address_1} className="default-input w-[50%] mt-1" type="text" />
        </div>

        <div className="w-[95%] mr-8 mt-4">
          <p className="">Address Line 2</p>
          <input name="delivery_address_2" onChange={(e) => updateDetails(e.target.name, e.target.value, "deliveryDetails" )} value={details.delivery_address_2} className="default-input w-[50%] mt-1" type="text" />
        </div>

        <div className="w-[45%] mr-8 mt-4">
          <p className="">City</p>
          <input name="delivery_city" onChange={(e) => updateDetails(e.target.name, e.target.value, "deliveryDetails" )} value={details.delivery_city} className="default-input w-[50%] mt-1" type="text" />
        </div>

        <div className="w-[45%] mr-8 mt-4">
          <p className="">Country</p>
          <input name="delivery_country" onChange={(e) => updateDetails(e.target.name, e.target.value, "deliveryDetails" )} value={details.delivery_country} className="default-input w-[50%] mt-1" type="text" />
        </div>

        <div className="w-[45%] mr-8 mt-4">
          <p className="">Zip Code</p>
          <input name="delivery_pincode" onChange={(e) => updateDetails(e.target.name, e.target.value, "deliveryDetails" )} value={details.delivery_pincode} className="default-input w-[50%] mt-1" type="text" />
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