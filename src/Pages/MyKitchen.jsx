import Recipe from "../components/Recipe";
import cover from "../Assets/cover.jpg";
import Cat from "../Assets/cat.jpg";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import API_URL from "../Helpers/apiurl";
import axios from "axios";

const MyKitchen = () => {
  const { username, fullname, profile_picture, profile_cover, bio } =
    useSelector((state) => state.user);
  let [myRecipes, setMyRecipe] = useState(true);
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(false);

  const getUserRecipes = async () => {
    try {
      setLoadingPosts(true);
      let token = Cookies.get("token");
      let res = await axios.get(`${API_URL}/recipe/recipes-user`, {
        headers: { authorization: token },
      });
      setPosts(res.data);
      setLoadingPosts(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getLikedRecipes = async () => {
    try {
      setLoadingPosts(true);
      let token = Cookies.get("token");
      let res = await axios.get(`${API_URL}/recipe/recipes-liked`, {
        headers: { authorization: token },
      });
      setLikedPosts(res.data);
      setLoadingPosts(false);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    getUserRecipes();
    setMyRecipe(true);
    // eslint-disable-next-line
  }, []);

  const printRecipe = () => {
    let dataRecipe = posts;
    return dataRecipe.map((recipe) => {
      return (
        <Recipe data={recipe} key={recipe.post_id} getFeeds={getUserRecipes} />
      );
    });
  };
  const printLikedRecipe = () => {
    let dataRecipe = likedPosts;
    return dataRecipe.map((recipe) => {
      return (
        <Recipe data={recipe} key={recipe.post_id} getFeeds={getLikedRecipes} />
      );
    });
  };

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
          <div className="border-putih border-2 text-white bg-black/50 w-[200px] h-[200px] absolute right-0 top-1/2 -translate-y-1/2">
            {bio}
          </div>

          {/* account button pages */}
          <div className="w-full flex justify-center bg-transparent absolute bottom-0 z-10">
            <button
              className={`${
                myRecipes
                  ? "bg-putih text-black shadow-all-md shadow-black"
                  : "bg-merah text-putih brightness-75 hover:brightness-100"
              } mr-5 p-1 px-2 rounded-t-lg focus:outline-none duration-500`}
              onClick={() => {
                setMyRecipe(true);
                return getUserRecipes();
              }}
            >
              My Recipes
            </button>
            <button
              className={`${
                !myRecipes
                  ? "bg-putih text-black shadow-all-md shadow-black"
                  : "bg-merah text-putih brightness-75 hover:brightness-100"
              } p-1 px-2 rounded-t-lg focus:outline-none duration-500 z-0`}
              onClick={() => {
                setMyRecipe(false);
                return getLikedRecipes();
              }}
            >
              Liked Recipes
            </button>
          </div>
        </div>
        {myRecipes ? (
          <div className="bg-putih w-full h-auto  py-5 relative z-10">
            <div className="">
              {loadingPosts
                ? "Loading..."
                : posts[0]
                ? printRecipe()
                : "You have not posted any recipe yet :<"}
            </div>
          </div>
        ) : (
          <div className="bg-putih w-[full] h-auto py-5 relative z-10">
            {loadingPosts
              ? "Loading..."
              : likedPosts[0]
              ? printLikedRecipe()
              : "You have not liked any recipe yet :<"}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyKitchen;
