import React, { useEffect, useState } from 'react';
import { Pagenation } from '../dataTable/Pagenation';
import SearchBar from '../searchBar/searchBar';
import { getUsersInCompany, deleteUser } from '../../api/company';

export const CompanyMembers = ({ details, setActiveTab }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filterUsers = (user) => {
    if (!searchTerm) return true;
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    return (
      user.user_details.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      user.user_details.surname.toLowerCase().includes(lowerCaseSearchTerm) ||
      user.role.toLowerCase().includes(lowerCaseSearchTerm) ||
      user.user_details.phone.toLowerCase().includes(lowerCaseSearchTerm)
    );
  };

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9)
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Search Filtering
  const filteredUsers = users.filter(filterUsers);
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  // Pagination Continued
  const maxPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const lastPage = currentPage === maxPages;

  useEffect(() => {
    fetchUsers();
  }, [details.id]);

  const fetchUsers = async () => {
    try {
      const data = await getUsersInCompany(details.id);
      setUsers(data || []);
    } catch (error) {
      console.error('Error in fetchUsers:', error);
      setUsers([]);
    }
  };

  const handleDeleteMember = async (user_id) => {
    try {
      const response = await deleteUser(user_id);
      if (response === "success") {
        const updatedUsers = users.filter(user => user.id !== user_id);
        setUsers(updatedUsers);

        if (currentPage > 1 && updatedUsers.length <= indexOfFirstItem) {
          setCurrentPage(currentPage - 1);
        }
      }
    } catch (error) {
      console.error('Error in fetchUsers:', error);
    }
  };

  const handleAddMember = () => {
    setActiveTab("member_details");
  };

  return (
    <div className="profile-block">
      <Pagenation 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        lastPage={lastPage}
      />
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg text-black flex-1">Company Users</h2>
        <div className="ml-auto">
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            className="w-full max-w-xs"
          />
        </div>
        <div className="ml-4">
          <button onClick={handleAddMember} className="default-button w-32">
            Add User
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white table-fixed">
          <thead>
            <tr className="w-full h-16 border-gray-300 border-b py-8">
              <th className="text-left w-1/5 px-4">Name</th>
              <th className="text-left w-1/5 px-4">Surname</th>
              <th className="text-left w-1/5 px-4">Role</th>
              <th className="text-left w-1/5 px-4">Phone Number</th>
              <th className="text-center w-1/5 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {currentUsers.length > 0 ? (
              currentUsers.map(user => (
                <tr key={user.id} className="h-14">
                  <td className="w-1/5 px-4">{user.user_details.name}</td>
                  <td className="w-1/5 px-4">{user.user_details.surname}</td>
                  <td className="w-1/5 px-4">{user.role}</td>
                  <td className="w-1/5 px-4">{user.user_details.phone}</td>
                  <td className="text-center w-1/5 px-4">
                    <button onClick={() => handleDeleteMember(user.id)} className="text-red-600 hover:text-red-800">
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">No users found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
