import React from "react";
import { useNavigate } from "react-router-dom";

function NotFound404() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex pt-20 bg-putih justify-center">
      <div className="w-[650px] relative my-5 rounded-2xl overflow-hidden shadow-lg shadow-black flex flex-col items-center justify-center">
        <div className="text-7xl">OOPPS...</div>
        <div className="text-4xl p-3">
          Seems like the page you are trying to reach does not exist :&#60;
        </div>
        <div className="text-xl p-3">
          Click the button below to go back to your homepage
        </div>
        <button
          className="shadow-md inline-flex justify-center px-4 py-2 text-sm font-medium text-putih bg-hijau border border-transparent rounded-md 
                              hover:text-white hover:shadow-black focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-biru duration-500"
          onClick={() => navigate("/home")}
        >
          Home
        </button>
      </div>
    </div>
  );
}

export default NotFound404;
