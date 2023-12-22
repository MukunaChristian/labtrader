import React, { useEffect, useState } from 'react';
import SearchBar from '../searchBar/searchBar';
import { getUsersInCompany, deleteUser, getUserRoles } from '../../api/company';

export const CompanyMembers = ({ user_details, details, setActiveTab }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [userRoles, setUserRoles] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const [nameSortOrder, setNameSortOrder] = useState('None');
  const [surnameSortOrder, setSurnameSortOrder] = useState('None');
  const [roleSortOrder, setRoleSortOrder] = useState('None');
  const [phoneNumberSortOrder, setPhoneNumberSortOrder] = useState('None');

  const toggleNameSortOrder = () => {
    setNameSortOrder(nameSortOrder === 'A-Z' ? 'Z-A' : nameSortOrder === 'Z-A' ? 'None' : 'A-Z');
  };

  const toggleSurnameSortOrder = () => {
    setSurnameSortOrder(surnameSortOrder === 'A-Z' ? 'Z-A' : surnameSortOrder === 'Z-A' ? 'None' : 'A-Z');
  };

  const toggleRoleSortOrder = () => {
    if (roleSortOrder === 'None') {
      setRoleSortOrder(userRoles.length > 0 ? userRoles[0].name : 'None');
      setRoleSortIndex(0);
    } else {
      const currentRoleIndex = userRoles.findIndex(role => role.name === roleSortOrder);
      let nextIndex = currentRoleIndex + 1;
  
      if (nextIndex >= userRoles.length) {
        setRoleSortOrder('None');
      } else {
        setRoleSortOrder(userRoles[nextIndex].name);
        setRoleSortIndex(nextIndex);
      }
    }
  };

  const togglePhoneNumberSortOrder = () => {
    setPhoneNumberSortOrder(phoneNumberSortOrder === 'A-Z' ? 'Z-A' : phoneNumberSortOrder === 'Z-A' ? 'None' : 'A-Z');
  };

  const handleEnterPress = () => {
    fetchUsers();
  };

  const fetchUserRoles = async () => {
    try {
      const roles = await getUserRoles();
      setUserRoles(roles);
    } catch (error) {
      console.error('Error fetching user roles:', error);
    }
  };

  useEffect(() => {
    fetchUserRoles()
    fetchUsers();
  }, [nameSortOrder, surnameSortOrder, roleSortOrder, phoneNumberSortOrder]);

  const fetchUsers = async () => {
    const filterList = {
      name: nameSortOrder !== 'None' ? nameSortOrder : null,
      surname: surnameSortOrder !== 'None' ? surnameSortOrder : null,
      role: roleSortOrder !== 'None' ? roleSortOrder : null,
      phone: phoneNumberSortOrder !== 'None' ? phoneNumberSortOrder : null,
      search: searchTerm !== '' ? searchTerm : null,
    };

    try {
      const data = await getUsersInCompany(details.id, filterList);
      console.log(data)
      if (data != null) {
        setUsers(data.data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Error in fetchUsers:', error);
      setUsers([]);
    }
  };

  const handleDeleteMember = async (user_id, confirm = false) => {
    if (!confirm) {
      setConfirmDelete(user_id);
      return;
    }
    try {
      const response = await deleteUser(user_id);
      if (response === "success") {
        const updatedUsers = users.filter(user => user.id !== user_id);
        setUsers(updatedUsers);
        setConfirmDelete(null);
      }
    } catch (error) {
      console.error('Error in handleDeleteMember:', error);
    }
  };

  const handleViewMember = (user) => {
    setActiveTab("member_details");
    user_details(user)
  };

  const handleAddMember = () => {
    setActiveTab("member_details");
    user_details(null)
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
          <button onClick={handleAddMember} className="default-button w-32">
            Add User
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white table-fixed">
          <thead>
            <tr className="w-full h-16 border-gray-300 border-b py-8">
              <th className="text-left w-1/5 px-4 cursor-pointer" onClick={toggleNameSortOrder}>Name {nameSortOrder !== 'None' && `(${nameSortOrder})`}</th>
              <th className="text-left w-1/5 px-4 cursor-pointer" onClick={toggleSurnameSortOrder}>Surname {surnameSortOrder !== 'None' && `(${surnameSortOrder})`}</th>
              <th className="text-left w-1/5 px-4 cursor-pointer" onClick={toggleRoleSortOrder}>Role {roleSortOrder !== 'None' && `(${roleSortOrder})`}</th>
              <th className="text-left w-1/5 px-4 cursor-pointer" onClick={togglePhoneNumberSortOrder}>Phone Number {phoneNumberSortOrder !== 'None' && `(${phoneNumberSortOrder})`}</th>
              <th className="text-center w-1/5 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-300">
            {users.length > 0 ? (
              users.map(user => (
                <tr key={user.id} className="h-14">
                  <td className="w-1/5 px-4">{user.user_details.name}</td>
                  <td className="w-1/5 px-4">{user.user_details.surname}</td>
                  <td className="w-1/5 px-4">{user.role}</td>
                  <td className="w-1/5 px-4">{user.user_details.phone}</td>
                  <td className="text-center w-1/5 px-4">
                    <button onClick={() => handleViewMember(user)} className="text-blue-600 hover:text-blue-800 mr-3">Edit</button>
                    {confirmDelete === user.id ? (
                      <button onClick={() => handleDeleteMember(user.id, true)} className="text-red-600 hover:text-red-800">Confirm?</button>
                    ) : (
                      <button onClick={() => handleDeleteMember(user.id)} className="text-red-600 hover:text-red-800">Delete</button>
                    )}
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
