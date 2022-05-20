import React from "react";
import Logo1 from "../Assets/chefputih.png";

function Loading({ className }) {
  return (
    <div className={`rounded-full bg-merah ${className} `}>
      <img
        src={Logo1}
        alt="TheChefBook"
        className="rounded-full duration-500"
      />
    </div>
  );
}

export default Loading;
