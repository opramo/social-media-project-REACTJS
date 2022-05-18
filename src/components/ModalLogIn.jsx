import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { EyeIcon, EyeOffIcon, XIcon } from "@heroicons/react/outline";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import API_URL from "../Helpers/apiurl";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!//
// POINTERS EVENT NONE ERRORMESSAGE

const ModalLogIn = (props) => {
  const {
    modalLogIn,
    modalLogInHandler,
    setModalLogIn,
    passVis,
    setPassVis,
    modalSignUpHandler,
    modalForgotPasswordHandler,
  } = props;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error_mes } = useSelector((state) => state.user);
  const [changed, setChanged] = useState(false);

  let message = [];
  if (error_mes && modalLogIn) {
    message = error_mes.split(",");
  }
  const initialValues = {
    personId: "",
    password: "",
  };
  const containSpaces = (string) => / /g.test(string);
  const validationSchema = Yup.object({
    personId: Yup.string()
      .required("Username/Email is required!")
      .test(
        "Must not contain a space",
        "Must not contain a space",
        (value) => !containSpaces(value)
      ),
    password: Yup.string().required("Password is required!"),
  });

  const onSubmit = async (values, onSubmitProps) => {
    try {
      console.log(values);
      setChanged(false);
      dispatch({ type: "LOADING" });
      let res = await axios.post(`${API_URL}/auth/login`, {
        username: values.personId,
        email: values.personId,
        password: values.password,
      });
      Cookies.set("token", res.headers["x-token-access"]);
      dispatch({ type: "LOGIN", payload: res.data });
      setModalLogIn(false);
      console.log(`Berhasil Log In`);
      toast.success(`Welcome back, ${values.personId}!`, {
        theme: "colored",
        position: "top-center",
        style: { backgroundColor: "#3A7D44" },
      });
      setTimeout(() => {
        navigate("/home");
      }, 1000);
    } catch (error) {
      dispatch({
        type: "ERROR",
        payload: error.response.data.message || "Network Error",
      });
    } finally {
      onSubmitProps.setSubmitting(false);
      dispatch({ type: "DONE" });
    }
  };
  return (
    <>
      <Transition appear show={modalLogIn} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto bg-black/30"
          onClose={() => {
            modalLogInHandler();
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
            ></span>
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
                    Log In
                  </h1>
                  <XIcon
                    className="h-5 w-5 absolute top-1/2 right-8 -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:text-white text-white/50 duration-500 border-2 border-white/30 rounded-full hover:bg-white/30 hover:border-transparent"
                    onClick={(e) => {
                      e.stopPropagation();
                      setModalLogIn(false);
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
                        {/* Email/Username */}
                        <div className="flex flex-col relative">
                          <label htmlFor="personId">Username/Email</label>
                          <input
                            name="personId"
                            placeholder="Username/Email"
                            type="text"
                            onChange={(e) => {
                              setChanged(true);
                              handleChange(e);
                            }}
                            onBlur={handleBlur}
                            value={values.personId}
                            className={
                              (errors.personId &&
                                touched.personId &&
                                values.personId.length &&
                                dirty) ||
                              (message[0] && !changed)
                                ? "p-2 px-4 outline outline-merah outline-2 rounded bg-putih"
                                : "p-2 px-4 focus:outline focus:outline-biru focus:outline-2 rounded bg-putih"
                            }
                          />

                          {errors.personId &&
                          touched.personId &&
                          dirty &&
                          values.personId.length ? (
                            <div
                              name="personId"
                              className="text-merah -mt-5 ml-2 text-xs absolute bg-putih px-2 -bottom-2 pointer-events-none"
                            >
                              {errors.personId}
                            </div>
                          ) : null}

                          {message[0] && !changed && (
                            <div className="text-merah -mt-5 ml-2 text-xs absolute bg-putih px-2 -bottom-2 pointer-events-none">
                              {error_mes}
                            </div>
                          )}
                        </div>

                        {/* Password */}
                        <div className="flex flex-col relative">
                          <label htmlFor="password">Password</label>
                          <input
                            name="password"
                            placeholder="Password"
                            type={passVis ? "text" : "password"}
                            onChange={(e) => {
                              setChanged(true);
                              handleChange(e);
                            }}
                            autoFocus={false}
                            value={values.password}
                            onBlur={handleBlur}
                            className={
                              (errors.password &&
                                touched.password &&
                                values.password.length) ||
                              (message[1] && !changed)
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
                          {message[1] && !changed && (
                            <div className="text-merah bg-putih px-2 -mt-5 ml-2 text-xs absolute -bottom-2 pointer-events-none">
                              {message[1]}
                            </div>
                          )}
                          <div
                            className="w-7 h-7 right-2  top-7 absolute cursor-pointer overflow-hidden"
                            onClick={() => setPassVis(!passVis)}
                          >
                            {passVis ? <EyeIcon /> : <EyeOffIcon />}
                          </div>
                        </div>
                        <div className="mt-4 flex items-end justify-between">
                          <div className="flex flex-col items-start">
                            <div className="text-xs mb-4">
                              <span>Don't have an account? </span>
                              <span
                                className="hover:underline hover:text-biru duration-500 cursor-pointer"
                                onClick={() => {
                                  modalLogInHandler();
                                  setTimeout(() => {
                                    modalSignUpHandler();
                                  }, 500);
                                }}
                              >
                                Register here!
                              </span>
                            </div>
                            <button
                              type="submit"
                              disabled={
                                !dirty || !isValid || isSubmitting || loading
                              }
                              className="shadow-md inline-flex justify-center px-4 py-2 text-sm font-medium text-putih bg-hijau border border-transparent rounded-md 
                               disabled:shadow-none disabled:text-white disabled:bg-putih disabled:border-merah disabled:cursor-not-allowed
                              hover:text-white hover:shadow-black focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-biru duration-500"
                            >
                              Log In
                            </button>
                          </div>

                          <span
                            className="hover:underline hover:text-biru duration-500"
                            onClick={() => {
                              modalLogInHandler();
                              setTimeout(() => {
                                modalForgotPasswordHandler();
                              }, 500);
                            }}
                          >
                            Forgot Password?
                          </span>
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

export default ModalLogIn;
