import { useNavigate } from "react-router-dom";

const ModalRestriction = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed z-50 left-1/2 -translate-x-1/2 bottom-0 inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-putih shadow-2xl rounded-2xl">
      <div className="text-lg font-medium leading-6 text-putih bg-merah rounded text-center mb-5 -mt-7 -mx-10 flex justify-center">
        <h1 className="h-14 sm:h-20 w-100 flex justify-center items-center text-base sm:text-xl">
          Please Verify!
        </h1>
      </div>
      <div className="flex flex-col gap-y-5">
        <div className="flex flex-col items-center justify-center text-center text-xs sm:text-base">
          <p>
            To enjoy all the features, please verify your account! <br />
            Go to the Account Settings Page to verify your account.
          </p>
        </div>
        <button
          type="button"
          className="hover:text-white shadow-md hover:shadow-black inline-flex justify-center px-4 py-2 text-sm font-medium text-putih bg-hijau border border-transparent rounded-md  focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-biru duration-500"
          onClick={() => navigate("/accountsettings")}
        >
          Go to Account Settings Page
        </button>
      </div>
    </div>
  );
};

export default ModalRestriction;
