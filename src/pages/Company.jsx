import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { updateProfile } from "../api/profileData"
import { getCompanyTypes, getUserRoles } from "../api/company"

import { CompanyList } from "../components/companies/CompanyList"
import { CompanyDetails } from "../components/companies/CompanyDetails"
import { CompanyMembers } from "../components/companies/CompanyMembers"
import { CompanyMemberDetails } from "../components/companies/CompanyMemberDetails"

export const Company = () => {
  const [activeTab, setActiveTab] = useState("list")
  const [changesMade, setChangesMade] = useState(false)
  const [viewedCompany, setViewedCompany] = useState(null);
  const [allCompanies, setallCompanies] = useState(null);
  const [companyTypes, setcompanyTypes] = useState(null);
  const [userRoles, setUserRoles] = useState(null);
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

    const newDetailsCopy = { ...detailsCopy }
    const formDetailsCopy = { ...detailsCopy[form] }
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

  const fetchCompanyTypes = async () => {
    try {
      const companyTypes = await getCompanyTypes();
      setcompanyTypes(companyTypes);
    } catch (error) {
      console.error('Error fetching company types:', error);
    }
  };

  const fetchUserRoles = async () => {
    try {
      const userRoles = await getUserRoles();
      setUserRoles(userRoles);
    } catch (error) {
      console.error('Error fetching company types:', error);
    }
  };

  useEffect(() => {
    setDetailsCopy({
      personalDetails: personalDetails,
      companyDetails: companyDetails,
      invoiceDetails: invoiceDetails
    })
    fetchCompanyTypes();
    fetchUserRoles();
  }, [personalDetails, companyDetails, invoiceDetails])


  return (
    <div className="flex pb-16 border-0 pt-24 px-14 bg-light-grey">
      <div>
        <p className="text-2xl font-bold mb-4">Companies</p>
        <p onClick={() => { setActiveTab("list") }} className={`${activeTab === "list" ? "default-tabs-active" : "default-tabs"}`}>Company List</p>
        <p onClick={() => { activeTab === "list" ? null : setActiveTab("details") }} className={`${activeTab === "details" ? "default-tabs-active" : "default-tabs"} ${activeTab === "list" ? "non-clickable-tab" : ""}`}>Company Details</p>
        <p onClick={() => { activeTab === "list" ? null : setActiveTab("members") }} className={`${activeTab === "members" ? "default-tabs-active" : "default-tabs"} ${activeTab === "list" ? "non-clickable-tab" : ""}`}>Company Users</p>
      </div>

      <div className="flex w-full justify-items-center grid grid-cols-1 gap-10 mt-12 ml-12 ">
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
            companyTypes={companyTypes}
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
            setActiveTab={setActiveTab}
          />
        }
        {activeTab === "member_details" && viewedCompany &&
          <CompanyMemberDetails
            roleTypes={userRoles}
            company_id={viewedCompany.id}
            setActiveTab={setActiveTab}
          />
        }
      </div>
    </div>
  )
}