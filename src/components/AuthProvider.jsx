import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import axios from "axios";
import API_URL from "../Helpers/apiurl";
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const keeplogin = async () => {
    try {
      let token = Cookies.get("token");
      if (token) {
        let result = await axios.get(`${API_URL}/auth/keep-login`, {
          headers: {
            authorization: token,
          },
        });
        dispatch({ type: "LOGIN", payload: result.data });
      }
    } catch (error) {
      console.log("token expired");
      dispatch({ type: "DONE" });
      dispatch({ type: "LOGOUT" });
      Cookies.remove("token");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    keeplogin();
    // eslint-disable-next-line
  }, []);

  if (loading) {
    return (
      <div className="grid justify-center bg-putih h-screen w-screen">
        <div className="flex flex-col items-center justify-center">
          <Loading className="h-20 w-20 animate-bounce" />
          <div>Please wait...</div>
        </div>
      </div>
    );
  }

  return children;
};

export default AuthProvider;
