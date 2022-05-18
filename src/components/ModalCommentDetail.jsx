import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { Fragment } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import axios from "axios";
import API_URL from "../Helpers/apiurl";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const ModalCommentDetail = (props) => {
  const dispatch = useDispatch();

  const validationSchema = Yup.object({
    comment: Yup.string().max(
      300,
      "You are exceeding the maximum characters limit! (300 characters)."
    ),
  });
  const initialValues = {
    comment: "",
  };

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      let token = Cookies.get("token");
      let res = await axios.post(
        `${API_URL}/recipe/comment-recipe`,
        {
          comment: values.comment,
          post_id: props.post_id,
        },
        {
          headers: { authorization: token },
        }
      );
      dispatch({ type: "NEWCOMMENT" });
      props.setComments(res.data);
      toast.success("Comment Sent!", {
        theme: "colored",
        position: "top-center",
        style: { backgroundColor: "#3A7D44" },
      });
      setTimeout(() => {
        props.modalCommentDetailHandler();
      }, 1000);
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <>
      <Transition appear show={props.modalCommentDetail} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto bg-black/50"
          onClose={props.modalCommentDetailHandler}
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
                  <h1 className="h-20 w-100 flex justify-center items-center text-xl">
                    Leave a comment below!
                  </h1>
                  <XIcon
                    className="h-5 w-5 absolute top-1/2 right-8 -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:text-white text-white/50 duration-500 border-2 border-white/30 rounded-full hover:bg-white/30 hover:border-transparent"
                    onClick={props.modalCommentDetailHandler}
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
                    const { errors, touched, isSubmitting, values, dirty } =
                      formik;
                    console.log(errors.comment);
                    return (
                      <Form>
                        <div className="flex flex-col relative">
                          <textarea
                            type="text"
                            name="comment"
                            cols="30"
                            rows="10"
                            spellCheck="false"
                            placeholder="(e.g. I like your recipe!)"
                            className={`p-2 outline outline-2 rounded bg-putih w-full disabled:cursor-not-allowed 
                            disabled:outline-gray-600 focus:bg-white ${
                              errors.comment ? "outline-merah" : "outline-biru"
                            }`}
                          />
                          {errors.comment && (
                            <div
                              component="div"
                              name="comment"
                              className="text-merah -mt-5 mx-10 text-xs absolute bottom-2  pointer-events-none"
                            >
                              {errors.comment}
                            </div>
                          )}
                        </div>
                        <div className="mt-2 flex justify-center">
                          <button
                            disabled={!formik.dirty || !formik.isValid}
                            type="input"
                            className="shadow-md inline-flex justify-center px-4 py-2 text-sm font-medium text-putih bg-hijau border border-transparent rounded-md 
                            disabled:shadow-none disabled:text-white disabled:bg-putih disabled:border-merah disabled:cursor-not-allowed
                           hover:text-white hover:shadow-black focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-biru duration-500"
                          >
                            Submit Comment
                          </button>
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

export default ModalCommentDetail;
