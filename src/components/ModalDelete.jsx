import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { Fragment, useState } from "react";
import axios from "axios";
import API_URL from "../Helpers/apiurl";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import Loading from "./Loading";

const ModalDelete = (props) => {
  const { modalDelete, modalDeleteHandler, setDeleteRecipe } = props;
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const onSubmit = async () => {
    try {
      setLoading(true);
      let token = Cookies.get("token");
      await axios.post(
        `${API_URL}/recipe/delete-recipe`,
        {
          post_id: props.post_id,
        },
        {
          headers: { authorization: token },
        }
      );
      toast.success("Deleted!", {
        theme: "colored",
        position: "top-center",
        style: { backgroundColor: "#3A7D44" },
      });
      setLoading(false);
      setDeleteRecipe(true);
      props.setModalDelete(false);
      // setTimeout(() => {
      //   location.pathname === `/recipe/${props.post_id}`
      //     ? navigate("/home")
      //     : window.location.reload();
      // }, 1000);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };
  return (
    <>
      <Transition appear show={modalDelete} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto bg-black/50"
          onClose={modalDeleteHandler}
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
                  <h1 className="h-20 w-100 flex justify-center items-center text-sm sm:text-xl">
                    You are about to delete your post
                  </h1>
                  <XIcon
                    className="h-5 w-5 absolute top-1/2 right-8 -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:text-white text-white/50 duration-500 border-2 border-white/30 rounded-full hover:bg-white/30 hover:border-transparent"
                    onClick={() => modalDeleteHandler()}
                  />
                </Dialog.Title>

                <div className="flex justify-center items-center">
                  Are you sure?
                </div>
                <div className="mt-2 flex justify-center">
                  {loading ? (
                    <Loading className={"animate-spin h-10 w-10 ml-5"} />
                  ) : (
                    <button
                      disabled={loading}
                      type="button"
                      className="shadow-md inline-flex justify-center px-4 py-2 text-sm font-medium text-putih bg-hijau border border-transparent rounded-md 
                            disabled:shadow-none disabled:text-white disabled:bg-putih disabled:border-merah disabled:cursor-not-allowed
                           hover:text-white hover:shadow-black focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-biru duration-500"
                      onClick={() => onSubmit()}
                    >
                      Yes, delete this post
                    </button>
                  )}
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ModalDelete;
