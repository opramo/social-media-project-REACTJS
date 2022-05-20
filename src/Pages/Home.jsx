import axios from "axios";
import { useEffect, useState } from "react";
import Recipe from "../components/Recipe";
import API_URL from "../Helpers/apiurl";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../components/Loading";

const Home = () => {
  const dispatch = useDispatch();
  const initialPage = 0;
  const { loading } = useSelector((state) => state.user);
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(initialPage);
  const limit = 2;
  const getFeeds = async () => {
    try {
      if (hasMore) {
        dispatch({ type: "LOADING" });
        let token = Cookies.get("token");
        let res = await axios.get(`${API_URL}/recipe/recipes-feed`, {
          headers: { authorization: token },
          params: { page, limit },
        });
        if (res.data.length === 0) {
          setHasMore(false);
        }
        setPosts((prev) => [...prev, ...res.data]);
        setPage(page + 1);
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch({ type: "DONE" });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    getFeeds();
    // window.location.reload();
    // eslint-disable-next-line
  }, []);

  const printRecipe = () => {
    if (posts[0]) {
      let dataRecipe = posts;
      return dataRecipe.map((recipe) => {
        return (
          <Recipe data={recipe} key={recipe.post_id} getFeeds={getFeeds} />
        );
      });
    }
  };
  window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  };
  return (
    <div className="min-h-screen flex pt-20 bg-putih justify-center">
      <InfiniteScroll
        hasMore={hasMore}
        next={() => posts[0] && getFeeds()}
        dataLength={posts.length}
        className="px-10 py-5"
      >
        <div className="w-[600px] flex flex-col">{printRecipe()}</div>
        {loading ? (
          <div className="w-[600px] h-60 flex flex-col items-center justify-center text-xl">
            <Loading className={"h-20 w-20 animate-bounce"} />
            <div>Please wait...</div>
          </div>
        ) : null}
        {hasMore ? null : (
          <div className="w-[600px] h-60 flex flex-col items-center justify-center text-xl">
            Wow... You need to go outside more..
          </div>
        )}
      </InfiniteScroll>
    </div>
  );
};

export default Home;
