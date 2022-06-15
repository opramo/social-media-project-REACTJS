import * as React from "react";
import { useNavigate } from "react-router-dom";
import cover from "../Assets/cover.jpg";
import Cookies from "js-cookie";

function LandingPage() {
  let token = Cookies.get("token");
  const navigate = useNavigate();
  React.useEffect(() => {
    token && navigate("/home");
    // eslint-disable-next-line
  }, []);

  React.useEffect(() => {
    window.scrollTo(0, 0);
    // eslint-disable-next-line
  }, []);

  window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  };
  return (
    //
    <>
      <div className="h-screen w-full flex flex-col pt-20 bg-putih items-center overflow-hidden">
        <div className=" h-full w-full flex justify-center items-center relative">
          <h1 className="w-full z-10 text-9xl font-semibold text-putih break-words drop-shadow-[0_5px_5px_rgba(0,0,0,0.5)]">
            Welcome to <br />
            <span className="text-merah drop-shadow-lg shadow-white">
              The Chef Book
            </span>
          </h1>
          <img
            src={cover}
            alt=""
            className="w-full h-full object-cover absolute"
            style={{ objectPosition: "50% 50%" }}
          />
        </div>
        {/* <div className="border-2 border-black h-[800px] w-[1600px]"></div>
        <div className="border-2 border-black h-[800px] w-[1600px]"></div> */}
      </div>
    </>
  );
}
export default LandingPage;
