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
