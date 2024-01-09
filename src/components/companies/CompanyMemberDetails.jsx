import React, { useState, useEffect } from 'react';
import { SaveResetButtons } from "../ProfileForms/SaveResetButtons"
import { addUser, updateUser } from '../../api/company';

export const CompanyMemberDetails = ({ user_info, roleTypes, company_id, company_type_id, setActiveTab, current_user }) => {
  const [originalDetails, setOriginalDetails] = useState({});
  const [editedDetails, setEditedDetails] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    role_id: ''
  });
  const [errors, setErrors] = useState({});

  const getFilteredRoleTypes = () => {
    switch (company_type_id) {
      case 1: // Supplier
        return roleTypes.filter(type => type.name === 'Superadmin' || type.name === 'Admin');
      case 2: // Reseller
        return roleTypes.filter(type => type.name === 'Admin' || type.name === 'Sales Rep');
      case 3: // Jeweller
        return roleTypes.filter(type => type.name === 'Admin' || type.name === 'Buyer');
      default:
        return roleTypes;
    }
  };

  const filteredRoleTypes = getFilteredRoleTypes();

  useEffect(() => {
    if (user_info) {
      const role = roleTypes.find(type => type.name === user_info.role);
      const userDetails = {
        name: user_info.user_details.name,
        surname: user_info.user_details.surname,
        email: user_info.email,
        phone: user_info.user_details.phone,
        active: user_info.active,
        role_id: role ? role.id : '',
        sales_rep_commission: user_info.sales_rep_commission
      };
      setEditedDetails(userDetails);
      setOriginalDetails(userDetails);
    }
  }, [user_info, roleTypes]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setEditedDetails(prevDetails => ({
      ...prevDetails,
      [name]: type === 'checkbox' ? checked : value
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
          <input name="name" className="default-input w-[50%] mt-1" onChange={handleChange} type="text" required value={editedDetails.name || ''} />
          {errors.name && <p className="text-red-500">{errors.name}</p>}
        </div>

        <div className="flex-1 basis-1/3 mr-8 mt-4">
          <p className="">Surname</p>
          <input name="surname" className="default-input w-[50%] mt-1" onChange={handleChange} type="text" required value={editedDetails.surname} />
          {errors.surname && <p className="text-red-500">{errors.surname}</p>}
        </div>

        <div className="flex-1 basis-1/3 mr-8 mt-4">
          <p className="">Email</p>
          <input name="email" className="default-input w-[50%] mt-1" onChange={handleChange} type="text" required value={editedDetails.email} />
          {errors.email && <p className="text-red-500">{errors.email}</p>}
        </div>

        <div className="flex-1 basis-1/3 mr-8 mt-4">
          <p className="">Phone Number</p>
          <input name="phone" className="default-input w-[50%] mt-1" onChange={handleChange} type="text" required value={editedDetails.phone} />
          {errors.phone && <p className="text-red-500">{errors.phone}</p>}
        </div>

        <div className="flex-1 basis-1/3 mr-8 mt-4">
          <p className="">Role</p>
          <select name="role_id" className="default-input w-[50%] mt-1" style={{ borderColor: 'black' }} onChange={handleChange} required value={editedDetails.role_id}>
            <option value="">Select a Role</option>
            {filteredRoleTypes.map((type, index) => (
              <option key={index} value={type.id}>{type.name}</option>
            ))}
          </select>
          {errors.role_id && <p className="text-red-500">{errors.role_id}</p>}
        </div>

        {editedDetails.role_id == 3 && (
          <div className="flex-1 basis-1/3 mr-8 mt-4">
            <p className="">Commission %</p>
            <input
              name="sales_rep_commission"
              className="default-input w-[50%] mt-1"
              onChange={handleChange}
              type="text"
              required
              value={editedDetails.sales_rep_commission || ''}
              disabled={current_user.role == 'Sales Rep'}
            />
            {errors.sales_rep_commission && <p className="text-red-500">{errors.sales_rep_commission}</p>}
          </div>
        )}
      </div>

      <div className="flex-1 mt-8 flex items-center justify-between">
        <div className="flex justify-center items-center gap-8">
          <p className="">Active</p>
          <input
            type="checkbox"
            name="active"
            className="form-checkbox h-6 w-6"
            checked={editedDetails.active !== false}
            onChange={handleChange}
          />
        </div>

        <div className="flex justify-end">
          <SaveResetButtons
            saveButtonDisabled={JSON.stringify(originalDetails) === JSON.stringify(editedDetails)}
            resetButtonDisabled={JSON.stringify(originalDetails) === JSON.stringify(editedDetails)}
            saveButtonHandler={handleSubmit}
            resetButtonHandler={() => {
              setEditedDetails(originalDetails);
              setErrors({});
            }}
          />
        </div>
      </div>
    </div>
  )
}