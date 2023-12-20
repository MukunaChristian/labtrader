import axios from "axios";

export const getUserData = async (user_id, setUserDetailsState, dispatch) => {
  await axios
    .get(`/profile/${user_id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
    .then((response) => {
      console.log(response.data);
      if (response.status === 200) {
        dispatch(setUserDetailsState(JSON.parse(response.data.details)));
      }
    })
    .catch((error) => {
      console.log(error.message);

      if (!error.response) {
        console.log("Network error");
        return;
      }

      if (error.response.status === 401) {
        console.log("Unauthorized");
        return;
      }
    });
};

export const updateProfile = async (user_id, data) => {
  await axios
    .post(`/profile/${user_id}`, data, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    })
    .then((response) => {
      if (response.status === 200) {
        console.log("successful profile update");
      }
    })
    .catch((error) => {
      console.log(error.message);

      if (!error.response) {
        console.log("Network error");
        return;
      }

      if (error.response.status === 401) {
        console.log("Unauthorized");
        return;
      }
    });
};
