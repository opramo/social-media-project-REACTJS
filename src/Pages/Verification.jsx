import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Logo1 from "../Assets/chefputih.png";
import API_URL from "../Helpers/apiurl";

function Verification() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token } = useParams();
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [needLogIn, setLogIn] = useState(false);
  const { username, id, email, is_verified } = useSelector(
    (state) => state.user
  );

  useEffect(() => {
    verifying();
  }, [loading]);

  const verifying = async () => {
    try {
      let res = await axios.get(`${API_URL}/auth/verification`, {
        headers: {
          authorization: token,
        },
      });
      let action = await dispatch({ type: "LOGIN", payload: res.data });
      if (action) {
        setVerified(true);
      }
    } catch (error) {
      setVerified(false);
    } finally {
      setLoading(false);
    }
  };
  const sendEmail = async () => {
    try {
      setLoading(true);
      await axios.post(`${API_URL}/auth/email-verification`, {
        id,
        username,
        email,
      });
      toast.success("Email sent!", {
        position: "top-center",
      });
    } catch (error) {}
  };

  //   ubah auto redirect setelah selesai verifikasi
  useEffect(() => {
    is_verified && navigate("/");
  }, []);

  if (loading) {
    return (
      <>
        <div className="min-h-screen flex flex-col pt-20 bg-putih items-center justify-center">
          <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-putih shadow-2xl rounded-2xl">
            <div className="text-lg font-medium leading-6 text-putih bg-merah rounded text-center mb-5 -mt-7 -mx-10 flex justify-center">
              <img
                src={Logo1}
                alt="TheChefBook"
                className="rounded-full w-14"
              />
            </div>
            <div className="flex flex-col gap-y-5">
              <div className="flex flex-col items-center text-sm">
                <p>Please Wait</p>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
  if (verified) {
    return (
      <>
        <div className="min-h-screen flex flex-col pt-20 bg-putih items-center justify-center">
          <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-putih shadow-2xl rounded-2xl">
            <div className="text-lg font-medium leading-6 text-putih bg-merah rounded text-center mb-5 -mt-7 -mx-10 flex justify-center">
              <h1 className="h-20 w-100 flex justify-center items-center text-xl">
                Welcome to our family, {username}!
              </h1>
            </div>
            <div className="flex flex-col gap-y-5">
              <div className="flex flex-col items-center justify-center text-center text-sm">
                <p>
                  Your account has been verified!
                  <br />
                  Please enjoy your stay here and enjoy all the features you
                  have been waiting to use!
                  <br />
                  You will be redirected to home page immediately, if it's
                  taking too long please click the button below
                </p>
              </div>
              <button
                type="button"
                className="hover:text-white shadow-md hover:shadow-black inline-flex justify-center px-4 py-2 text-sm font-medium text-putih bg-hijau border border-transparent rounded-md  focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-biru duration-500"
                onClick={() => navigate("/home")}
              >
                Go back to Home Page
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <div className="min-h-screen flex flex-col pt-20 bg-putih items-center justify-center">
        <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-putih shadow-2xl rounded-2xl">
          <div className="relative text-lg font-medium leading-6 text-putih bg-merah rounded text-center mb-5 -mt-7 -mx-10">
            <h1 className="h-20 w-100 flex justify-center items-center text-xl">
              Ooppss!
            </h1>
          </div>
          <div className="flex flex-col gap-y-5">
            <div className="flex flex-col relative text-sm">
              <p>
                Something went wrong with your verification email, please click
                the button below to resend the email.
              </p>
            </div>
          </div>
          <div className="mt-6 flex flex-col">
            <button
              type="button"
              className="hover:text-white shadow-md hover:shadow-black inline-flex justify-center px-4 py-2 text-sm font-medium text-putih bg-hijau border border-transparent rounded-md  focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-biru duration-500"
              onClick={() => sendEmail()}
            >
              Re-send Email Verification
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Verification;
