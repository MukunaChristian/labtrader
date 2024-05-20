import React, { useState } from "react";
import ConfirmationModal from "./ConfirmationModal";


const AddressForm = () => {

  const [formData, setFormData] = useState({
    recipientName: "",
    recipientPhone: "",
    streetAddress: "",
    building: "",
    suburb: "",
    city: "",
    province: "",
    postalCode: "",
  });


  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddressSubmit = () => {
    if (!formData.recipientName || !formData.recipientPhone || !formData.streetAddress || !formData.suburb || !formData.city || !formData.province || !formData.postalCode) {
      return;
    }
    setIsModalOpen(true);
    

  };

  const handleConfirmModal = () => {
    console.log(formData);
    setIsModalOpen(false);
    
  };

  const handleCancelModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="address_content text-white px-10 bg-light-grey relative address_top min-w-[21rem] mb-6">
      <h2 className="text-lg mb-2 mt-2 text-center">Your Delivery Address</h2>
      <form className="flex flex-col p-[1rem]">
        <input
          type="text"
          name="recipientName"
          placeholder="Recipient Name*"
          className="mb-4 p-1 rounded-lg"
          value={formData.recipientName}
          onChange={handleInputChange}
          onError={(e) => {}

          }
          required
        />
        <input
          type="phone"
          name="recipientPhone"
          placeholder="Recipient Phone Number*"
          className="mb-4 p-1 rounded-lg"
          value={formData.recipientPhone}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="streetAddress"
          placeholder="Street Address*"
          className="mb-4 p-1 rounded-lg"
          value={formData.streetAddress}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="complexBuilding"
          placeholder="Complex / Building "
          className="mb-4 p-1 rounded-lg"
          value={formData.building}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="suburb"
          placeholder="Suburb*"
          className="mb-4 p-1 rounded-lg"
          value={formData.suburb}
          onChange={handleInputChange}
          required
        />
        <input 
        type="text" 
        name="city"
        placeholder="City*" 
        className="mb-4 p-1 rounded-lg" 
        value={formData.city}
        onChange={handleInputChange}
        required
        />
        <input
          type="text"
          name="province"
          placeholder="Province*"
          className="mb-4 p-1 rounded-lg"
          value={formData.province}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="postalCode"
          placeholder="Postal Code*"
          className="mb-4 p-1 rounded-lg"
          value={formData.postalCode}
          onChange={handleInputChange}
          required
        />
        <input type="submit" value="Save Address" onClick={handleAddressSubmit} className="bg-accent rounded-lg text-white px-8 py-3 h-10" />
        </form>
        <ConfirmationModal
          isOpen={isModalOpen}
          message="Are you sure you want to save this address?"
          onConfirm={handleConfirmModal}
          onCancel={handleCancelModal}
        />
      </div>
    );
  };
  
  export default AddressForm;
