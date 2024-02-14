import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { updateProfile } from "../api/profileData"
import { getCompanyTypes, getUserRoles, getCompanyTypeInfo } from "../api/company"

import { CompanyList } from "../components/companies/CompanyList"
import { CompanyDetails } from "../components/companies/CompanyDetails"
import { CompanyMembers } from "../components/companies/CompanyMembers"
import { CompanyMemberDetails } from "../components/companies/CompanyMemberDetails"
import { CompanyWarehouse } from "../components/companies/CompanyWarehouse"
import { CompanyWarehouseDetails } from "../components/companies/CompanyWarehouseDetails"

export const Company = () => {
  const [activeTab, setActiveTab] = useState("list")
  const [changesMade, setChangesMade] = useState(false)
  const [viewedCompany, setViewedCompany] = useState(null);
  const [allCompanies, setallCompanies] = useState(null);
  const [companyTypes, setcompanyTypes] = useState(null);
  const [userRoles, setUserRoles] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [warehouseDetails, setWarehouseDetails] = useState(null);
  const user_id = useSelector(state => state.user.user.id)
  const user_role = useSelector(state => state.user.user.role)
  const user = useSelector(state => state.user.user)

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
      console.log(companyTypes)
    } catch (error) {
      console.error('Error fetching company types:', error);
    }
  };

  const fetchCompanyTypeInfo = async (companyId) => {
    try {
      console.log("fetting company type info")
      const response = await getCompanyTypeInfo(companyId);
      setViewedCompany(prevCompany => ({
        ...prevCompany,
        system_mark_up: response.system_mark_up,
        commission: response.commission,
        sales_rep: response.sales_rep
      }));
    } catch (error) {
      console.error('Error fetching company type info:', error);
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

  useEffect(() => {
    if (viewedCompany?.id) {
      fetchCompanyTypeInfo(viewedCompany.id);
    }
  }, [viewedCompany?.id]);

  return (
    <div className="flex border-0 pt-24 mx-14">
      <div>
        <p className="text-2xl font-bold mb-4">Companies</p>
        <p onClick={() => { setActiveTab("list") }} className={`${activeTab === "list" ? "default-tabs-active br-6" : "default-tabs"}`}>Company List</p>
      </div>

      <div className="flex w-full justify-items-center grid grid-cols-1 mt-12 ml-12">
        <div className={`tabs flex w-[80%] ${activeTab !== 'list' ? 'block' : 'hidden'}`}>
          <label
            className={`tab cursor-pointer px-5 py-2 mr-1 inline-block text-black rounded-t-md ${activeTab === 'details' ? 'bg-black text-white shadow-lg' : ''}`}
            onClick={() => { setActiveTab("details") }}>
            Details
          </label>
          {viewedCompany && viewedCompany.id && (
            <label
              className={`tab cursor-pointer px-5 py-2 mr-1 inline-block text-black rounded-t-md ${activeTab === 'members' ? 'bg-black text-white shadow-lg' : ''}`}
              onClick={() => { setActiveTab("members") }}>
              Members
            </label>
          )}
          {viewedCompany && viewedCompany.type_id === 1 && (
            <label
              className={`tab cursor-pointer px-5 py-2 mr-1 inline-block text-black rounded-t-md ${activeTab === 'warehouse' ? 'bg-black text-white shadow-lg' : ''}`}
              onClick={() => { setActiveTab("warehouse") }}>
              Warehouses
            </label>
          )}
        </div>
        {activeTab === "list" &&
          <CompanyList
            setActiveTab={setActiveTab}
            setViewedCompany={setViewedCompany}
            setallCompanies={setallCompanies}
            current_user={{ id: user_id, role: user_role }}
          />
        }
        {activeTab === "details" && viewedCompany &&
          <CompanyDetails
            details={viewedCompany}
            allCompanies={allCompanies}
            companyTypes={companyTypes}
            changesMade={changesMade}
            setActiveTab={setActiveTab}
            setChangesMade={setChangesMade}
            updateDetails={updateDetailsCopy}
            resetDetails={resetDetailsCopy}
            saveDetails={saveDetailsCopy}
            current_user={{ id: user_id, role: user_role }}
          />
        }
        {activeTab === "members" && viewedCompany &&
          <CompanyMembers
            user_details={setUserDetails}
            details={viewedCompany}
            setActiveTab={setActiveTab}
            current_user={{ id: user_id, role: user_role }}
          />
        }
        {activeTab === "member_details" && viewedCompany &&
          <CompanyMemberDetails
            user_info={userDetails}
            roleTypes={userRoles}
            company_id={viewedCompany.id}
            company_type_id={viewedCompany.type_id}
            setActiveTab={setActiveTab}
            current_user={{ id: user_id, role: user_role }}
          />
        }
        {activeTab === "warehouse" && viewedCompany &&
          <CompanyWarehouse
            warehouse_details={setWarehouseDetails}
            details={viewedCompany}
            setActiveTab={setActiveTab}
          />
        }
        {activeTab === "warehouse_details" && viewedCompany &&
          <CompanyWarehouseDetails
            warehouse_info={warehouseDetails}
            company_id={viewedCompany.id}
            setActiveTab={setActiveTab}
          />
        }
      </div>
    </div>
  )
}