import { Dialog, Transition } from "@headlessui/react";
import { EyeIcon, EyeOffIcon, XIcon } from "@heroicons/react/outline";
import axios from "axios";
import { Form, Formik } from "formik";
import { Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import API_URL from "../Helpers/apiurl";
import Cookies from "js-cookie";
import Loading from "./Loading";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// USE FORMIK ERRORMESSAGE CHILDREN PROPS TO RENDER VALIDATION FROM SERVER//
const ModalSignUp = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    modalSignUp,
    setModalSignUp,
    modalSignUpHandler,
    modalLogInHandler,
    passVis,
    setPassVis,
    setPassConfVis,
    passConfVis,
  } = props;
  const { loading, error_mes } = useSelector((state) => state.user);
  const [changed, setChanged] = useState(false);

  let message = [];
  if (error_mes && modalSignUp) {
    message = error_mes.split(",");
  }

  const initialValues = {
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  };

  const containSpaces = (string) => / /g.test(string);
  const validationSchema = Yup.object({
    username: Yup.string()
      .min(4, "Username must be 4 to 15 characters.")
      .max(15, "Username  must be 4 to 15 characters.")
      // .matches(/^[a-zA-Z0-9]+$/, "Cannot contain special characters or spaces")
      .test(
        "Must not contain a space",
        "Must not contain a space",
        (value) => !containSpaces(value)
      )
      .required("Username is required!"),
    email: Yup.string()
      .email("Invalid email address.")
      .required("Email is required!"),
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
      setChanged(false);
      dispatch({ type: "LOADING" });
      let res = await axios.post(`${API_URL}/auth/register`, values);
      dispatch({ type: "LOGIN", payload: res.data });
      Cookies.set("token", res.headers["x-token-access"]);
      setTimeout(() => {
        modalSignUpHandler();
        navigate("/verifyaccount");
        toast.success(`Welcome, ${res.data.username}!`, {
          theme: "colored",
          position: "top-center",
          style: { backgroundColor: "#3A7D44" },
        });
      }, 1000);
    } catch (error) {
      console.log(`masuk error`);
      dispatch({
        type: "ERROR",
        payload: error.response.data.message || "Network Error",
      });
    } finally {
      dispatch({ type: "DONE" });
      setSubmitting(false);
    }
  };

  return (
    <>
      <Transition appear show={modalSignUp} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto bg-black/50"
          onClose={() => {
            modalSignUpHandler();
          }}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-putih shadow-2xl rounded-2xl">
                <Dialog.Title
                  as="div"
                  className="relative text-lg font-medium leading-6 text-putih bg-merah rounded text-center mb-5 -mt-7 -mx-10"
                >
                  <h1 className="h-20 w-100 flex justify-center items-center text-3xl">
                    Sign Up
                  </h1>
                  <XIcon
                    className="h-5 w-5 absolute top-1/2 right-8 -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:text-white 
                    text-white/50 duration-500 border-2 border-white/30 rounded-full hover:bg-white/30 hover:border-transparent"
                    onClick={() => {
                      modalSignUpHandler();
                      // dispatch({ type: "DONE" });
                    }}
                  />
                </Dialog.Title>
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
                        {/* Username */}
                        <div className="flex flex-col relative">
                          <label htmlFor="username">Username</label>
                          <input
                            name="username"
                            placeholder="Username*"
                            type="text"
                            onChange={(e) => {
                              setChanged(true);
                              handleChange(e);
                            }}
                            onBlur={handleBlur}
                            value={values.username}
                            className={
                              (errors.username &&
                                touched.username &&
                                values.username.length &&
                                dirty) ||
                              (message[0] && !changed)
                                ? "p-2 px-4 outline outline-merah outline-2 rounded bg-putih"
                                : "p-2 px-4 focus:outline focus:outline-biru focus:outline-2 rounded bg-putih"
                            }
                          />

                          {errors.username &&
                          touched.username &&
                          dirty &&
                          values.username.length ? (
                            <div
                              name="username"
                              className="text-merah -mt-5 ml-2 text-xs absolute bg-putih px-2 -bottom-2 pointer-events-none"
                            >
                              {errors.username}
                            </div>
                          ) : null}
                          {message[0] && !changed && (
                            <div className="text-merah -mt-5 ml-2 text-xs absolute bg-putih px-2 -bottom-2 pointer-events-none">
                              {message[0]}
                            </div>
                          )}
                        </div>

                        {/* Email */}
                        <div className="flex flex-col relative">
                          <label htmlFor="email">Email</label>
                          <input
                            name="email"
                            placeholder="Email*"
                            type="text"
                            onChange={(e) => {
                              setChanged(true);
                              handleChange(e);
                            }}
                            onBlur={handleBlur}
                            value={values.email}
                            className={
                              (errors.email &&
                                touched.email &&
                                values.email.length &&
                                dirty) ||
                              (message[1] && !changed)
                                ? "p-2 px-4 outline outline-merah outline-2 rounded bg-putih"
                                : "p-2 px-4 focus:outline focus:outline-biru focus:outline-2 rounded bg-putih"
                            }
                          />
                          {errors.email &&
                          touched.email &&
                          dirty &&
                          values.email.length ? (
                            <div
                              name="email"
                              className="text-merah -mt-5 ml-2 text-xs absolute bg-putih px-2 -bottom-2 pointer-events-none"
                            >
                              {errors.email}
                            </div>
                          ) : null}
                          {message[1] && !changed && (
                            <div className="text-merah -mt-5 ml-2 text-xs absolute bg-putih px-2 -bottom-2 pointer-events-none">
                              {message[1]}
                            </div>
                          )}
                        </div>

                        {/* Password */}
                        <div className="flex flex-col relative">
                          <label htmlFor="password">Password</label>
                          <input
                            name="password"
                            placeholder="Password*"
                            type={passVis ? "text" : "password"}
                            onChange={(e) => {
                              setChanged(true);
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
                          <label htmlFor="passwordConfirm">
                            Confirm Password
                          </label>
                          <input
                            name="passwordConfirm"
                            placeholder="Confirm Password"
                            type={passConfVis ? "text" : "password"}
                            onChange={(e) => {
                              setChanged(true);
                              handleChange(e);
                            }}
                            onBlur={handleBlur}
                            value={values.passwordConfirm}
                            className={
                              errors.passwordConfirm &&
                              touched.passwordConfirm &&
                              values.passwordConfirm.length &&
                              dirty
                                ? "p-2 px-4 outline outline-merah outline-2 rounded bg-putih"
                                : "p-2 px-4 focus:outline focus:outline-biru focus:outline-2 rounded bg-putih"
                            }
                          />
                          {errors.passwordConfirm &&
                          touched.passwordConfirm &&
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
                          {loading ? (
                            <Loading
                              className={"animate-spin h-10 w-10 ml-5"}
                            />
                          ) : (
                            <button
                              type="submit"
                              disabled={
                                !dirty ||
                                !isValid ||
                                isSubmitting ||
                                loading ||
                                !changed
                              }
                              className={`justify-center px-4 py-2 text-sm font-medium border rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 
                          focus-visible:ring-biru duration-500
                          hover:text-putih shadow-md hover:shadow-black text-putih bg-hijau border-transparent 
                          disabled:bg-putih disabled:shadow-none disabled:border-merah disabled:text-white disabled:cursor-not-allowed
                        }`}
                            >
                              Sign Up
                            </button>
                          )}
                          <div className="text-xs">
                            <span>Already have an account? </span>
                            <span
                              className="hover:underline hover:text-biru duration-500 cursor-pointer"
                              onClick={() => {
                                modalSignUpHandler();
                                setTimeout(() => {
                                  modalLogInHandler();
                                }, 500);
                              }}
                            >
                              Sign in here!
                            </span>
                          </div>
                        </div>
                      </Form>
                    );
                  }}
                </Formik>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ModalSignUp;
