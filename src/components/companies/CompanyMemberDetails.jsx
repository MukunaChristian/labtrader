import React, { useState, useEffect } from 'react';
import { SaveResetButtons } from "../ProfileForms/SaveResetButtons"
import { addUser, updateUser, checkUserEmailExists } from '../../api/company';
import { ArrowRightIcon } from "@heroicons/react/20/solid"
import { XMarkIcon } from '@heroicons/react/24/outline';


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
  const [addingEmail, setAddingEmail] = useState('');

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
        sales_rep_commission: user_info.sales_rep_commission,
        email_include: user_info.email_include
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

  const validateFields = async () => {
    let newErrors = {};
    const requiredFields = ['name', 'surname', 'email', 'role_id'];

    for (const field of requiredFields) {
      if (!editedDetails[field]) {
        newErrors[field] = 'This field is required.';
      }
    }

    if (!user_info || (user_info && editedDetails.email !== user_info.email)) {
      try {
        const emailExists = await checkUserEmailExists(editedDetails.email);
        if (emailExists) {
          newErrors.email = 'This email is already in use.';
        }
      } catch (error) {
        console.error("Error during email existence check:", error);
        newErrors.email = 'Error checking email.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const addEmail = (event) => {
    if (event && event.key === 'Enter') {
        console.log('do validate');      
    } else if (event && event.key !== 'Enter') {
      return;
    }

    if (validEmail()) {
      if (editedDetails.email_include) {
        setEditedDetails(prevDetails => ({
          ...prevDetails,
          email_include: [...prevDetails.email_include, addingEmail]
        }));
      } else {
        setEditedDetails(prevDetails => ({
          ...prevDetails,
          email_include: [addingEmail]
        }));
      }
      
      setAddingEmail('');
    }
  }

  const validEmail = () => {
    if (addingEmail === '') return false;
    if (addingEmail.includes('@') && addingEmail.includes('.')) return true;
    return false
  }

  const handleSubmit = async () => {
    let response;
    try {
      const isValid = await validateFields();
      if (!isValid) return;

      editedDetails.company_id = company_id;

      if (Object.keys(originalDetails).length === 0 || !originalDetails.role_id) {
        console.log("adding user")
        response = await addUser(editedDetails);
        console.log(response)
        if (response.data.error) {
          setErrors({...errors, [response.data.field]: response.data.error});
          return
        }
      } else {
        console.log("updating user")
        console.log(editedDetails)
        response = await updateUser(user_info.user_details.id, editedDetails);
      }

      setActiveTab("members");
    } catch (error) {
      console.error('Error in user submission:', error);
    }
  };

  return (
    <div className="profile-block" style={{ backgroundColor: 'rgb(220 220 220)' }}>
      <p className="font-semibold text-lg text-black">User Details</p>
      <div className="flex flex-wrap">
        <div className="flex-1 basis-1/3 mr-8 mt-4">
          <p className="">Name</p>
          <input name="name" className="default-input w-[50%] mt-1" style={{ borderColor: 'rgb(220 220 220)' }} onChange={handleChange} type="text" required value={editedDetails.name || ''} />
          {errors.name && <p className="text-red-500">{errors.name}</p>}
        </div>

        <div className="flex-1 basis-1/3 mr-8 mt-4">
          <p className="">Surname</p>
          <input name="surname" className="default-input w-[50%] mt-1" style={{ borderColor: 'rgb(220 220 220)' }} onChange={handleChange} type="text" required value={editedDetails.surname} />
          {errors.surname && <p className="text-red-500">{errors.surname}</p>}
        </div>

        <div className="flex-1 basis-1/3 mr-8 mt-4">
          <p className="">Email</p>
          <input name="email" className="default-input w-[50%] mt-1" style={{ borderColor: 'rgb(220 220 220)' }} onChange={handleChange} type="text" required value={editedDetails.email} />
          {errors.email && <p className="text-red-500">{errors.email}</p>}
        </div>

        <div className="flex-1 basis-1/3 mr-8 mt-4">
          <p className="">Phone Number</p>
          <input name="phone" className="default-input w-[50%] mt-1" style={{ borderColor: 'rgb(220 220 220)' }} onChange={handleChange} type="text" value={editedDetails.phone} />
        </div>

        <div className="flex-1 basis-1/3 mr-8 mt-4">
          <p className="">Role</p>
          <select name="role_id" className="default-input w-[50%] mt-1" style={{ borderColor: 'rgb(220 220 220)' }} onChange={handleChange} required value={editedDetails.role_id}>
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
              style={{ borderColor: 'rgb(220 220 220)' }}
              onChange={handleChange}
              type="text"
              required
              value={editedDetails.sales_rep_commission || ''}
              disabled={current_user.role == 'Sales Rep'}
            />
            {errors.sales_rep_commission && <p className="text-red-500">{errors.sales_rep_commission}</p>}
          </div>
        )}

        {editedDetails.role_id == 3 && (
          <div className="flex flex-1 basis-1/3 mr-8 mt-4">
            <div className="w-full mr-8">
              <p>CC into emails:</p>
              <div className='flex items-center'>
                <input
                  name="email_include"
                  className="default-input w-full mt-1"
                  style={{ borderColor: 'rgb(220 220 220)' }}
                  onChange={(e) => setAddingEmail(e.target.value)}
                  type="text"
                  value={addingEmail}
                  onKeyDown={addEmail}
                />
                <button className="group rounded-md ml-2 mt-1 bg-grey hover:bg-text" onClick={() => addEmail()}>
                  <ArrowRightIcon className={`group-hover:text-black h-7 w-7 ${!validEmail() && 'text-text'}`} />
                </button>
                
              </div>
              
            </div>
            <div className='w-full'>
              <div className="w-full">Current:</div>
              <div className="w-full">
                {editedDetails.email_include && editedDetails.email_include.map((email, index) => (
                  <div key={index} className='default-input w-full mt-1 bg-white flex justify-between'>
                    <p className='pt-1'>{email}</p>
                    <button className="group rounded-md ml-2 bg-grey h-5 self-center" 
                      onClick={() => setEditedDetails(
                        prevDetails => (
                          {...prevDetails, email_include: prevDetails.email_include.filter((e, i) => i !== index)}
                        )
                      )}
                    >
                      <XMarkIcon className="group-hover:text-black h-5 w-5 text-text" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
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