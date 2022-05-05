import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import API_URL from "../Helpers/apiurl";

const VerifyAcc = () => {
  const dispatch = useDispatch();
  const { id, username, email, loading } = useSelector((state) => state.user);

  const sendEmail = async () => {
    try {
      dispatch({ type: "LOADING" });
      await axios.post(`${API_URL}/auth/email-verification`, {
        id,
        username,
        email,
      });
      dispatch({ type: "DONE" });
      toast.success("Email sent!", {
        className: "bg-hijau",
        position: "bottom-center",
        theme: "colored",
      });
    } catch (error) {
      alert(error);
    }
  };
  return (
    <>
      <>
        <div className="min-h-screen flex flex-col pt-20 bg-putih items-center justify-center">
          <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-putih shadow-2xl rounded-2xl">
            <div className="relative text-lg font-medium leading-6 text-putih bg-merah rounded text-center mb-5 -mt-7 -mx-10">
              <h1 className="h-20 w-100 flex justify-center items-center text-xl">
                Please Verify Your Account!
              </h1>
            </div>
            <div className="flex flex-col gap-y-5">
              <div className="flex flex-col relative">
                <p>
                  It seems like you have not verified your account yet! Please
                  verify your account by clicking the link that we have sent to
                  your email! <br />
                  Please kindly check your email!
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-col">
              Didn't get the email? click the button below to resend the
              verification email!
              <button
                type="button"
                disabled={loading}
                className="hover:text-white shadow-md hover:shadow-black inline-flex justify-center px-4 py-2 text-sm font-medium text-putih bg-hijau border border-transparent rounded-md 
                disabled:shadow-none disabled:text-white disabled:bg-putih disabled:border-merah disabled:cursor-not-allowed
                focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-biru duration-500"
                onClick={() => sendEmail()}
              >
                Re-send Email Verification
              </button>
            </div>
          </div>
        </div>
      </>
    </>
  );
};

export default VerifyAcc;
