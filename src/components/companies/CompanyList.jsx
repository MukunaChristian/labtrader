import React, { useEffect, useState } from 'react';
import { Pagenation } from '../dataTable/Pagenation';
import SearchBar from '../searchBar/searchBar';
import { getCompanies, getCompanyTypes } from '../../api/company';
import { useSelector } from 'react-redux';

export const CompanyList = ({ setActiveTab, setViewedCompany, setallCompanies, current_user }) => {
  // const [companies, setCompanies] = useState([]);
  const companies_state = useSelector(state => state.app.companies);
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalCompanies, setTotalCompanies] = useState(0);
  const [companyTypes, setCompanyTypes] = useState([]);

  const [nameSortOrder, setNameSortOrder] = useState('None');
  const [typeIdSortOrder, setTypeIdSortOrder] = useState('None');
  const [registrationNumberSortOrder, setRegistrationNumberSortOrder] = useState('None');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10)
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
      type_id: (current_user.role === 'Sales Rep' || current_user.role === 'Admin') ? 3 : '',
      company_type: (current_user.role === 'Sales Rep' || current_user.role === 'Admin') ? 'Jeweller' : '',
      sales_rep: current_user.role === 'Sales Rep' ? current_user.id : null,
      sales_rep_id: current_user.role === 'Sales Rep' ? current_user.id : null,
    };

    setViewedCompany(newCompany);
    setActiveTab("details");
    setallCompanies(companies)
  };

  useEffect(() => {
    fetchCompanyTypes();
    fetchCompanies();
  }, [nameSortOrder, typeIdSortOrder, registrationNumberSortOrder, currentPage]);

  useEffect(() => {
    if (current_user.role === "Admin" && companies.length === 1) {
      handleViewDetails(companies[0]);
    }
  }, [companies]);
  

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
      user_role: current_user.role,
      user_id: current_user.id
    };

    try {
      const data = await getCompanies([start, end], filterList);
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
    <div className="profile-block h-[100%]" style={{ backgroundColor: 'rgb(220 220 220)' }}>
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
        {(current_user.role !== 'Buyer') && (
          <div className="ml-4">
            <button onClick={handleAddCompany} className="default-button w-32 bg-accent text-white">
              Add Company
            </button>
          </div>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed">
          <thead>
            <tr className="w-full h-16 py-8">
              <th className="text-left w-1/4 px-4 cursor-pointer bg-white border-none" onClick={toggleNameSortOrder}>Name {nameSortOrder !== 'None' && `(${nameSortOrder})`}</th>
              <th className="text-left w-1/4 px-4 cursor-pointer bg-white border-none" onClick={toggleTypeIdSortOrder}>Type {typeIdSortOrder !== 'None' && `(${companyTypes.find(type => type.id.toString() === typeIdSortOrder)?.name || 'Unknown'})`}</th>
              <th className="text-left w-1/4 px-4 cursor-pointer bg-white border-none" onClick={toggleRegistrationNumberSortOrder}>Registration Number {registrationNumberSortOrder !== 'None' && `(${registrationNumberSortOrder})`}</th>
              <th className="text-center w-1/4 px-4 bg-white border-none">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {currentCompanies.length > 0 ? (
              currentCompanies.map(company => (
                <tr key={company.id} className="h-14">
                  <td className="w-1/4 px-4 bg-white border-none">{company.name}</td>
                  <td className="w-1/4 px-4 bg-white border-none">{company.company_type}</td>
                  <td className="w-1/4 px-4 bg-white border-none">{company.registration_number}</td>
                  <td className="text-center w-1/4 px-4 bg-white border-none">
                    <a onClick={() => handleViewDetails(company)} className="text-blue-600 hover:text-blue-800 mr-3 text-base ">View</a>
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
      <div className='flex justify-between pt-6 px-1'>
        <p className='flex items-center '>
          Showing {indexOfFirstItem + 1} to {indexOfLastItem > totalCompanies ? totalCompanies : indexOfLastItem} of {totalCompanies} entries
        </p>
        <Pagenation
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          lastPage={lastPage}
        />
      </div>
    </div>
  )
};
