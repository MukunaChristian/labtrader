import React, { useState } from 'react';
import { SaveResetButtons } from "../ProfileForms/SaveResetButtons"
import { updateCompany } from '../../api/company';

export const CompanyDetails = ({ details, allCompanies, changesMade, setChangesMade, resetDetails, saveDetails }) => {
  const [editedDetails, setEditedDetails] = useState({ ...details });

  const handleChange = (name, value) => {
    setEditedDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
    console.log(value)
  };

  const handleSubmit = async () => {
    try {
      const updatedCompany = await updateCompany(editedDetails);
      console.log('Company updated successfully:', updatedCompany);
    } catch (error) {
      console.error('Error updating company:', error);
    }
  };

  return (
    <div className="profile-block">
      <p className="font-semibold text-lg text-black">Company Details</p>
      <div className="flex flex-wrap">
        <div className="flex-1 basis-1/3 mr-8 mt-4">
          <p className="">Company Name</p>
          <input name="name" onChange={(e) => handleChange(e.target.name, e.target.value, "companyDetails")} value={editedDetails.name} className="default-input w-[50%] mt-1" type="text" />
        </div>

        <div className="flex-1 basis-1/3 mr-8 mt-4">
          <p className="">Parent Company</p>
          <select
            name="parent_company"
            onChange={(e) => handleChange(e.target.name, e.target.value, "companyDetails")}
            value={editedDetails.parent_company}
            className="default-input w-[50%] mt-1"
            style={{ borderColor: 'black' }}
          >
            <option value="">Select Parent Company</option>
            {allCompanies.filter(company => company.name !== details.name).map((company, index) => (
              <option key={index} value={company.id}>{company.name}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 basis-1/4 mr-8 mt-4">
          <p className="">Registration Number</p>
          <input name="registration_number" onChange={(e) => handleChange(e.target.name, e.target.value, "companyDetails")} value={editedDetails.registration_number} className="default-input w-[50%] mt-1" type="text" />
        </div>

        <div className="flex-1 basis-1/4 mr-8 mt-4">
          <p className="">Company Type</p>
          <input name="company_type" onChange={(e) => handleChange(e.target.name, e.target.value, "companyDetails")} value={editedDetails.company_type} className="default-input w-[50%] mt-1" type="text" />
        </div>

        <div className="flex-1 basis-1/4 mr-8 mt-4 relative">
          <p className="">Discount Percentage</p>
          <input name="discount_percent" onChange={(e) => handleChange(e.target.name, e.target.value, "companyDetails")} value={editedDetails.discount_percent} className="default-input w-[50%] mt-1 pl-2" type="text"/>
        </div>

        <div className="w-[100%] mr-8 mt-4">
          <p className="">Address Line 1</p>
          <input name="address_1" onChange={(e) => handleChange(e.target.name, e.target.value, "companyDetails")} value={editedDetails.address_1} className="default-input w-[50%] mt-1" type="text" />
        </div>

        <div className="w-[100%] mr-8 mt-4">
          <p className="">Address Line 2</p>
          <input name="address_2" onChange={(e) => handleChange(e.target.name, e.target.value, "companyDetails")} value={editedDetails.address_2} className="default-input w-[50%] mt-1" type="text" />
        </div>

        <div className="flex-1 basis-1/4 mr-8 mt-4">
          <p className="">City</p>
          <input name="city" onChange={(e) => handleChange(e.target.name, e.target.value, "companyDetails")} value={editedDetails.city} className="default-input w-[50%] mt-1" type="text" />
        </div>

        <div className="flex-1 basis-1/4 mr-8 mt-4">
          <p className="">Country</p>
          <input name="country" onChange={(e) => handleChange(e.target.name, e.target.value, "companyDetails")} value={editedDetails.country} className="default-input w-[50%] mt-1" type="text" />
        </div>

        <div className="flex-1 basis-1/4 mr-8 mt-4">
          <p className="">Zip Code</p>
          <input name="pincode" onChange={(e) => handleChange(e.target.name, e.target.value, "companyDetails")} value={editedDetails.pincode} className="default-input w-[50%] mt-1" type="text" />
        </div>

        <div className="flex-1 basis-1/3 mr-8 mt-4">
          <p className="">Email</p>
          <input name="email" onChange={(e) => handleChange(e.target.name, e.target.value, "companyDetails")} value={editedDetails.email} className="default-input w-[50%] mt-1" type="text" />
        </div>

        <div className="flex-1 basis-1/3 mr-8 mt-4">
          <p className="">Phone Number</p>
          <input name="phone_number" onChange={(e) => handleChange(e.target.name, e.target.value, "companyDetails")} value={editedDetails.phone_number} className="default-input w-[50%] mt-1" type="text" />
        </div>
      </div>

      <SaveResetButtons
        saveButtonDisabled={JSON.stringify(details) === JSON.stringify(editedDetails)}
        resetButtonDisabled={JSON.stringify(details) === JSON.stringify(editedDetails)}
        saveButtonHandler={handleSubmit}
        resetButtonHandler={() => setEditedDetails(details)}
      />

    </div>
  )
}