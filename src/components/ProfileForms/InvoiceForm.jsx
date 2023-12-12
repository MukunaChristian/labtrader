import { SaveResetButtons } from "./SaveResetButtons"

export const InvoiceForm = (
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
      <p className="font-semibold text-lg text-black">Invoice Details</p>
      <div className="flex flex-wrap">
        <div className="w-[45%] mr-16 mt-4">
          <p className="">Bank Name</p>
          <input name="bank_name" onChange={(e) => updateDetails(e.target.name, e.target.value, "invoiceDetails" )} value={details.bank_name} className="default-input w-[50%] mt-1" type="text" />
        </div>

        <div className="w-[45%] mr-8 mt-4">
          <p className="">Branch</p>
          <input name="bank_branch" onChange={(e) => updateDetails(e.target.name, e.target.value, "invoiceDetails" )} value={details.bank_branch} className="default-input w-[50%] mt-1" type="text" />
        </div>

        <div className="w-[45%] mr-8 mt-4">
          <p className="">Branch Number</p>
          <input name="bank_branch_number" onChange={(e) => updateDetails(e.target.name, e.target.value, "invoiceDetails" )} value={details.bank_branch_number} className="default-input w-[50%] mt-1" type="text" />
        </div>

        <div className="w-[45%] mr-8 mt-4">
          <p className="">Account Number</p>
          <input name="bank_account_number" onChange={(e) => updateDetails(e.target.name, e.target.value, "invoiceDetails" )} value={details.bank_account_number} className="default-input w-[50%] mt-1" type="text" />
        </div>

        <div className="w-[45%] mr-8 mt-4">
          <p className="">Account Type</p>
          <input name="bank_account_type" onChange={(e) => updateDetails(e.target.name, e.target.value, "invoiceDetails" )} value={details.bank_account_type} className="default-input w-[50%] mt-1" type="text" />
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