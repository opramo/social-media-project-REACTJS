import axios from "axios";
import API_URL from "../../Helpers/apiurl";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const registerAction = ({ ...values }) => {
  return async (dispatch) => {
    try {
      dispatch({ type: "LOADING" });
      let res = await axios.post(`${API_URL}/auth/register`, { ...values });
      dispatch({ type: "LOGIN", payload: res.data });
      Cookies.set("token", res.headers["x-token-access"]);
    } catch (error) {
      console.log(`masuk error`);
      dispatch({
        type: "ERROR",
        payload: error.response.data.message || "Network Error",
      });
    } finally {
      dispatch({ type: "DONE" });
    }
  };
};

export const loginAction = ({ ...values }) => {
  return async (dispatch) => {
    try {
      dispatch({ type: "LOADING" });
      let res = await axios.post(`${API_URL}/auth/login`, {
        username: values.personId,
        email: values.personId,
        password: values.password,
      });
      Cookies.set("token", res.headers["x-token-access"]);
      dispatch({ type: "LOGIN", payload: res.data });
    } catch (error) {
      dispatch({
        type: "ERROR",
        payload: error.response.data.message || "Network Error",
      });
    } finally {
      dispatch({ type: "DONE" });
    }
  };
};

export const logoutAction = () => {
  Cookies.remove("token");
  return {
    type: "LOGOUT",
  };
};

export const editProfile = (formData) => {
  // const  navigate = useNavigate()
  return async (dispatch) => {
    try {
      console.log("masuk action");
      console.log("formData :", formData);
      dispatch({ type: "LOADING" });
      let token = Cookies.get("token");
      let res = await axios.patch(
        `${API_URL}/profile/profile-update`,
        formData,
        {
          headers: { authorization: token },
        }
      );

      dispatch({ type: "LOGIN", payload: res.data });
      console.log(res.data);
      toast.success("Updated!", {
        theme: "colored",
        position: "top-center",
      });
      // navigate;
    } catch (error) {
      dispatch({
        type: "ERROR",
        payload: error.response.data.message || "Network Error",
      });
    } finally {
      dispatch({ type: "DONE" });
    }
  };
};

export const postRecipe = (formData) => {
  return async (dispatch) => {
    try {
      dispatch({ type: "LOADING" });
      let token = Cookies.get("token");
      let res = await axios.post(`${API_URL}/recipe/post-recipe`, formData, {
        headers: { authorization: token },
      });
      dispatch({ type: "LOGIN", payload: res.data });
      toast.success("submitted!", {
        theme: "colored",
        position: "top-center",
      });
    } catch (error) {
      dispatch({
        type: "ERROR",
        payload: error.response.data.message || "Network Error",
      });
    } finally {
      dispatch({ type: "DONE" });
    }
  };
};

// export const editRecipe = (formData) => {
//   const navigate = useNavigate();
//   return async (dispatch) => {
//     try {
//       dispatch({ type: "LOADING" });
//       let token = Cookies.get("token");
//       let res = await axios.patch(`${API_URL}/recipe/edit-recipe`, formData, {
//         headers: { authorization: token },
//       });
//       dispatch({ type: "LOGIN", payload: res.data });
//       toast.success("Post edited!", {
//         theme: "colored",
//         position: "top-center",
//       });
//       setTimeout(() => {
//         navigate("/home");
//       }, 3000);
//     } catch (error) {
//       dispatch({
//         type: "ERROR",
//         payload: error.response.data.message || "Network Error",
//       });
//     } finally {
//       dispatch({ type: "DONE" });
//     }
//   };
// };
