import React, { useEffect, useState } from 'react';
import SearchBar from '../searchBar/searchBar';
import { getCompanyWarehouses, deleteWarehouse } from '../../api/company';

export const CompanyWarehouse = ({ warehouse_details, details, setActiveTab }) => {
  const [warehouses, setWarehouses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [nameSortOrder, setNameSortOrder] = useState('None');
  const [locationSortOrder, setLocationSortOrder] = useState('None');
  const [consignmentStockSortOrder, setConsignmentStockSortOrder] = useState('None');

  const toggleNameSortOrder = () => {
    setNameSortOrder(nameSortOrder === 'A-Z' ? 'Z-A' : nameSortOrder === 'Z-A' ? 'None' : 'A-Z');
  };

  const toggleLocationSortOrder = () => {
    setLocationSortOrder(locationSortOrder === 'A-Z' ? 'Z-A' : locationSortOrder === 'Z-A' ? 'None' : 'A-Z');
  };

  const toggleConsignmentStockSortOrder = () => {
    setConsignmentStockSortOrder(
      consignmentStockSortOrder === 'Yes' ? 'No' : 
      consignmentStockSortOrder === 'No' ? 'None' : 'Yes'
    );
  };

  const handleEnterPress = () => {
    fetchWarehouses();
  };

  useEffect(() => {
    fetchWarehouses();
  }, [nameSortOrder, locationSortOrder, consignmentStockSortOrder]);

  const fetchWarehouses = async () => {
    const filterList = {
      name: nameSortOrder !== 'None' ? nameSortOrder : null,
      location: locationSortOrder !== 'None' ? locationSortOrder : null,
      consignment_stock: consignmentStockSortOrder !== 'None' ? (consignmentStockSortOrder === 'Yes' ? true : false) : null,
      search: searchTerm !== '' ? searchTerm : null,
    };

    try {
      const data = await getCompanyWarehouses(details.id, filterList);
      console.log(data)
      if (data != null) {
        setWarehouses(data);
      } else {
        setWarehouses([]);
      }
    } catch (error) {
      console.error('Error in getCompanyWarehouses:', error);
      setWarehouses([]);
    }
  };

  const handleViewWarehouseDetails = (warehouse) => {
    setActiveTab("warehouse_details");
    warehouse_details(warehouse)
  };

  const handleDeleteWarehouse = async (warehouse_id, confirm = false) => {
    if (!confirm) {
      setConfirmDelete(warehouse_id);
      return;
    }
    try {
      const response = await deleteWarehouse(warehouse_id);
      if (response === "success") {
        const updatedWarehouses = warehouses.filter(warehouse => warehouse.id !== warehouse_id);
        setWarehouses(updatedWarehouses);
        setConfirmDelete(null);
      }
    } catch (error) {
      console.error('Error in handleDeleteWarehouse:', error);
    }
  };

  const handleAddWarehouse = () => {
    setActiveTab("warehouse_details");
    warehouse_details(null)
  };

  return (
    <div className="profile-block">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg text-black flex-1">{details.name}</h2>
        <div className="ml-auto">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onEnterPress={handleEnterPress}
            className="w-full max-w-xs"
          />
        </div>
        <div className="ml-4">
          <button onClick={handleAddWarehouse} className="default-button w-32">
            Add Warehouse
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white table-fixed">
          <thead>
            <tr className="w-full h-16 border-gray-300 border-b py-8">
              <th className="text-left w-1/4 px-4 cursor-pointer" onClick={toggleNameSortOrder}>Name {nameSortOrder !== 'None' && `(${nameSortOrder})`}</th>
              <th className="text-left w-1/4 px-4 cursor-pointer" onClick={toggleLocationSortOrder}>Location {locationSortOrder !== 'None' && `(${locationSortOrder})`}</th>
              <th className="text-left w-1/4 px-4 cursor-pointer" onClick={toggleConsignmentStockSortOrder}>Consignment Stock {consignmentStockSortOrder !== 'None' && `(${consignmentStockSortOrder})`}</th>
              <th className="text-center w-1/4 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {warehouses.length > 0 ? (
              warehouses.map(warehouse => (
                <tr key={warehouse.id} className="h-14">
                  <td className="w-1/4 px-4">{warehouse.name}</td>
                  <td className="w-1/4 px-4">{warehouse.country}</td>
                  <td className="w-1/4 px-4">{warehouse.consignment_stock ? 'Yes' : 'No'}</td>
                  <td className="text-center w-1/4 px-4">
                    <button onClick={() => handleViewWarehouseDetails(warehouse)} className="text-blue-600 hover:text-blue-800 mr-3">Edit</button>
                    {confirmDelete === warehouse.id ? (
                      <button onClick={() => handleDeleteWarehouse(warehouse.id, true)} className="text-red-600 hover:text-red-800">Confirm?</button>
                    ) : (
                      <button onClick={() => handleDeleteWarehouse(warehouse.id)} className="text-red-600 hover:text-red-800">Delete</button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">No warehouses found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
