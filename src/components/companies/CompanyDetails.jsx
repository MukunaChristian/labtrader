import React, { useState, useEffect } from 'react';
import { SaveResetButtons } from "../ProfileForms/SaveResetButtons"
import { updateCompany, addCompany, getSalesReps } from '../../api/company';

export const CompanyDetails = ({ details, allCompanies, companyTypes, changesMade, setActiveTab, setChangesMade, resetDetails, saveDetails, current_user }) => {
  const [editedDetails, setEditedDetails] = useState({ ...details });
  const [isNewCompany, setIsNewCompany] = useState(!details.id);
  const [salesReps, setSalesReps] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchSalesReps();
    setEditedDetails({ ...details });
  }, [details, current_user]);

  const handleChange = (name, value) => {
    let updatedValue = {};

    if (name === "company_type") {
      if (current_user.role === 'Sales Rep' && name === 'company_type') {
        return;
      }

      const type = companyTypes.find(type => type.name === value);
      if (value === details.company_type) {
        updatedValue = {
          company_type: value,
          type_id: type ? type.id : null,
          system_mark_up: details.system_mark_up,
          commission: details.commission,
          sales_rep: details.sales_rep
        };
      } else {
        updatedValue = {
          company_type: value,
          type_id: type ? type.id : null,
          system_mark_up: null,
          commission: null,
          sales_rep: null
        };
      }
    } else {
      updatedValue = { [name]: value };
    }

    setEditedDetails(prevDetails => ({
      ...prevDetails,
      ...updatedValue
    }));
  };

  const isRegistrationNumberUnique = (registrationNumber) => {
    if (!isNewCompany) {
      return allCompanies.every(company => 
        company.registration_number !== registrationNumber || company.id === editedDetails.id
      );
    }
    return allCompanies.every(company => company.registration_number !== registrationNumber);
  };

  const fetchSalesReps = async () => {
    try {
      const reps = await getSalesReps();
      setSalesReps(reps);
    } catch (error) {
      console.error('Error fetching sales reps:', error);
    }
  };

  const validateFields = () => {
    let newErrors = {};
    const requiredFields = ['name', 'company_type', 'address_1', 'address_2', 'city', 'country', 'pincode', 'email', 'phone_number'];
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
      const isValid = validateFields();
      if (!isValid) return;

      console.log(editedDetails)

      if (isNewCompany) {
        response = await addCompany(editedDetails);
        console.log('Company added successfully:', response);
        setActiveTab("list");
      } else {
        response = await updateCompany(editedDetails);
        console.log('Company updated successfully:', response);
        setActiveTab("list");
        details = editedDetails
      }
    } catch (error) {
      console.error('Error in company submission:', error);
    }
  };

  return (
    <div className="profile-block" style={{ backgroundColor: 'rgb(220 220 220)' }}>
      <div className="flex flex-wrap">
        <div className="flex flex-col md:flex-row w-full">
          <div className="flex-1 basis-1/3 mr-8">
            <p className="">Company Name</p>
            <input name="name" onChange={(e) => handleChange(e.target.name, e.target.value, "companyDetails")} value={editedDetails.name} className="default-input w-[50%] mt-1" type="text" style={{ borderColor: 'rgb(220 220 220)' }} required/>
            {errors.name && <p className="text-red-500">{errors.name}</p>}
          </div>

          <div className="flex-1 basis-1/3 mr-8">
            <p className="">Parent Company</p>
            <select name="parent_company" onChange={(e) => handleChange(e.target.name, e.target.value, "companyDetails")} value={editedDetails.parent_company} className="default-input w-[50%] mt-1" style={{ borderColor: 'rgb(220 220 220)' }} disabled={current_user.role !== 'Superadmin'}>
              <option value="">Select Parent Company</option>
              {allCompanies.filter(company => company.name !== details.name).map((company, index) => (
                <option key={index} value={company.id}>{company.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex-1 basis-1/3 mr-8 mt-4">
          <p className="">Registration Number</p>
          <input name="registration_number" onChange={(e) => handleChange(e.target.name, e.target.value, "companyDetails")} value={editedDetails.registration_number} className="default-input w-[50%] mt-1" type="text" style={{ borderColor: 'rgb(220 220 220)' }} required/>
          {errors.registration_number && <p className="text-red-500">{errors.registration_number}</p>}
        </div>

        <div className="flex-1 basis-1/3 mr-8 mt-4">
          <p className="">Vat Number</p>
          <input name="vat_number" onChange={(e) => handleChange(e.target.name, e.target.value, "companyDetails")} value={editedDetails.vat_number} className="default-input w-[50%] mt-1" type="text" style={{ borderColor: 'rgb(220 220 220)' }} required/>
          {errors.vat_number && <p className="text-red-500">{errors.vat_number}</p>}
        </div>

        <div className="flex-1 basis-1/3 mr-8 mt-4">
          <p className="">Company Type</p>
          <select name="company_type" onChange={(e) => handleChange(e.target.name, e.target.value, "companyDetails")} value={editedDetails.company_type} className="default-input w-[50%] mt-1" style={{ borderColor: 'rgb(220 220 220)' }} disabled={current_user.role == 'Sales Rep' || current_user.role == 'Admin'} required>
            <option value="">Select Company Type</option>
            {companyTypes?.length > 0 ? (
              companyTypes.map((type, index) => (
                <option key={index} value={type.name}>{type.name}</option>
              ))) : (
              console.log("")
            )}
          </select>
          {errors.company_type && <p className="text-red-500">{errors.company_type}</p>}
        </div>

        {editedDetails.company_type === 'Supplier' && (
          <div className="flex-1 basis-1/3 mr-8 mt-4">
            <p className="">System Mark-Up %</p>
            <input
              name="system_mark_up"
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              style={{ borderColor: 'rgb(220 220 220)' }}
              value={editedDetails.system_mark_up}
              className="default-input w-[50%] mt-1"
              type="text"
            />
          </div>
        )}

        {editedDetails.company_type === 'Reseller' && (
          <div className="flex-1 basis-1/3 mr-8 mt-4">
            <p className="">Commission %</p>
            <input
              name="commission"
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              style={{ borderColor: 'rgb(220 220 220)' }}
              value={editedDetails.commission}
              className={`default-input w-[50%] mt-1`}
              type="text"
              disabled={current_user.role !== 'Superadmin'}
            />
          </div>
        )}

        {editedDetails.company_type === 'Jeweller' && (
          <div className="flex-1 basis-1/3 mr-8 mt-4">
            <p className="">Sales Rep</p>
            <select
              name="sales_rep"
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              value={editedDetails.sales_rep || ''}
              style={{ borderColor: 'rgb(220 220 220)' }}
              className="default-input w-[50%] mt-1"
              disabled={current_user.role == 'Sales Rep'}
            >
              <option value="">Select Sales Rep</option>
              {salesReps.map((rep, index) => (
                <option key={index} value={rep.id}>{rep.user_details.name}</option>
              ))}
            </select>
          </div>
        )}

        <div className="w-[100%] mr-8 mt-4">
          <p className="">Address Line 1</p>
          <input name="address_1" onChange={(e) => handleChange(e.target.name, e.target.value, "companyDetails")} value={editedDetails.address_1} className="default-input w-[50%] mt-1" type="text" style={{ borderColor: 'rgb(220 220 220)' }} required/>
          {errors.address_1 && <p className="text-red-500">{errors.address_1}</p>}
        </div>

        <div className="w-[100%] mr-8 mt-4">
          <p className="">Address Line 2</p>
          <input name="address_2" onChange={(e) => handleChange(e.target.name, e.target.value, "companyDetails")} value={editedDetails.address_2} className="default-input w-[50%] mt-1" type="text" style={{ borderColor: 'rgb(220 220 220)' }} required/>
          {errors.address_2 && <p className="text-red-500">{errors.address_2}</p>}
        </div>

        <div className="flex-1 basis-1/4 mr-8 mt-4">
          <p className="">City</p>
          <input name="city" onChange={(e) => handleChange(e.target.name, e.target.value, "companyDetails")} value={editedDetails.city} className="default-input w-[50%] mt-1" type="text" style={{ borderColor: 'rgb(220 220 220)' }} required/>
          {errors.city && <p className="text-red-500">{errors.city}</p>}
        </div>

        <div className="flex-1 basis-1/4 mr-8 mt-4">
          <p className="">Country</p>
          <input name="country" onChange={(e) => handleChange(e.target.name, e.target.value, "companyDetails")} value={editedDetails.country} className="default-input w-[50%] mt-1" type="text" style={{ borderColor: 'rgb(220 220 220)' }} required/>
          {errors.country && <p className="text-red-500">{errors.country}</p>}
        </div>

        <div className="flex-1 basis-1/4 mr-8 mt-4">
          <p className="">Zip Code</p>
          <input name="pincode" onChange={(e) => handleChange(e.target.name, e.target.value, "companyDetails")} value={editedDetails.pincode} className="default-input w-[50%] mt-1" type="text" style={{ borderColor: 'rgb(220 220 220)' }} required/>
          {errors.pincode && <p className="text-red-500">{errors.pincode}</p>}
        </div>

        <div className="flex-1 basis-1/3 mr-8 mt-4">
          <p className="">Email</p>
          <input name="email" onChange={(e) => handleChange(e.target.name, e.target.value, "companyDetails")} value={editedDetails.email} className="default-input w-[50%] mt-1" type="text" style={{ borderColor: 'rgb(220 220 220)' }} required />
          {errors.email && <p className="text-red-500">{errors.email}</p>}
        </div>

        <div className="flex-1 basis-1/3 mr-8 mt-4">
          <p className="">Phone Number</p>
          <input name="phone_number" onChange={(e) => handleChange(e.target.name, e.target.value, "companyDetails")} value={editedDetails.phone_number} className="default-input w-[50%] mt-1" type="text" style={{ borderColor: 'rgb(220 220 220)' }} required />
          {errors.phone_number && <p className="text-red-500">{errors.phone_number}</p>}
        </div>
      </div>

      <div className="flex-1 mt-8 flex items-center justify-between">
        <div className="flex justify-center items-center gap-8">
          <p className="">Active</p>
          <input
            type="checkbox"
            className="form-checkbox h-6 w-6"
            checked={editedDetails.active !== false}
            onChange={(e) => handleChange('active', e.target.checked)}
            disabled={current_user.role == 'Admin'}
          />
        </div>

        <div className="flex justify-end">
          <SaveResetButtons
            saveButtonDisabled={JSON.stringify(details) === JSON.stringify(editedDetails)}
            resetButtonDisabled={JSON.stringify(details) === JSON.stringify(editedDetails)}
            saveButtonHandler={handleSubmit}
            resetButtonHandler={() => {
              setEditedDetails(details);
              setErrors({});
            }}
          />
        </div>
      </div>
    </div>
  )
}