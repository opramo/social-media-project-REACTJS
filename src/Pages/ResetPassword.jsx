import axios from "axios";
import { EyeIcon, EyeOffIcon } from "@heroicons/react/outline";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import API_URL from "../Helpers/apiurl";
import * as Yup from "yup";
import Loading from "../components/Loading";
import ModalForgotPassword from "../components/ModalForgotPassword";

function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [succeed, setSucceed] = useState(false);
  const [passVis, setPassVis] = useState(false);
  const [tokenAlive, setTokenAlive] = useState(false);
  const [passConfVis, setPassConfVis] = React.useState(false);
  const [modalForgotPassword, setModalForgotPassword] = React.useState(false);

  const initialValues = {
    password: "",
    passwordConfirm: "",
  };

  const modalForgotPasswordHandler = () => {
    setModalForgotPassword(!modalForgotPassword);
  };

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(8, "Password is too short - minimimum of 8 characters.")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        "Must also contain uppercase, number, and special character."
      )
      .required("Password is required!"),
    passwordConfirm: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords do not match.")
      .required("Passwords do not match."),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      setLoading(true);
      await axios.post(
        `${API_URL}/auth/change-password`,
        { password: values.password },
        {
          headers: {
            authorization: token,
          },
        }
      );
      setSucceed(true);
      setTimeout(() => {
        toast.success("Password Changed!", {
          position: "top-center",
          theme: "colored",
          style: { backgroundColor: "#3A7D44" },
        });
      }, 250);
    } catch (error) {
      setLoading(false);
      console.log(error);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  useEffect(() => {
    (async function tokenCheck() {
      try {
        await axios.get(`${API_URL}/auth/token-password`, {
          headers: {
            authorization: token,
          },
        });
        setTokenAlive(true);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line
  }, []);

  if (succeed) {
    return (
      <>
        <div className="min-h-screen flex flex-col pt-20 bg-putih items-center justify-center">
          <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-putih shadow-2xl rounded-2xl">
            <div className="text-lg font-medium leading-6 text-putih bg-merah rounded text-center mb-5 -mt-7 -mx-10 flex justify-center">
              <h1 className="h-20 w-100 flex justify-center items-center text-xl">
                Your password has been changed!
              </h1>
            </div>
            <div className="flex flex-col gap-y-5">
              <div className="flex flex-col items-center justify-center text-center text-sm">
                <p>
                  You can continue log in your account by pressing the Log In
                  Button on the navigation bar above!
                </p>
                <p>
                  Or go back to the Landing Page by pressing the button below!
                </p>
              </div>
              <button
                type="button"
                className="hover:text-white shadow-md hover:shadow-black inline-flex justify-center px-4 py-2 text-sm font-medium text-putih bg-hijau border border-transparent rounded-md  focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-biru duration-500"
                onClick={() => navigate("/")}
              >
                Go back to Landing Page
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <div className="min-h-screen flex flex-col pt-20 bg-putih items-center justify-center">
          <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-putih shadow-2xl rounded-2xl">
            <div className="text-lg h-16 font-medium leading-6 text-putih bg-merah rounded text-center mb-5 -mt-7 -mx-10 flex justify-center items-center">
              Please Wait...
            </div>
            <div className="flex justify-center items-centerflex-col gap-y-5">
              <Loading className={`w-10 h-10 animate-spin`} />
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!tokenAlive) {
    return (
      <>
        <ModalForgotPassword
          modalForgotPassword={modalForgotPassword}
          modalForgotPasswordHandler={modalForgotPasswordHandler}
        />
        <div className="min-h-screen flex flex-col pt-20 bg-putih items-center justify-center">
          <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-putih shadow-2xl rounded-2xl">
            <div className="relative text-lg font-medium leading-6 text-putih bg-merah rounded text-center mb-5 -mt-7 -mx-10">
              <h1 className="h-20 w-100 flex justify-center items-center text-xl">
                Ooppss!
              </h1>
            </div>
            <div className="flex flex-col gap-y-5">
              <div className="flex flex-col relative text-sm justify-center items-center text-center">
                <p>
                  Something went wrong with your reset password link, please
                  click the button below to resend the email.
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-col">
              <button
                type="button"
                className="hover:text-white shadow-md hover:shadow-black inline-flex justify-center px-4 py-2 text-sm font-medium text-putih bg-hijau border border-transparent rounded-md  focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-biru duration-500"
                onClick={() => modalForgotPasswordHandler()}
              >
                Forgot password
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
              Enter New Password
            </h1>
          </div>
          <Formik
            initialValues={initialValues}
            // isValid
            // validateOnMount
            // validateOnBlur={false}

            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {(formik) => {
              const {
                handleChange,
                errors,
                touched,
                isSubmitting,
                isValid,
                values,
                dirty,
                handleBlur,
              } = formik;

              return (
                <Form className="flex flex-col gap-y-1">
                  {/* Password */}
                  <div className="flex flex-col relative">
                    <label htmlFor="password">Password</label>
                    <input
                      name="password"
                      placeholder="Password*"
                      type={passVis ? "text" : "password"}
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      onBlur={handleBlur}
                      value={values.password}
                      className={
                        errors.password &&
                        touched.password &&
                        values.password.length &&
                        dirty
                          ? "p-2 px-4 outline outline-merah outline-2 rounded bg-putih"
                          : "p-2 px-4 focus:outline focus:outline-biru focus:outline-2 rounded bg-putih"
                      }
                    />
                    {errors.password &&
                    touched.password &&
                    dirty &&
                    values.password.length ? (
                      <div
                        name="password"
                        className="text-merah -mt-5 ml-2 text-xs absolute bg-putih px-2 -bottom-2 pointer-events-none"
                      >
                        {errors.password}
                      </div>
                    ) : null}
                    <div
                      className="w-7 h-7 right-2  top-7 absolute cursor-pointer overflow-hidden"
                      onClick={() => setPassVis(!passVis)}
                    >
                      {passVis ? <EyeIcon /> : <EyeOffIcon />}
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="flex flex-col relative">
                    <label htmlFor="passwordConfirm">Confirm Password</label>
                    <input
                      name="passwordConfirm"
                      placeholder="Confirm Password"
                      type={passConfVis ? "text" : "password"}
                      onChange={(e) => {
                        handleChange(e);
                      }}
                      onBlur={handleBlur}
                      value={values.passwordConfirm}
                      className={
                        errors.passwordConfirm &&
                        values.passwordConfirm.length &&
                        dirty
                          ? "p-2 px-4 outline outline-merah outline-2 rounded bg-putih"
                          : "p-2 px-4 focus:outline focus:outline-biru focus:outline-2 rounded bg-putih"
                      }
                    />
                    {errors.passwordConfirm &&
                    dirty &&
                    values.passwordConfirm.length ? (
                      <div
                        name="passwordConfirm"
                        className="text-merah -mt-5 ml-2 text-xs absolute bg-putih px-2 -bottom-2 pointer-events-none"
                      >
                        {errors.passwordConfirm}
                      </div>
                    ) : null}
                    <div
                      className="w-7 h-7 right-2  top-7 absolute cursor-pointer overflow-hidden"
                      onClick={() => {
                        setPassConfVis(!passConfVis);
                      }}
                    >
                      {passConfVis ? <EyeIcon /> : <EyeOffIcon />}
                    </div>
                  </div>
                  {/* Button Submit */}
                  <div className="mt-4 flex items-center justify-between">
                    <button
                      type="submit"
                      disabled={!dirty || !isValid || isSubmitting}
                      className={`justify-center px-4 py-2 text-sm font-medium border rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 
                          focus-visible:ring-biru duration-500
                          hover:text-putih shadow-md hover:shadow-black text-putih bg-hijau border-transparent 
                          disabled:bg-putih disabled:shadow-none disabled:border-merah disabled:text-white disabled:cursor-not-allowed
                        }`}
                    >
                      Change Password
                    </button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </>
  );
}

export default ResetPassword;
