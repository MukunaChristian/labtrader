import React, { useState, useEffect } from 'react';
import { SaveResetButtons } from "../ProfileForms/SaveResetButtons"
import { addUser, updateUser  } from '../../api/company';

export const CompanyMemberDetails = ({ user_info, roleTypes, company_id, setActiveTab }) => {
  const [originalDetails, setOriginalDetails] = useState({});
  const [editedDetails, setEditedDetails] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    role_id: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user_info) {
      const role = roleTypes.find(type => type.name === user_info.role);
      const userDetails = {
        name: user_info.user_details.name,
        surname: user_info.user_details.surname,
        email: user_info.email,
        phone: user_info.user_details.phone,
        role_id: role ? role.id : ''
      };
      setEditedDetails(userDetails);
      setOriginalDetails(userDetails);
    }
  }, [user_info, roleTypes]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditedDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const validateFields = () => {
    let newErrors = {};
    const requiredFields = ['name', 'surname', 'email', 'phone', 'role_id'];
    for (const field of requiredFields) {
      if (!editedDetails[field]) {
        newErrors[field] = 'This field is required.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    let response;
    try {
      const isValid = validateFields();
      if (!isValid) return;
  
      editedDetails.company_id = company_id;
  
      if (Object.keys(originalDetails).length === 0 || !originalDetails.role_id) {
        console.log("adding user")
        response = await addUser(editedDetails);
      } else {
        console.log("updating user")
        response = await updateUser(user_info.user_details.id, editedDetails);
      }
  
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
          <input name="name" className="default-input w-[50%] mt-1" onChange={handleChange} type="text" required value={editedDetails.name || ''} />
        </div>

        <div className="flex-1 basis-1/3 mr-8 mt-4">
          <p className="">Surname</p>
          {errors.surname && <p className="text-red-500">{errors.surname}</p>}
          <input name="surname" className="default-input w-[50%] mt-1" onChange={handleChange} type="text" required value={editedDetails.surname} />
        </div>

        <div className="flex-1 basis-1/4 mr-8 mt-4">
          <p className="">Email</p>
          {errors.email && <p className="text-red-500">{errors.email}</p>}
          <input name="email" className="default-input w-[50%] mt-1" onChange={handleChange} type="text" required value={editedDetails.email} />
        </div>

        <div className="flex-1 basis-1/4 mr-8 mt-4">
          <p className="">Phone Number</p>
          {errors.phone && <p className="text-red-500">{errors.phone}</p>}
          <input name="phone" className="default-input w-[50%] mt-1" onChange={handleChange} type="text" required value={editedDetails.phone} />
        </div>

        <div className="flex-1 basis-1/4 mr-8 mt-4">
          <p className="">Role</p>
          {errors.role_id && <p className="text-red-500">{errors.role_id}</p>}
          <select name="role_id" className="default-input w-[50%] mt-1" style={{ borderColor: 'black' }} onChange={handleChange} required value={editedDetails.role_id}>
            <option value="">Select a Role</option>
            {roleTypes.map((type, index) => (
              <option key={index} value={type.id}>{type.name}</option>
            ))}
          </select>
        </div>
      </div>

      <SaveResetButtons
        saveButtonDisabled={JSON.stringify(originalDetails) === JSON.stringify(editedDetails)}
        resetButtonDisabled={JSON.stringify(originalDetails) === JSON.stringify(editedDetails)}
        saveButtonHandler={handleSubmit}
        resetButtonHandler={() => setEditedDetails(originalDetails)}
      />

    </div>
  )
}