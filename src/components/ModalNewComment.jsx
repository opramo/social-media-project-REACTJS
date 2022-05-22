import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { Fragment, useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { Field, Form, Formik } from "formik";
import axios from "axios";
import API_URL from "../Helpers/apiurl";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import Loading from "./Loading";

const ModalNewComment = (props) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const {
    modalNewComment,
    modalNewCommentHandler,
    post_id,
    setComments,
    setModalNewComment,
  } = props;
  const [loading, setLoading] = useState(false);
  const validationSchema = Yup.object({
    comment: Yup.string().max(
      300,
      "You are exceeding the maximum characters limit! (300 chars)."
    ),
  });
  const initialValues = {
    comment: "",
  };

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      setLoading(true);
      let token = Cookies.get("token");
      let res = await axios.post(
        `${API_URL}/recipe/comment-recipe`,
        {
          comment: values.comment,
          post_id: post_id,
        },
        {
          headers: { authorization: token },
        }
      );
      dispatch({ type: "NEWCOMMENT" });
      setComments(res.data.splice(0, 5));
      toast.success("Comment Sent!", {
        theme: "colored",
        position: "top-center",
        style: { backgroundColor: "#3A7D44" },
      });
      setTimeout(() => {
        modalNewCommentHandler();
        if (location.pathname === `/recipe/${post_id}`) {
          window.location.reload();
        }
      }, 250);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };
  return (
    <>
      <Transition appear show={modalNewComment} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto bg-black/50"
          open={modalNewComment}
          onClose={() => setModalNewComment(false)}
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
                    Leave a comment below!
                  </h1>
                  <XIcon
                    className="h-5 w-5 absolute top-1/2 right-8 -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:text-white text-white/50 duration-500 border-2 border-white/30 rounded-full hover:bg-white/30 hover:border-transparent"
                    onClick={modalNewCommentHandler}
                  />
                </Dialog.Title>
                <Formik
                  // component="div"
                  initialValues={initialValues}
                  isValid
                  // validateOnMount
                  // validateOnBlur={false}

                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                  className="flex flex-col gap-y-5"
                >
                  {(formik) => {
                    const { errors, isSubmitting, dirty, isValid } = formik;
                    return (
                      <Form>
                        <div className="flex flex-col relative">
                          <Field
                            as="textarea"
                            type="text"
                            name="comment"
                            cols="30"
                            rows="10"
                            spellCheck="false"
                            placeholder="(e.g. I like your recipe!)"
                            className={`p-2 outline outline-2 rounded bg-putih w-full disabled:cursor-not-allowed disabled:outline-gray-600  ${
                              errors.comment ? "outline-merah" : "outline-biru"
                            }`}
                          />
                          {errors.comment ? (
                            <div
                              name="comment"
                              className="text-merah -mt-5 ml-3 px-1 bg-putih -bottom-2 text-xs absolute  pointer-events-none"
                            >
                              {errors.comment}
                            </div>
                          ) : null}
                        </div>
                        <div className="mt-4 flex justify-center">
                          {loading ? (
                            <Loading
                              className={"animate-spin h-10 w-10 ml-5"}
                            />
                          ) : (
                            <button
                              disabled={!dirty || !isValid || isSubmitting}
                              type="input"
                              className="shadow-md inline-flex justify-center px-4 py-2 text-sm font-medium text-putih bg-hijau border border-transparent rounded-md 
                            disabled:shadow-none disabled:text-white disabled:bg-putih disabled:border-merah disabled:cursor-not-allowed
                           hover:text-white hover:shadow-black focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-biru duration-500"
                            >
                              Submit Comment
                            </button>
                          )}
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

export default ModalNewComment;
