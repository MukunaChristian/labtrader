import axios from "axios";
import { loadCart } from "../reducers/UserSlice";

export const login = (email, password) => {
  return axios
    .post("/api_login", {
      email: email,
      password: password,
    })
    .then((response) => {
      console.log(response);
      return response;
    })
    .catch((error) => {
      console.log(error.message);
      return error.response;
    });
};

export const validateToken = async (
  token,
  navigate,
  setLoggedin,
  setUserState,
  dispatch
) => {
  await axios
    .post("/validate", {
      token: token,
    })
    .then((response) => {
      console.log(response);
      if (response.status === 200) {
        setLoggedin(true);
      }
      dispatch(
        setUserState({
          email: response.data.email,
          role: response.data.role,
          id: response.data.user_id,
        })
      );
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
