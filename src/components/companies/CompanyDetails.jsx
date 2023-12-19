import React, { useState } from 'react';
import { SaveResetButtons } from "../ProfileForms/SaveResetButtons"
import { updateCompany, addCompany } from '../../api/company';

export const CompanyDetails = ({ details, allCompanies, companyTypes, changesMade, setChangesMade, resetDetails, saveDetails }) => {
  const [editedDetails, setEditedDetails] = useState({ ...details });
  const [isNewCompany, setIsNewCompany] = useState(!details.id);
  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => {
    let updatedValue = {};
  
    if (name === "company_type") {
      const type = companyTypes.find(type => type.name === value);
      updatedValue = {
        company_type: value,
        type_id: type ? type.id : null
      };
    } else {
      updatedValue = { [name]: value };
    }
  
    setEditedDetails(prevDetails => ({
      ...prevDetails,
      ...updatedValue
    }));
  };

  const isRegistrationNumberUnique = (registrationNumber) => {
    return allCompanies.every(company => company.registration_number !== registrationNumber);
  };

  const validateFields = () => {
    let newErrors = {};
    const requiredFields = ['name', 'registration_number', 'company_type', 'address_1', 'address_2', 'city', 'country', 'pincode', 'email', 'phone_number'];
    for (const field of requiredFields) {
      if (!editedDetails[field]) {
        newErrors[field] = 'This field is required.';
      }
    }

    if (editedDetails.registration_number && !isRegistrationNumberUnique(editedDetails.registration_number)) {
      newErrors.registration_number = 'The registration number must be unique.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    try {
      let response;
      if (isNewCompany) {
        const isValid = validateFields();
        if (!isValid) return;

        response = await addCompany(editedDetails);
        console.log('Company added successfully:', response);
      } else {
        response = await updateCompany(editedDetails);
        console.log('Company updated successfully:', response);
      }
    } catch (error) {
      console.error('Error in company submission:', error);
    }
  };

  return (
    <div className="profile-block">
      <p className="font-semibold text-lg text-black">Company Details</p>
      <div className="flex flex-wrap">
        <div className="flex-1 basis-1/3 mr-8 mt-4">
          <p className="">Company Name</p>
          {errors.name && <p className="text-red-500">{errors.name}</p>}
          <input name="name" onChange={(e) => handleChange(e.target.name, e.target.value, "companyDetails")} value={editedDetails.name} className="default-input w-[50%] mt-1" type="text" required/>
        </div>

        <div className="flex-1 basis-1/3 mr-8 mt-4">
          <p className="">Parent Company</p>
          <select name="parent_company" onChange={(e) => handleChange(e.target.name, e.target.value, "companyDetails")} value={editedDetails.parent_company} className="default-input w-[50%] mt-1" style={{ borderColor: 'black' }}>
            <option value="">Select Parent Company</option>
            {allCompanies.filter(company => company.name !== details.name).map((company, index) => (
              <option key={index} value={company.id}>{company.name}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 basis-1/4 mr-8 mt-4">
          <p className="">Registration Number</p>
          {errors.registration_number && <p className="text-red-500">{errors.registration_number}</p>}
          <input name="registration_number" onChange={(e) => handleChange(e.target.name, e.target.value, "companyDetails")} value={editedDetails.registration_number} className="default-input w-[50%] mt-1" type="text" required/>
        </div>

        <div className="flex-1 basis-1/4 mr-8 mt-4">
          <p className="">Company Type</p>
          {errors.company_type && <p className="text-red-500">{errors.company_type}</p>}
          <select name="company_type" onChange={(e) => handleChange(e.target.name, e.target.value, "companyDetails")} value={editedDetails.company_type} className="default-input w-[50%] mt-1" style={{ borderColor: 'black' }} required>
            <option value="">Select Company Type</option>
            {companyTypes.map((type, index) => (
              <option key={index} value={type.name}>{type.name}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 basis-1/4 mr-8 mt-4 relative">
          <p className="">Discount Percentage</p>
          <input name="discount_percent" value={editedDetails.discount_percent+'%'} className="default-input w-[50%] mt-1 pl-2" type="text" disabled/>
        </div>

        <div className="w-[100%] mr-8 mt-4">
          <p className="">Address Line 1</p>
          {errors.address_1 && <p className="text-red-500">{errors.address_1}</p>}
          <input name="address_1" onChange={(e) => handleChange(e.target.name, e.target.value, "companyDetails")} value={editedDetails.address_1} className="default-input w-[50%] mt-1" type="text" required/>
        </div>

        <div className="w-[100%] mr-8 mt-4">
          <p className="">Address Line 2</p>
          {errors.address_2 && <p className="text-red-500">{errors.address_2}</p>}
          <input name="address_2" onChange={(e) => handleChange(e.target.name, e.target.value, "companyDetails")} value={editedDetails.address_2} className="default-input w-[50%] mt-1" type="text" required/>
        </div>

        <div className="flex-1 basis-1/4 mr-8 mt-4">
          <p className="">City</p>
          {errors.city && <p className="text-red-500">{errors.city}</p>}
          <input name="city" onChange={(e) => handleChange(e.target.name, e.target.value, "companyDetails")} value={editedDetails.city} className="default-input w-[50%] mt-1" type="text" required/>
        </div>

        <div className="flex-1 basis-1/4 mr-8 mt-4">
          <p className="">Country</p>
          {errors.country && <p className="text-red-500">{errors.country}</p>}
          <input name="country" onChange={(e) => handleChange(e.target.name, e.target.value, "companyDetails")} value={editedDetails.country} className="default-input w-[50%] mt-1" type="text" required/>
        </div>

        <div className="flex-1 basis-1/4 mr-8 mt-4">
          <p className="">Zip Code</p>
          {errors.pincode && <p className="text-red-500">{errors.pincode}</p>}
          <input name="pincode" onChange={(e) => handleChange(e.target.name, e.target.value, "companyDetails")} value={editedDetails.pincode} className="default-input w-[50%] mt-1" type="text" required/>
        </div>

        <div className="flex-1 basis-1/3 mr-8 mt-4">
          <p className="">Email</p>
          {errors.email && <p className="text-red-500">{errors.email}</p>}
          <input name="email" onChange={(e) => handleChange(e.target.name, e.target.value, "companyDetails")} value={editedDetails.email} className="default-input w-[50%] mt-1" type="text" required/>
        </div>

        <div className="flex-1 basis-1/3 mr-8 mt-4">
          <p className="">Phone Number</p>
          {errors.phone_number && <p className="text-red-500">{errors.phone_number}</p>}
          <input name="phone_number" onChange={(e) => handleChange(e.target.name, e.target.value, "companyDetails")} value={editedDetails.phone_number} className="default-input w-[50%] mt-1" type="text" required/>
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