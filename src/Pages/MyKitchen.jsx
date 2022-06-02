import Recipe from "../components/Recipe";
import cover from "../Assets/cover.jpg";
import Cat from "../Assets/cat.jpg";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import API_URL from "../Helpers/apiurl";
import axios from "axios";
import Loading from "../components/Loading";

const MyKitchen = () => {
  const { username, fullname, profile_picture, profile_cover, bio, id } =
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
        params: { id, user: id },
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
        params: { id, user: id },
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
      <div className="w-[650px] relative my-5 rounded-2xl overflow-hidden shadow-lg shadow-black flex flex-col items-center">
        {/* Jumbotron Profile */}
        <div className=" w-full relative flex flex-col min-h-min items-center">
          <div className="w-full block h-full absolute top-0 min-h-[300px]">
            <img
              src={profile_cover ? API_URL + profile_cover : cover}
              alt=""
              className="h-full w-full"
            />
          </div>
          <div className="bg-black/30 py-2 text-center text-lg font-bold text-putih w-full tracking-wider z-10">
            {`${username}'s Kitchen`}
          </div>
          <div className="flex flex-col items-center w-1/2 z-10 my-2">
            <div className="w-36 h-36 rounded-full overflow-hidden shadow-md shadow-black">
              <img
                src={profile_picture ? API_URL + profile_picture : Cat}
                alt=""
              />
            </div>
          </div>
          <div className="text-white bg-black/30 w-full text-center flex flex-col items-center pb-10 z-10">
            <div className="text-center py-1 text-putih">{fullname}</div>
            {bio}
          </div>

          {/* account button pages */}
          <div className="w-full flex justify-center bg-transparent absolute bottom-0 z-10">
            <button
              className={`${
                myRecipes ? "text-merah" : "text-black brightness-75"
              } bg-putih  mr-5 p-1 px-2 rounded-t-lg focus:outline-none duration-500`}
              onClick={() => {
                setMyRecipe(true);
                return getUserRecipes();
              }}
            >
              My Recipes
            </button>
            <button
              className={`${
                !myRecipes ? "text-merah" : "text-black brightness-75"
              } bg-putih p-1 px-2 rounded-t-lg focus:outline-none duration-500 z-0`}
              onClick={() => {
                setMyRecipe(false);
                return getLikedRecipes();
              }}
            >
              Liked Recipes
            </button>
          </div>
        </div>
        <div className="w-full flex justify-center bg-putih z-10">
          {myRecipes ? (
            <div className="bg-putih w-[600px] h-auto py-5 relative z-10">
              {loadingPosts ? (
                <div className="py-20 flex flex-col justify-center items-center">
                  <Loading className="h-20 w-20 animate-bounce" />
                  <div>Please wait...</div>
                </div>
              ) : posts[0] ? (
                printRecipe()
              ) : (
                <div className="py-20 flex flex-col justify-center items-center">
                  You have not posted any recipe yet :&#60;
                </div>
              )}
            </div>
          ) : (
            <div className="bg-putih w-[600px] h-auto py-5 relative z-10">
              {loadingPosts ? (
                <div className="py-20 flex flex-col justify-center items-center">
                  <Loading className="h-20 w-20 animate-bounce" />
                  <div>Please wait...</div>
                </div>
              ) : likedPosts[0] ? (
                printLikedRecipe()
              ) : (
                <div className="py-20 flex flex-col justify-center items-center">
                  You have not liked any recipe yet :&#60;
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyKitchen;
