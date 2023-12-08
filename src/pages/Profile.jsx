import { useState } from "react"
import { PersonalForm } from "../components/ProfileForms/PersonalForm"
import { CompanyForm } from "../components/ProfileForms/CompanyForm"
import { InvoiceForm } from "../components/ProfileForms/InvoiceForm"
import { DeliveryForm } from "../components/ProfileForms/DeliveryForm"

export const Profile = () => {
  const [activeTab, setActiveTab] = useState("personal")


  return (
    <div className="flex pb-16 border-0 pt-24 h-full mx-14">
      <div>
        <p className="text-2xl font-bold mb-4">Profile</p>
        <p onClick={() => {setActiveTab("personal")}} className={`${activeTab === "personal" ? "default-tabs-active" : "default-tabs"}`}>Personal Details</p>
        <p onClick={() => {setActiveTab("company")}} className={`${activeTab === "company" ? "default-tabs-active" : "default-tabs"}`}>Company Details</p>
        <p onClick={() => {setActiveTab("invoice")}} className={`${activeTab === "invoice" ? "default-tabs-active" : "default-tabs"}`}>Invoice Details</p>
        <p onClick={() => {setActiveTab("delivery")}} className={`${activeTab === "delivery" ? "default-tabs-active" : "default-tabs"}`}>Delivery Details</p>
      </div>
      
      <div className="flex justify-items-center grid grid-cols-1 gap-10 mt-8 ml-24">
        {activeTab === "personal" && <PersonalForm />}
        {activeTab === "company" && <CompanyForm />}
        {activeTab === "invoice" && <InvoiceForm />}
        {activeTab === "delivery" && <DeliveryForm />}
      </div>
    </div>
  )
}