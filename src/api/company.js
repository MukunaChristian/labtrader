import axios from "axios";

export const getCompanies = async () => {
    try {
        const response = await axios.get('/get_companies', {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
        });

        if (response.status === 200) {
            return response.data.data;
        } else {
            throw new Error('Failed to fetch companies');
        }
    } catch (error) {
        console.error('Error fetching companies:', error);
        throw error;
    }
};

export const getCompanyTypes = async () => {
    try {
        const response = await axios.get('/get_company_types', {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
        });

        if (response.status === 200) {
            return response.data.data;
        } else {
            throw new Error('Failed to fetch company types');
        }
    } catch (error) {
        console.error('Error fetching company types:', error);
        throw error;
    }
};

export const getUserRoles = async () => {
    try {
        const response = await axios.get('/get_user_roles', {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
        });

        if (response.status === 200) {
            return response.data.data;
        } else {
            throw new Error('Failed to fetch company types');
        }
    } catch (error) {
        console.error('Error fetching company types:', error);
        throw error;
    }
};

export const getUsersInCompany = async (companyId) => {
    try {
        const response = await axios.get(`/get_users_in_company?company_id=${companyId}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
        });

        if (response.status === 200) {
            return response.data.data;
        } else {
            throw new Error('Failed to fetch users');
        }
    } catch (error) {
        console.error('Error fetching users in company:', error);
        throw error;
    }
};

export const updateCompany = async (companyData) => {
    try {
        const response = await axios.post('/update_company', companyData, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
        });

        if (response.status === 200) {
            return response.data.data;
        } else {
            throw new Error('Failed to update company');
        }
    } catch (error) {
        console.error('Error updating company:', error);
        throw error;
    }
};

export const addCompany = async (companyData) => {
    try {
        const response = await axios.post('/add_company', companyData, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
        });

        if (response.status === 200) {
            return response.data.data;
        } else {
            throw new Error('Failed to add company');
        }
    } catch (error) {
        console.error('Error adding company:', error);
        throw error;
    }
};

export const deleteCompany = async (companyID) => {
    try {
        const response = await axios.delete(`/delete_company?company_id=${companyID}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
        });

        if (response.status === 200) {
            return response.data.message;
        } else {
            throw new Error('Failed to delete company');
        }
    } catch (error) {
        console.error('Error deleting company:', error);
        throw error;
    }
};

export const addUser = async (userData) => {
    try {
        const response = await axios.post('/add_user_to_company', userData, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
        });

        if (response.status === 200) {
            return response.data.data;
        } else {
            throw new Error('Failed to add user');
        }
    } catch (error) {
        console.error('Error adding user:', error);
        throw error;
    }
};

export const deleteUser = async (userID) => {
    try {
        const response = await axios.delete(`/delete_user?user_id=${userID}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
        });

        if (response.status === 200) {
            return response.data.message;
        } else {
            throw new Error('Failed to delete user');
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        throw error;
    }
};