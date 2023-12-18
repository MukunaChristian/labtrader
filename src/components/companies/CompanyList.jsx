import React, { useEffect, useState } from 'react';
import { getCompanies } from '../../api/company';

export const CompanyList = ({ setActiveTab, setViewedCompany, setallCompanies }) => {
  const [companies, setCompanies] = useState([]);

  const handleViewDetails = (company) => {
    setViewedCompany(company);
    setActiveTab("details");
    setallCompanies(companies)
  };

  const handleDeleteDetails = (company) => {
    console.log("delete company")
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const data = await getCompanies();
      console.log(data)
      setCompanies(data);
    } catch (error) {
      console.error('Error in fetchCompanies:', error);
    }
  };

  return (
    <div className="profile-block">
      <h2 className="font-semibold text-lg text-black mb-4">Company List</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white table-fixed">
          <thead>
            <tr className="w-full h-16 border-gray-300 border-b py-8">
              <th className="text-left px-4">Name</th>
              <th className="text-left px-4">Type</th>
              <th className="text-left px-4">Discount %</th>
              <th className="text-left px-4">Registration Number</th>
              <th className="text-left px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {companies.map(company => (
              <tr key={company.id} className="h-14">
                <td className="px-4">{company.name}</td>
                <td className="px-4">{company.company_type}</td>
                <td className="px-4">{company.discount_percent}%</td>
                <td className="px-4">{company.registration_number}</td>
                <td className="px-4">
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
