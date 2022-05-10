import axios from "axios";
import { useEffect, useState } from "react";
import Recipe from "../components/Recipe";
import API_URL from "../Helpers/apiurl";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";

const Home = () => {
  const dispatch = useDispatch();
  const [posts, setPosts] = useState([]);
  const getFeeds = async () => {
    try {
      dispatch({ type: "LOADING" });
      let token = Cookies.get("token");
      let res = await axios.get(`${API_URL}/recipe/recipe-feed`, {
        headers: { authorization: token },
      });
      setPosts(res.data);
      dispatch({ type: "DONE" });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
    getFeeds();
  }, []);

  const printRecipe = () => {
    let dataRecipe = posts;
    return dataRecipe.map((recipe) => {
      return <Recipe data={recipe} key={recipe.post_id} getFeeds={getFeeds} />;
    });
  };
  window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  };
  return (
    <div className="min-h-screen flex pt-20 bg-putih justify-center">
      <div className="w-[600px] flex flex-col">{printRecipe()}</div>
    </div>
  );
};

export default Home;
