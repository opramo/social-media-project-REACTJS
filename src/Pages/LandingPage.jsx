import * as React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import cover from "../Assets/cover.jpg";
import Cookies from "js-cookie";

function LandingPage() {
  let token = Cookies.get("token");
  const navigate = useNavigate();
  React.useEffect(() => {
    token && navigate("/home");
  }, []);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  };
  return (
    //
    <>
      <div className="min-h-screen w-screen flex flex-col pt-20 bg-putih items-center overflow-hidden">
        <div className="border-2 border-black h-[800px] w-[1600px] flex justify-center relative">
          <h1 className="z-10 text-9xl text-white">Welcome to TheChefBook</h1>
          <img src={cover} alt="" className="h-full w-full absolute top-0" />
        </div>
        <div className="border-2 border-black h-[800px] w-[1600px]"></div>
        <div className="border-2 border-black h-[800px] w-[1600px]"></div>
      </div>
    </>
  );
}
export default LandingPage;
