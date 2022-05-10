import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Link } from "react-router-dom";
import { EyeIcon, EyeOffIcon, XIcon } from "@heroicons/react/outline";
import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { loginAction } from "../Redux/Actions/userActions";

//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!//
// POINTERS EVENT NONE ERRORMESSAGE

const ModalLogIn = (props) => {
  const { loading, error_mes } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [changed, setChanged] = useState(false);

  let message = [];
  if (error_mes && props.modalLogIn) {
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
      dispatch(loginAction(values));
    } catch (error) {
      console.log(error);
    } finally {
      onSubmitProps.setSubmitting(false);
    }
  };
  return (
    <>
      <Transition appear show={props.modalLogIn} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto bg-black/30"
          onClose={() => {
            props.modalLogInHandler();
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
                    Log In
                  </h1>
                  <XIcon
                    className="h-5 w-5 absolute top-1/2 right-8 -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:text-white text-white/50 duration-500 border-2 border-white/30 rounded-full hover:bg-white/30 hover:border-transparent"
                    onClick={() => {
                      props.modalLogInHandler();
                    }}
                  />
                </Dialog.Title>
                <Formik
                  initialValues={initialValues}
                  // isValid
                  validateOnMount
                  // validateOnBlur={false}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                >
                  {(formik) => {
                    // if (formik.values.personId === "") {
                    //   dispatch({ type: "CLEARERROR" });
                    // }
                    // if (formik.values.password === "") {
                    //   dispatch({ type: "CLEARERROR" });
                    // }

                    return (
                      <Form className="flex flex-col gap-y-1">
                        {/* Email/Username */}
                        <div className="flex flex-col relative">
                          <label htmlFor="personId">Username/Email</label>
                          <Field
                            name="personId"
                            placeholder="Username/Email"
                            type="text"
                            className={
                              (formik.errors.personId &&
                                formik.touched.personId) ||
                              message[0]
                                ? "p-2 outline outline-merah outline-2 rounded bg-putih"
                                : "p-2 focus:outline focus:outline-biru focus:outline-2 rounded bg-putih"
                            }
                          />
                          <ErrorMessage
                            component="div"
                            name="personId"
                            className="text-merah -mt-5 ml-2 text-xs absolute bottom-0 pointer-events-none"
                          />

                          {message[0] &&
                            !(
                              formik.errors.personId &&
                              formik.touched.personId &&
                              formik.values.personId === ""
                            ) && (
                              <div className="text-merah -mt-5 ml-2 text-xs absolute bottom-0 pointer-events-none">
                                {error_mes}
                              </div>
                            )}
                        </div>
                        {/* Password */}
                        <div className="flex flex-col relative">
                          <label htmlFor="password">Password</label>
                          <Field
                            name="password"
                            placeholder="Password"
                            type={props.passVis ? "text" : "password"}
                            className={
                              (formik.errors.password &&
                                formik.touched.password) ||
                              message[1]
                                ? "p-2 outline outline-merah outline-2 rounded bg-putih"
                                : "p-2 focus:outline focus:outline-biru focus:outline-2 rounded bg-putih"
                            }
                          />
                          <ErrorMessage
                            component="div"
                            name="password"
                            className="text-merah -mt-5 ml-2 text-xs absolute bottom-0 pointer-events-none"
                          />
                          {message[1] &&
                            !(
                              formik.errors.password &&
                              formik.touched.password &&
                              formik.dirty
                            ) && (
                              <div className="text-merah -mt-5 ml-2 text-xs absolute bottom-0 pointer-events-none">
                                {message[1]}
                              </div>
                            )}
                          <div
                            className="w-7 h-7 right-2  top-7 absolute cursor-pointer overflow-hidden"
                            onClick={() => props.setPassVis(!props.passVis)}
                          >
                            {props.passVis ? <EyeIcon /> : <EyeOffIcon />}
                          </div>
                        </div>
                        <div className="mt-4 flex items-end justify-between">
                          <div className="flex flex-col items-start">
                            <div>
                              <Field
                                type="checkbox"
                                name="remember"
                                id=""
                                className="mb-4 mr-2 cursor-pointer"
                              />
                              <label>Remember me</label>
                            </div>
                            <button
                              type="submit"
                              disabled={
                                !formik.isValid ||
                                formik.isSubmitting ||
                                loading
                              }
                              className="shadow-md inline-flex justify-center px-4 py-2 text-sm font-medium text-putih bg-hijau border border-transparent rounded-md 
                               disabled:shadow-none disabled:text-white disabled:bg-putih disabled:border-merah disabled:cursor-not-allowed
                              hover:text-white hover:shadow-black focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-biru duration-500"
                            >
                              Log In
                            </button>
                          </div>
                          <Link to="">
                            <span
                              className="hover:underline hover:text-biru duration-500"
                              onClick={() => {
                                props.modalLogInHandler();
                                props.modalForgotPasswordHandler();
                              }}
                            >
                              Forgot Password?
                            </span>
                          </Link>
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
