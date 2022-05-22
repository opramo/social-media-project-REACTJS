import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import axios from "axios";
import { Fragment, useState } from "react";
import { toast } from "react-toastify";
import API_URL from "../Helpers/apiurl";
import Loading from "./Loading";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";

const ModalForgotPassword = (props) => {
  const dispatch = useDispatch();
  const { error_mes } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [changed, setChanged] = useState(false);
  const [succeed, setSucceed] = useState(false);
  const { modalForgotPassword, modalForgotPasswordHandler } = props;

  const initialValues = {
    email: "",
  };
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address.")
      .required("Email is required!"),
  });

  const onSubmit = async (values) => {
    try {
      setLoading(true);
      dispatch({ type: "LOADING" });
      await axios.post(`${API_URL}/auth/forgot-password`, {
        email: values.email,
      });
      setSucceed(true);
      toast.success("Email sent!", {
        position: "top-center",
        theme: "colored",
        style: { backgroundColor: "#3A7D44" },
      });
      setTimeout(() => {
        setSucceed(false);
        modalForgotPasswordHandler();
      }, 3000);
    } catch (error) {
      console.log(error);
      dispatch({
        type: "ERROR",
        payload: error.response.data.message || "Network Error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Transition appear show={modalForgotPassword} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto bg-black/50"
          onClose={modalForgotPasswordHandler}
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
                  <h1 className="h-20 w-100 flex justify-center items-center text-xl">
                    {loading && !succeed && "Please wait..."}
                    {!loading && !succeed && "Forgot Password?"}
                    {succeed && "Email sent!"}
                  </h1>
                  {!loading && (
                    <XIcon
                      className="h-5 w-5 absolute top-1/2 right-8 -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:text-white text-white/50 duration-500 border-2 border-white/30 rounded-full hover:bg-white/30 hover:border-transparent"
                      onClick={() => modalForgotPasswordHandler()}
                    />
                  )}
                </Dialog.Title>
                {loading && !succeed && (
                  <div className="flex justify-center">
                    <Loading className={"w-10 h-10 animate-spin"} />
                  </div>
                )}
                {!loading && !succeed && (
                  <>
                    <Formik
                      initialValues={initialValues}
                      validationSchema={validationSchema}
                      onSubmit={onSubmit}
                    >
                      {(formik) => {
                        const {
                          handleChange,
                          errors,
                          isSubmitting,
                          isValid,
                          values,
                          dirty,
                          handleBlur,
                        } = formik;

                        return (
                          <Form className="flex flex-col gap-y-1">
                            <div className="flex flex-col relative">
                              <div className="flex justify-center">
                                Please input the registered email
                              </div>
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
                                    values.email.length &&
                                    dirty) ||
                                  (error_mes && !changed)
                                    ? "p-2 px-4 outline outline-merah outline-2 rounded bg-putih"
                                    : "p-2 px-4 focus:outline focus:outline-biru focus:outline-2 rounded bg-putih"
                                }
                              />
                              {errors.email && dirty && values.email.length ? (
                                <div
                                  name="email"
                                  className="text-merah -mt-5 ml-2 text-xs absolute bg-putih px-2 -bottom-2 pointer-events-none"
                                >
                                  {errors.email}
                                </div>
                              ) : null}
                              {error_mes && !changed && (
                                <div className="text-merah -mt-5 ml-2 text-xs absolute bg-putih px-2 -bottom-2 pointer-events-none">
                                  {error_mes}
                                </div>
                              )}
                            </div>
                            <div className="mt-2 flex flex-col items-center">
                              <button
                                disabled={!dirty || !isValid || isSubmitting}
                                type="submit"
                                className="justify-center px-4 py-2 text-sm font-medium border rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 
                                      focus-visible:ring-biru duration-500
                                      hover:text-putih shadow-md hover:shadow-black text-putih bg-hijau border-transparent 
                                      disabled:bg-putih disabled:shadow-none disabled:border-merah disabled:text-white disabled:cursor-not-allowed"
                                onClick={() => setChanged(false)}
                              >
                                Reset Password
                              </button>
                            </div>
                          </Form>
                        );
                      }}
                    </Formik>
                  </>
                )}
                {succeed && (
                  <div className="text-center">
                    A reset password email has been sent to your email, please
                    kindly check your email and click the link attached to the
                    email to rest your password.
                  </div>
                )}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ModalForgotPassword;
