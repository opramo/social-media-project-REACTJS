import React from "react";
import Logo1 from "../Assets/chefputih.png";

function Spinner() {
  return (
    <div className="rounded-full w-14 h-14 bg-merah animate-spin animate-bounce">
      <img
        src={Logo1}
        alt="TheChefBook"
        className="rounded-full duration-500"
      />
    </div>
  );
}

export default Spinner;
