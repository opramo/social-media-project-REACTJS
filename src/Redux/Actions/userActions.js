import axios from "axios";
import API_URL from "../../Helpers/apiurl";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

// export const registerAction = ({ ...values }) => {
//   return async (dispatch) => {

//   };
// };

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
