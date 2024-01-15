import React, { useState, useEffect } from 'react';
import { SaveResetButtons } from "../ProfileForms/SaveResetButtons"
import { addWarehouse, updateWarehouse } from '../../api/company';

export const CompanyWarehouseDetails = ({ warehouse_info, company_id, setActiveTab }) => {
  const [originalDetails, setOriginalDetails] = useState({});
  const [editedDetails, setEditedDetails] = useState({});
  const [consignmentStock, setConsignmentStock] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (warehouse_info) {
      setOriginalDetails(warehouse_info);
      setEditedDetails(warehouse_info);
      setConsignmentStock(warehouse_info.consignment_stock || false);
    }
  }, [warehouse_info]);

  const handleCheckboxChange = () => {
    const newConsignmentStockValue = !consignmentStock;
    setConsignmentStock(newConsignmentStockValue);
    setEditedDetails(prevDetails => ({
      ...prevDetails,
      consignment_stock: newConsignmentStockValue
    }));
  };

  const resetButtonHandler = () => {
    setEditedDetails(originalDetails);
    setConsignmentStock(originalDetails.consignment_stock || false);
    setErrors({});
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setEditedDetails(prevDetails => ({
      ...prevDetails,
      [name]: value
    }));
  };

  const validateFields = () => {
    let newErrors = {};
    const requiredFields = ['name', 'mark_up', 'address_1', 'address_2', 'city', 'country', 'pincode'];
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

      editedDetails.company_id = company_id

      if (Object.keys(originalDetails).length === 0 || !originalDetails.name) {
        console.log("adding warehouse")
        response = await addWarehouse(editedDetails);
      } else {
        console.log("updating warehouse")
        console.log(editedDetails.id)
        response = await updateWarehouse(editedDetails);
      }

      setActiveTab("warehouse");
    } catch (error) {
      console.error('Error in user submission:', error);
    }
  };

  return (
    <div className="profile-block" style={{ backgroundColor: 'rgb(220 220 220)' }}>
      <p className="font-semibold text-lg text-black">Warehouse Details</p>
      <div className="flex flex-wrap">
        <div className="flex flex-wrap -mx-4 w-[100%]">
          <div className="flex-1 px-4 mt-4">
            <p className="">Name</p>
            <input name="name" className="default-input w-full mt-1" style={{ borderColor: 'rgb(220 220 220)' }} onChange={handleChange} type="text" required value={editedDetails.name} />
            {errors.name && <p className="text-red-500">{errors.name}</p>}
          </div>

          <div className="flex-1 px-4 mt-4">
            <p className="">Mark Up %</p>
            <input name="mark_up" className="default-input w-full mt-1" style={{ borderColor: 'rgb(220 220 220)' }} onChange={handleChange} type="text" required value={editedDetails.mark_up} />
            {errors.mark_up && <p className="text-red-500">{errors.mark_up}</p>}
          </div>

          <div className="flex-1 px-4 mt-8 flex items-center">
            <div className="flex justify-center items-center gap-8">
              <p className="">Consignment Stock</p>
              <input
                type="checkbox"
                className="form-checkbox h-6 w-6"
                checked={consignmentStock}
                onChange={handleCheckboxChange}
              />
            </div>
          </div>
        </div>


        <div className="w-[100%] mr-8 mt-4">
          <p className="">Address Line 1</p>
          <input name="address_1" className="default-input w-[50%] mt-1" style={{ borderColor: 'rgb(220 220 220)' }} onChange={handleChange} type="text" required value={editedDetails.address_1} />
          {errors.address_1 && <p className="text-red-500">{errors.address_1}</p>}
        </div>

        <div className="w-[100%] mr-8 mt-4">
          <p className="">Address Line 2</p>
          <input name="address_2" className="default-input w-[50%] mt-1" style={{ borderColor: 'rgb(220 220 220)' }} onChange={handleChange} type="text" required value={editedDetails.address_2} />
          {errors.address_2 && <p className="text-red-500">{errors.address_2}</p>}
        </div>

        <div className="flex-1 basis-1/4 mr-8 mt-4">
          <p className="">City</p>
          <input name="city" className="default-input w-[50%] mt-1" style={{ borderColor: 'rgb(220 220 220)' }} onChange={handleChange} type="text" required value={editedDetails.city} />
          {errors.city && <p className="text-red-500">{errors.city}</p>}
        </div>

        <div className="flex-1 basis-1/4 mr-8 mt-4">
          <p className="">Country</p>
          <input name="country" className="default-input w-[50%] mt-1" style={{ borderColor: 'rgb(220 220 220)' }} onChange={handleChange} type="text" required value={editedDetails.country} />
          {errors.country && <p className="text-red-500">{errors.country}</p>}
        </div>

        <div className="flex-1 basis-1/4 mr-8 mt-4">
          <p className="">Zip Code</p>
          <input name="pincode" className="default-input w-[50%] mt-1" style={{ borderColor: 'rgb(220 220 220)' }} onChange={handleChange} type="text" required value={editedDetails.pincode} />
          {errors.pincode && <p className="text-red-500">{errors.pincode}</p>}
        </div>
      </div>

      <div className="flex-1 mt-8 flex items-center justify-between">
        <div></div>
        <div className="flex justify-end">
          <SaveResetButtons
            saveButtonDisabled={JSON.stringify(originalDetails) === JSON.stringify(editedDetails)}
            resetButtonDisabled={JSON.stringify(originalDetails) === JSON.stringify(editedDetails)}
            saveButtonHandler={handleSubmit}
            resetButtonHandler={resetButtonHandler}
          />
        </div>
      </div>
    </div>
  )
}