import React, { useEffect, useState } from 'react';
import { Pagenation } from '../dataTable/Pagenation';
import SearchBar from '../searchBar/searchBar';
import { getCompanies, deleteCompany, getCompanyTypes } from '../../api/company';

export const CompanyList = ({ setActiveTab, setViewedCompany, setallCompanies }) => {
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalCompanies, setTotalCompanies] = useState(0);
  const [companyTypes, setCompanyTypes] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [nameSortOrder, setNameSortOrder] = useState('None');
  const [typeIdSortOrder, setTypeIdSortOrder] = useState('None');
  const [registrationNumberSortOrder, setRegistrationNumberSortOrder] = useState('None');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9)
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Search Filtering
  const currentCompanies = companies;

  // Pagination Continued
  const maxPages = Math.ceil(totalCompanies / itemsPerPage);
  const lastPage = currentPage === maxPages;

  const toggleNameSortOrder = () => {
    setNameSortOrder(nameSortOrder === 'A-Z' ? 'Z-A' : nameSortOrder === 'Z-A' ? 'None' : 'A-Z');
  };

  const toggleTypeIdSortOrder = () => {
    const typeIds = ['None', ...companyTypes.map(type => type.id.toString())];
    const currentTypeIndex = typeIds.indexOf(typeIdSortOrder);
    const nextTypeIndex = (currentTypeIndex + 1) % typeIds.length;
    setTypeIdSortOrder(typeIds[nextTypeIndex]);
  };


  const toggleRegistrationNumberSortOrder = () => {
    setRegistrationNumberSortOrder(registrationNumberSortOrder === 'asc' ? 'desc' : registrationNumberSortOrder === 'desc' ? 'None' : 'asc');
  };

  const handleEnterPress = () => {
    fetchCompanies();
  };

  const handleViewDetails = (company) => {
    setViewedCompany(company);
    setActiveTab("details");
    setallCompanies(companies)
  };

  const handleDeleteDetails = async (company, confirm = false) => {
    if (!confirm) {
      setConfirmDelete(company.id);
      return;
    }
    try {
      const response = await deleteCompany(company.id);
      if (response === "success") {
        const updatedCompanies = companies.filter(c => c.id !== company.id);
        setCompanies(updatedCompanies);
        setConfirmDelete(null);

        if (currentPage > 1 && updatedCompanies.length <= indexOfFirstItem) {
          setCurrentPage(currentPage - 1);
        }
      }
    } catch (error) {
      console.error('Error in handleDeleteDetails:', error);
    }
  };

  const handleAddCompany = () => {
    const newCompany = {
      registration_number: '',
      name: '',
      email: '',
      phone_number: '',
      address_1: '',
      address_2: '',
      city: '',
      country: '',
      pincode: '',
      type_id: ''
    };

    setViewedCompany(newCompany);
    setActiveTab("details");
    setallCompanies(companies)
  };

  useEffect(() => {
    fetchCompanyTypes();
    fetchCompanies();
  }, [nameSortOrder, typeIdSortOrder, registrationNumberSortOrder, currentPage]);

  const fetchCompanyTypes = async () => {
    try {
      const types = await getCompanyTypes();
      setCompanyTypes(types);
    } catch (error) {
      console.error('Error fetching company types:', error);
    }
  };

  const fetchCompanies = async () => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage

    const filterList = {
      name: nameSortOrder !== 'None' ? nameSortOrder : null,
      type_id: typeIdSortOrder !== 'None' ? typeIdSortOrder : null,
      registration_number: registrationNumberSortOrder !== 'None' ? registrationNumberSortOrder : null,
      search: searchTerm !== '' ? searchTerm : null,
    };

    try {
      const data = await getCompanies([start, end], filterList);
      console.log(data)
      if (data != null) {
        setTotalCompanies(data.total);
        setCompanies(data.data);
      } else {
        setTotalCompanies(1);
        setCompanies([]);
      }
    } catch (error) {
      console.error('Error in fetchCompanies:', error);
    }
  };

  return (
    <div className="profile-block">
      <Pagenation
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        lastPage={lastPage}
      />
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg text-black flex-1">Company List</h2>
        <div className="ml-auto">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onEnterPress={handleEnterPress}
            className="w-full max-w-xs"
          />
        </div>
        <div className="ml-4">
          <button onClick={handleAddCompany} className="default-button w-32">
            Add Company
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white table-fixed">
          <thead>
            <tr className="w-full h-16 border-gray-300 border-b py-8">
              <th className="text-left w-1/4 px-4 cursor-pointer" onClick={toggleNameSortOrder}>Name {nameSortOrder !== 'None' && `(${nameSortOrder})`}</th>
              <th className="text-left w-1/4 px-4 cursor-pointer" onClick={toggleTypeIdSortOrder}>Type {typeIdSortOrder !== 'None' && `(${companyTypes.find(type => type.id.toString() === typeIdSortOrder)?.name || 'Unknown'})`}</th>
              <th className="text-left w-1/4 px-4 cursor-pointer" onClick={toggleRegistrationNumberSortOrder}>Registration Number {registrationNumberSortOrder !== 'None' && `(${registrationNumberSortOrder})`}</th>
              <th className="text-center w-1/4 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {currentCompanies.length > 0 ? (
              currentCompanies.map(company => (
                <tr key={company.id} className="h-14">
                  <td className="w-1/4 px-4">{company.name}</td>
                  <td className="w-1/4 px-4">{company.company_type}</td>
                  <td className="w-1/4 px-4">{company.registration_number}</td>
                  <td className="text-center w-1/4 px-4">
                    <button onClick={() => handleViewDetails(company)} className="text-blue-600 hover:text-blue-800 mr-3">View</button>
                    {confirmDelete === company.id ? (
                      <button onClick={() => handleDeleteDetails(company, true)} className="text-red-600 hover:text-red-800">Confirm?</button>
                    ) : (
                      <button onClick={() => handleDeleteDetails(company)} className="text-red-600 hover:text-red-800">Delete</button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center py-10">
                  <span className="text-gray-500">No companies found</span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
};
