import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { updateProfile } from "../api/profileData"

import { PersonalForm } from "../components/ProfileForms/PersonalForm"
import { CompanyForm } from "../components/ProfileForms/CompanyForm"
import { InvoiceForm } from "../components/ProfileForms/InvoiceForm"
import { DeliveryForm } from "../components/ProfileForms/DeliveryForm"

export const Profile = () => {
  const [activeTab, setActiveTab] = useState("personal")
  const [changesMade, setChangesMade] = useState(false)
  const user_id = useSelector(state => state.user.user.id)

  const personalDetails = useSelector(state => state.user.userDetails)
  const companyDetails = useSelector(state => state.user.companyDetails)
  const invoiceDetails = useSelector(state => state.user.invoiceDetails)
  const deliveryDetails = useSelector(state => state.user.deliveryDetails)

  const [detailsCopy, setDetailsCopy] = useState({
    personalDetails: personalDetails,
    companyDetails: companyDetails,
    invoiceDetails: invoiceDetails,
    deliveryDetails: deliveryDetails
  })


  const updateDetailsCopy = (key, value, form) => {
    setChangesMade(true)

    const newDetailsCopy = {...detailsCopy}
    const formDetailsCopy = {...detailsCopy[form]}
    formDetailsCopy[key] = value
    newDetailsCopy[form] = formDetailsCopy
    setDetailsCopy(newDetailsCopy)
  }


  const resetDetailsCopy = () => {
    setDetailsCopy({
      personalDetails: personalDetails,
      companyDetails: companyDetails,
      invoiceDetails: invoiceDetails,
      deliveryDetails: deliveryDetails
    })
  }


  const saveDetailsCopy = () => {
    console.log("Saving details")
    console.log(detailsCopy)
    const data = {
      personal: detailsCopy.personalDetails,
      company: detailsCopy.companyDetails,
      invoice: detailsCopy.invoiceDetails,
      delivery: detailsCopy.deliveryDetails
    }
    updateProfile(user_id, data)
    setChangesMade(false)
  }


  // only set the details copy when the user details change
  useEffect(() => {
    setDetailsCopy({
      personalDetails: personalDetails,
      companyDetails: companyDetails,
      invoiceDetails: invoiceDetails,
      deliveryDetails: deliveryDetails
    })
  }, [personalDetails, companyDetails, invoiceDetails, deliveryDetails])


  return (
    <div className="flex pb-16 border-0 pt-24 mx-14">
      <div>
        <p className="text-2xl font-bold mb-4">Profile</p>
        <p onClick={() => {setActiveTab("personal")}} className={`${activeTab === "personal" ? "default-tabs-active" : "default-tabs"}`}>Personal Details</p>
        <p onClick={() => {setActiveTab("company")}} className={`${activeTab === "company" ? "default-tabs-active" : "default-tabs"}`}>Company Details</p>
        <p onClick={() => {setActiveTab("invoice")}} className={`${activeTab === "invoice" ? "default-tabs-active" : "default-tabs"}`}>Invoice Details</p>
        <p onClick={() => {setActiveTab("delivery")}} className={`${activeTab === "delivery" ? "default-tabs-active" : "default-tabs"}`}>Delivery Details</p>
      </div>
      
      <div className="flex w-full justify-items-center grid grid-cols-1 gap-10 mt-12 ml-12">
        {activeTab === "personal" && 
          <PersonalForm 
            details={detailsCopy.personalDetails} 
            changesMade={changesMade} 
            setChangesMade={setChangesMade} 
            updateDetails={updateDetailsCopy}
            resetDetails={resetDetailsCopy}
            saveDetails={saveDetailsCopy}
          />
        }
        {activeTab === "company" && 
          <CompanyForm 
            details={detailsCopy.companyDetails}
            changesMade={changesMade} 
            setChangesMade={setChangesMade} 
            updateDetails={updateDetailsCopy}
            resetDetails={resetDetailsCopy}
            saveDetails={saveDetailsCopy} 
          />
        }
        {activeTab === "invoice" && 
          <InvoiceForm 
            details={detailsCopy.invoiceDetails} 
            changesMade={changesMade} 
            setChangesMade={setChangesMade} 
            updateDetails={updateDetailsCopy}
            resetDetails={resetDetailsCopy}
            saveDetails={saveDetailsCopy}
          />
        }
        {activeTab === "delivery" && 
          <DeliveryForm 
            details={detailsCopy.deliveryDetails}
            changesMade={changesMade} 
            setChangesMade={setChangesMade} 
            updateDetails={updateDetailsCopy}
            resetDetails={resetDetailsCopy}
            saveDetails={saveDetailsCopy}
          />
        }
      </div>
    </div>
  )
}