import Recipe from "../components/Recipe";
import cover from "../Assets/cover.jpg";
import Cat from "../Assets/cat.jpg";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import API_URL from "../Helpers/apiurl";

const MyKitchen = () => {
  const { username, fullname, profile_picture, profile_cover, bio } =
    useSelector((state) => state.user);
  let [myRecipes, setMyRecipe] = useState(true);
  console.log(profile_picture);
  console.log(profile_cover);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen flex pt-20 bg-putih justify-center">
      <div className=" w-[600px] relative ">
        {/* Jumbotron Profile */}
        <div className="h-72 w-full relative">
          <div className="bg-black/30 py-3 text-center text-lg font-bold text-putih absolute w-full tracking-wider">
            {`${username}'s Kitchen`}
          </div>
          <div className="w-full block h-full">
            <img
              src={profile_cover ? API_URL + profile_cover : cover}
              alt=""
              className="h-full w-full"
            />
          </div>
          <div className="absolute top-16 flex flex-col items-center w-1/2 left-[50%] translate-x-[-50%]">
            <div className="w-36 h-36 rounded-full overflow-hidden">
              <img
                src={profile_picture ? API_URL + profile_picture : Cat}
                alt=""
              />
            </div>
            <div className="mt-3 text-center py-1 shadow-lg bg-black/30 text-putih px-5">
              {fullname}
            </div>
          </div>
          <div className="border-kuning border-2 text-white bg-black/50 w-[200px] h-[200px] absolute right-0 top-1/2 -translate-y-1/2">
            {bio}
          </div>
          <div className="w-full flex justify-center bg-transparent absolute bottom-0 z-10">
            <button
              className={
                myRecipes
                  ? "mr-5 p-1 px-2 bg-kuning rounded-t-lg shadow-inner text-putih focus:outline-none duration-500"
                  : "mr-5 p-1 px-2 bg-kuning rounded-t-lg shadow-inner hover:text-putih focus:outline-none duration-500"
              }
              onClick={() => setMyRecipe((myRecipes = true))}
            >
              My Recipes
            </button>
            <button
              className={
                myRecipes
                  ? "p-1 px-2 bg-merah rounded-t-lg shadow-inner focus:outline-none hover:text-putih duration-500"
                  : "p-1 px-2 bg-merah rounded-t-lg shadow-inner focus:outline-none text-putih duration-500"
              }
              onClick={() => setMyRecipe((myRecipes = false))}
            >
              Liked Recipes
            </button>
          </div>
        </div>
        {myRecipes ? (
          <div className="bg-kuning w-full h-auto py-5 relative">
            <div className="">
              <Recipe />
            </div>
            <div className="mt-5">
              <Recipe />
            </div>
          </div>
        ) : (
          <div className="bg-merah w-full h-auto py-5 relative">
            <div className="shadow-lg shadow-black">
              <Recipe />
            </div>
            <div className="mt-5 shadow-lg shadow-black">
              <Recipe />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyKitchen;
