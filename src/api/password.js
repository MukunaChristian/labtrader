import axios from "axios";

export const resetPassword = (token, password) => {
    return axios
        .post("/reset_password", {
            token: token,
            password: password,
        })
        .then((response) => {
            if (response.status === 200) {
                return response.data.data;
            } else {
                console.log(response.data);
            }
        })
        .catch((error) => {
            console.log(error.message);
            return error.response;
        });
};

export const sendResetPasswordLink = (email) => {
    return axios
        .post("/send_password_reset_link", {
            email: email
        })
        .then((response) => {
            if (response.status === 200) {
                return response.data.data;
            } else {
                console.log(response.data);
            }
        })
        .catch((error) => {
            console.log(error.message);
            return error.response;
        });
};