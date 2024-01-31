import axios from "axios";

export const getCompanies = async (startAndEnd, filterList) => {
  try {
    const response = await axios.post(
      "/get_companies",
      {
        start_and_end: startAndEnd,
        filter_list: filterList,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      }
    );

    if (response.status === 200) {
      return response.data.data;
    } else {
      throw new Error("Failed to fetch companies");
    }
  } catch (error) {
    console.error("Error fetching companies:", error);
    throw error;
  }
};

export const getCompanyWarehouses = async (company_id, filterList) => {
  try {
    const response = await axios.post(
      "/get_company_warehouses",
      {
        company_id: company_id,
        filter_list: filterList,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      }
    );

    if (response.status === 200) {
      return response.data.data;
    } else {
      throw new Error("Failed to fetch users in company");
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const getCompanyTypes = async () => {
  try {
    const response = await axios.get("/get_company_types", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });

    if (response.status === 200) {
      return response.data.data;
    } else {
      throw new Error("Failed to fetch company types");
    }
  } catch (error) {
    console.error("Error fetching company types:", error);
    throw error;
  }
};

export const getUsersCompany = async (user_id) => {
  try {
    const response = await axios.get(`/get_users_company?user_id=${user_id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });

    if (response.status === 200) {
      return response.data.data;
    } else {
      throw new Error("Failed to fetch users company");
    }
  } catch (error) {
    console.error("Error fetching users company:", error);
    throw error;
  }
};

export const getSalesReps = async () => {
  try {
    const response = await axios.get("/get_sales_reps", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });

    if (response.status === 200) {
      return response.data.data;
    } else {
      throw new Error("Failed to fetch sales reps");
    }
  } catch (error) {
    console.error("Error fetching sales reps:", error);
    throw error;
  }
};

export const getCompanyTypeInfo = async (company_id) => {
  try {
    const response = await axios.get(
      `/get_company_type_info?company_id=${company_id}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      }
    );

    if (response.status === 200) {
      return response.data.data;
    } else {
      throw new Error("Failed to fetch company types");
    }
  } catch (error) {
    console.error("Error fetching company types:", error);
    throw error;
  }
};

export const getUserRoles = async () => {
  try {
    const response = await axios.get("/get_user_roles", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });

    if (response.status === 200) {
      return response.data.data;
    } else {
      throw new Error("Failed to fetch company types");
    }
  } catch (error) {
    console.error("Error fetching company types:", error);
    throw error;
  }
};

export const getUsersInCompany = async (company_id, filterList) => {
  try {
    const response = await axios.post(
      "/get_users_in_company",
      {
        company_id: company_id,
        filter_list: filterList,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      }
    );

    if (response.status === 200) {
      return response.data.data;
    } else {
      throw new Error("Failed to fetch users in company");
    }
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const updateCompany = async (companyData) => {
  try {
    const response = await axios.post("/update_company", companyData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });

    if (response.status === 200) {
      return response.data.data;
    } else {
      throw new Error("Failed to update company");
    }
  } catch (error) {
    console.error("Error updating company:", error);
    throw error;
  }
};

export const addCompany = async (companyData) => {
  try {
    const response = await axios.post("/add_company", companyData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });

    if (response.status === 200) {
      return response.data.data;
    } else {
      throw new Error("Failed to add company");
    }
  } catch (error) {
    console.error("Error adding company:", error);
    throw error;
  }
};

export const deleteCompany = async (companyID) => {
  try {
    const response = await axios.delete(
      `/delete_company?company_id=${companyID}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      }
    );

    if (response.status === 200) {
      return response.data.message;
    } else {
      throw new Error("Failed to delete company");
    }
  } catch (error) {
    console.error("Error deleting company:", error);
    throw error;
  }
};

export const updateUser = async (user_id, userData) => {
  try {
    const response = await axios.post(
      "/update_company_members",
      { user_id, ...userData },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      }
    );

    if (response.status === 200) {
      console.log(response.data.data);
      return response.data.data;
    } else {
      throw new Error("Failed to update user");
    }
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const addUser = async (userData) => {
  try {
    const response = await axios.post("/add_user_to_company", userData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    });

    if (response.status === 200) {
      return response.data.data;
    } else {
      throw new Error("Failed to add user");
    }
  } catch (error) {
    console.error("Error adding user:", error);
    return error.response;
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
      throw new Error("Failed to delete user");
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const addWarehouse = async (warehouseData) => {
  console.log(warehouseData);
  try {
    const response = await axios.post(
      "/add_warehouse_to_company",
      warehouseData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      }
    );

    if (response.status === 200) {
      return response.data.data;
    } else {
      throw new Error("Failed to add warehouse");
    }
  } catch (error) {
    console.error("Error adding warehouse:", error);
    throw error;
  }
};

export const updateWarehouse = async (updateWarehouseData) => {
  console.log(updateWarehouseData.id);
  try {
    const response = await axios.post(
      "/update_company_warehouse",
      updateWarehouseData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      }
    );

    if (response.status === 200) {
      console.log(response.data.data);
      return response.data.data;
    } else {
      throw new Error("Failed to update warehouse");
    }
  } catch (error) {
    console.error("Error updating warehouse:", error);
    throw error;
  }
};

export const deleteWarehouse = async (warehouseID) => {
  try {
    const response = await axios.delete(
      `/delete_warehouse?warehouse_id=${warehouseID}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      }
    );

    if (response.status === 200) {
      return response.data.message;
    } else {
      throw new Error("Failed to delete user");
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};
