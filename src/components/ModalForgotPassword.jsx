import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import { Fragment } from "react";

const ModalForgotPassword = (props) => {
  return (
    <>
      <Transition appear show={props.modalForgotPassword} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto bg-black/50"
          onClose={props.modalForgotPasswordHandler}
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
                    Forgot Password?
                  </h1>
                  <XIcon
                    className="h-5 w-5 absolute top-1/2 right-8 -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:text-white text-white/50 duration-500 border-2 border-white/30 rounded-full hover:bg-white/30 hover:border-transparent"
                    onClick={() => props.modalForgotPasswordHandler()}
                  />
                </Dialog.Title>
                <div className="flex flex-col gap-y-5">
                  <div className="flex flex-col relative">
                    <p>Please input your email address</p>

                    <input
                      type="text"
                      placeholder="Username/Email"
                      className="p-2 focus:outline focus:outline-biru focus:outline-2 rounded"
                    />
                    <div className="text-merah -mt-5 text-xs absolute -bottom-4">
                      Email does not exist!
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex flex-col items-center">
                  <button
                    type="button"
                    className="hover:text-white shadow-md w-auto hover:shadow-black inline-flex justify-center px-4 py-2 text-sm font-medium text-putih bg-hijau border border-transparent rounded-md  focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-biru duration-500"
                    onClick={props.modalForgotPasswordHandler}
                  >
                    Reset Password
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ModalForgotPassword;
