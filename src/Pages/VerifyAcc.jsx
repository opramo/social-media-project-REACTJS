import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loading from "../components/Loading";
import API_URL from "../Helpers/apiurl";

const VerifyAcc = () => {
  const { id, username, email } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);

  const sendEmail = async () => {
    try {
      setLoading(true);
      await axios.post(`${API_URL}/auth/email-verification`, {
        id,
        username,
        email,
      });
      toast.success("Email sent!", {
        position: "top-center",
        theme: "colored",
        style: { backgroundColor: "#3A7D44" },
      });
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
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
            <div className="flex flex-col gap-y-5 text-sm sm:text-base">
              <div className="flex flex-col relative text-center">
                <p>
                  Please verify your account by clicking the link that has
                  between sent to your email!
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-col text-center items-center text-sm sm:text-base">
              Didn't get the email? click the button below!
              {loading ? (
                <Loading className={"animate-spin h-10 w-10 ml-5"} />
              ) : (
                <button
                  type="button"
                  disabled={loading}
                  className="hover:text-white shadow-md mt-2 hover:shadow-black inline-flex justify-center px-4 py-2 text-sm font-medium text-putih bg-hijau border border-transparent rounded-md 
                disabled:shadow-none disabled:text-white disabled:bg-putih disabled:border-merah disabled:cursor-not-allowed
                focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-biru duration-500"
                  onClick={() => sendEmail()}
                >
                  Re-send Email Verification
                </button>
              )}
            </div>
          </div>
        </div>
      </>
    </>
  );
};

export default VerifyAcc;
