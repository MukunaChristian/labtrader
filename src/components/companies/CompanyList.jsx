import React, { useEffect, useState } from 'react';
import { Pagenation } from '../dataTable/Pagenation';
import SearchBar from '../searchBar/searchBar';
import { getCompanies, deleteCompany } from '../../api/company';
import { useSelector } from 'react-redux';

export const CompanyList = ({ setActiveTab, setViewedCompany, setallCompanies }) => {
  // const [companies, setCompanies] = useState([]);
  const companies_state = useSelector(state => state.app.companies);
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filterCompanies = (company) => {
    if (!searchTerm) return true;
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      company.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      company.company_type.toLowerCase().includes(lowerCaseSearchTerm) ||
      company.discount_percent.toString().includes(lowerCaseSearchTerm) ||
      company.registration_number.toLowerCase().includes(lowerCaseSearchTerm)
    );
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9)
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Search Filtering
  const filteredCompanies = companies.filter(filterCompanies);
  const currentCompanies = filteredCompanies.slice(indexOfFirstItem, indexOfLastItem);

  // Pagination Continued
  const maxPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const lastPage = currentPage === maxPages;

  const handleViewDetails = (company) => {
    setViewedCompany(company);
    setActiveTab("details");
    setallCompanies(companies)
  };

  const handleDeleteDetails = async (company) => {
    try {
      const response = await deleteCompany(company.id);
      if (response === "success") {
        const updatedCompanies = companies.filter(c => c.id !== company.id);
        setCompanies(updatedCompanies);

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
      discount_percent: 0,
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
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const data = await getCompanies();
      setCompanies(data);
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
              <th className="text-left w-1/5 px-4">Name</th>
              <th className="text-left w-1/5 px-4">Type</th>
              <th className="text-left w-1/5 px-4">Discount %</th>
              <th className="text-left w-1/5 px-4">Registration Number</th>
              <th className="text-center w-1/5 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {currentCompanies.map(company => (
              <tr key={company.id} className="h-14">
                <td className="w-1/5 px-4">{company.name}</td>
                <td className="w-1/5 px-4">{company.company_type}</td>
                <td className="w-1/5 px-4">{company.discount_percent}%</td>
                <td className="w-1/5 px-4">{company.registration_number}</td>
                <td className="text-center w-1/5 px-4">
                  <button onClick={() => handleViewDetails(company)} className="text-blue-600 hover:text-blue-800 mr-3">View</button>
                  <button onClick={() => handleDeleteDetails(company)} className="text-red-600 hover:text-red-800">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
};
