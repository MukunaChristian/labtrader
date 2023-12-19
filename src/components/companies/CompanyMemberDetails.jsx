import React, { useState } from 'react';
import { SaveResetButtons } from "../ProfileForms/SaveResetButtons"
import { addUser } from '../../api/company';

export const CompanyMemberDetails = ({ roleTypes, company_id, setActiveTab }) => {
  const [editedDetails, setEditedDetails] = useState({});
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditedDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
  };

  // const isEmailUnique = (email) => {
  //   return allUsers.every(user => user.email !== email);
  // };

  const validateFields = () => {
    let newErrors = {};
    const requiredFields = ['name', 'surname', 'email', 'phone_number', 'role_id']; // company_id
    for (const field of requiredFields) {
      if (!editedDetails[field]) {
        newErrors[field] = 'This field is required.';
      }
    }

    // if (editedDetails.email && !isEmailUnique(editedDetails.email)) {
    //   newErrors.email = 'The email must be unique.';
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    let response;
    try {
      const isValid = validateFields();
      if (!isValid) return;

      editedDetails.company_id = company_id

      response = await addUser(editedDetails); 
      setActiveTab("members");
    } catch (error) {
      console.error('Error in user submission:', error);
    }
  };

  return (
    <div className="profile-block">
      <p className="font-semibold text-lg text-black">User Details</p>
      <div className="flex flex-wrap">
        <div className="flex-1 basis-1/3 mr-8 mt-4">
          <p className="">Name</p>
          {errors.name && <p className="text-red-500">{errors.name}</p>}
          <input name="name" className="default-input w-[50%] mt-1" onChange={handleChange} type="text" required/>
        </div>

        <div className="flex-1 basis-1/3 mr-8 mt-4">
          <p className="">Surname</p>
          {errors.surname && <p className="text-red-500">{errors.surname}</p>}
          <input name="surname" className="default-input w-[50%] mt-1" onChange={handleChange} type="text" required/>
        </div>

        <div className="flex-1 basis-1/4 mr-8 mt-4">
          <p className="">Email</p>
          {errors.email && <p className="text-red-500">{errors.email}</p>}
          <input name="email" className="default-input w-[50%] mt-1" onChange={handleChange} type="text" required/>
        </div>

        <div className="flex-1 basis-1/4 mr-8 mt-4">
          <p className="">Phone Number</p>
          {errors.phone_number && <p className="text-red-500">{errors.phone_number}</p>}
          <input name="phone_number" className="default-input w-[50%] mt-1" onChange={handleChange} type="text" required/>
        </div>

        <div className="flex-1 basis-1/4 mr-8 mt-4">
          <p className="">Role</p>
          {errors.role_id && <p className="text-red-500">{errors.role_id}</p>}
          <select name="role_id" className="default-input w-[50%] mt-1" style={{ borderColor: 'black' }} onChange={handleChange} required>
            <option value="">Select a Role</option>
            {roleTypes.map((type, index) => (
              <option key={index} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>
      </div>

      <SaveResetButtons
        saveButtonDisabled={JSON.stringify('') === JSON.stringify(editedDetails)}
        resetButtonDisabled={JSON.stringify('') === JSON.stringify(editedDetails)}
        saveButtonHandler={handleSubmit}
        resetButtonHandler={() => setEditedDetails('')}
      />

    </div>
  )
}