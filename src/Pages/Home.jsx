import { useEffect } from "react";
import Recipe from "../components/Recipe";

const Home = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  };
  return (
    <div className="min-h-screen flex pt-20 bg-putih justify-center">
      <div className="w-[600px] ">
        <Recipe />
        <Recipe />
        <Recipe />
      </div>
    </div>
  );
};

export default Home;
