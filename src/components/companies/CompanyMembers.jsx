import React, { useEffect, useState } from 'react';
import { getUsersInCompany, deleteUser } from '../../api/company';

export const CompanyMembers = ({ details, setActiveTab }) => {
  const [users, setUsers] = useState([]);

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
        fetchUsers()
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg text-black mb-4">Company Users</h2>
        <button onClick={handleAddMember} className="default-button w-27 text-right">
          Add User
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white table-fixed">
          <thead>
            <tr className="w-full h-16 border-gray-300 border-b py-8">
              <th className="text-left px-4">Name</th>
              <th className="text-left px-4">Surname</th>
              <th className="text-left px-4">Role</th>
              <th className="text-left px-4">Phone Number</th>
              <th className="text-left px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {users.length > 0 ? (
              users.map(company => (
                <tr key={company.id} className="h-14">
                  <td className="px-4">{company.user_details.name}</td>
                  <td className="px-4">{company.user_details.surname}</td>
                  <td className="px-4">{company.role}</td>
                  <td className="px-4">{company.user_details.phone}</td>
                  <td className="px-4">
                    <button onClick={() => handleDeleteMember(company.id)} className="text-red-600 hover:text-red-800">
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
