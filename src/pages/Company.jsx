import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { updateProfile } from "../api/profileData"

import { CompanyList } from "../components/companies/CompanyList"
import { CompanyDetails } from "../components/companies/CompanyDetails"
import { CompanyMembers } from "../components/companies/CompanyMembers"

export const Company = () => {
  const [activeTab, setActiveTab] = useState("list")
  const [changesMade, setChangesMade] = useState(false)
  const [viewedCompany, setViewedCompany] = useState(null);
  const [allCompanies, setallCompanies] = useState(null);
  const user_id = useSelector(state => state.user.user.id)

  const personalDetails = useSelector(state => state.user.userDetails)
  const companyDetails = useSelector(state => state.user.companyDetails)
  const invoiceDetails = useSelector(state => state.user.invoiceDetails)

  const [detailsCopy, setDetailsCopy] = useState({
    personalDetails: personalDetails,
    companyDetails: companyDetails,
    invoiceDetails: invoiceDetails
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
      invoiceDetails: invoiceDetails
    })
  }

  const saveDetailsCopy = () => {
    console.log("Saving details")
    console.log(detailsCopy)
    const data = {
      personal: detailsCopy.personalDetails,
      company: detailsCopy.companyDetails,
      invoice: detailsCopy.invoiceDetails
    }
    updateProfile(user_id, data)
    setChangesMade(false)
  }

  useEffect(() => {
    setDetailsCopy({
      personalDetails: personalDetails,
      companyDetails: companyDetails,
      invoiceDetails: invoiceDetails
    })
  }, [personalDetails, companyDetails, invoiceDetails])


  return (
    <div className="flex pb-16 border-0 pt-24 h-full mx-14">
      <div>
        <p className="text-2xl font-bold mb-4">Companies</p>
        <p onClick={() => {setActiveTab("list")}} className={`${activeTab === "list" ? "default-tabs-active" : "default-tabs"}`}>Company List</p>
        <p onClick={() => {activeTab === "list" ? null : setActiveTab("details")}} className={`${activeTab === "details" ? "default-tabs-active" : "default-tabs"} ${activeTab === "list" ? "non-clickable-tab" : ""}`}>Company Details</p>
        <p onClick={() => {activeTab === "list" ? null : setActiveTab("members")}} className={`${activeTab === "members" ? "default-tabs-active" : "default-tabs"} ${activeTab === "list" ? "non-clickable-tab" : ""}`}>Company Users</p>
      </div>
      
      <div className="flex w-full justify-items-center grid grid-cols-1 gap-10 mt-12 ml-12">
        {activeTab === "list" && 
          <CompanyList 
            setActiveTab={setActiveTab}
            setViewedCompany={setViewedCompany}
            setallCompanies={setallCompanies}
          />
        }
        {activeTab === "details" && viewedCompany &&
          <CompanyDetails 
            details={viewedCompany}
            allCompanies={allCompanies}
            changesMade={changesMade} 
            setChangesMade={setChangesMade} 
            updateDetails={updateDetailsCopy}
            resetDetails={resetDetailsCopy}
            saveDetails={saveDetailsCopy}
          />
        }
        {activeTab === "members" && viewedCompany &&
          <CompanyMembers 
            details={viewedCompany}
          />
        }
      </div>
    </div>
  )
}