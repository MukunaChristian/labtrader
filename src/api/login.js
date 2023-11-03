import axios from "axios";

export const login = (email, password) => {
  return axios.post("/login", {
    email: email,
    password: password,
  });
};

export const validateToken = async (token, navigate, setLoggedin) => {
  await axios
    .post("/validate", {
      token: token,
    })
    .then((response) => {
      console.log(response);
      if (response.status === 200) {
        setLoggedin(true);
      }
    })
    .catch((error) => {
      console.log(error.message);

      if (!error.response) {
        console.log("Network error");
        navigate("/login");
        return;
      }

      if (error.response.status === 401) {
        navigate("/login");
      }
    });
};
