import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Recipe from "../components/Recipe";
import API_URL from "../Helpers/apiurl";
import Cookies from "js-cookie";
import InfiniteScroll from "react-infinite-scroll-component";
import Loading from "../components/Loading";
import useInfiniteScroll from "../Helpers/useInfiniteScroll";
import { useCallback } from "react";

const Home = () => {
  const initialPage = 0;
  // const [loading, setLoading] = useState(false);
  // const [posts, setPosts] = useState([]);
  // const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(initialPage);
  const limit = 3;
  const { recipe, loading, hasMore, error } = useInfiniteScroll(limit, page);

  const observer = useRef();
  const lastRecipe = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // const getFeeds = async () => {
  //   try {
  //     if (hasMore) {
  //       setLoading(true);
  //       let token = Cookies.get("token");
  //       let res = await axios.get(`${API_URL}/recipe/recipes-feed`, {
  //         headers: { authorization: token },
  //         params: { page, limit },
  //       });
  //       if (res.data.length === 0) {
  //         setHasMore(false);
  //       }
  //       setPosts((prev) => [...prev, ...res.data]);
  //       setPage(page + 1);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  useEffect(() => {
    window.scrollTo(0, 0);
    // getFeeds();
    // window.location.reload();
    // eslint-disable-next-line
  }, []);

  const printRecipe = () => {
    // if (recipe[0]) {
    let dataRecipe = recipe;
    return dataRecipe.map((recipe, index) => {
      if (index === dataRecipe.length - 1) {
        return (
          <div ref={lastRecipe} key={recipe.post_id}>
            <Recipe data={recipe} />
          </div>
        );
      } else {
        return (
          <div key={recipe.post_id}>
            <Recipe data={recipe} />
          </div>
        );
      }
    });
  };

  window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  };

  // return (
  //   <div className="min-h-screen flex pt-20 bg-putih justify-center overflow-hidden">
  //     <InfiniteScroll
  //       hasMore={hasMore}
  //       next={() => posts[0] && getFeeds()}
  //       dataLength={posts.length}
  //       className="w-[650px] my-5 flex flex-col items-center relative"
  //     >
  //       <div className="w-[380px] sm:w-[600px] flex flex-col relative">
  //         {printRecipe()}
  //       </div>
  //       {loading ? (
  //         <div className="w-[600px] h-60 flex flex-col items-center justify-center text-xl">
  //           <Loading className={"h-20 w-20 animate-bounce"} />
  //           <div>Please wait...</div>
  //         </div>
  //       ) : null}
  //       {hasMore ? null : (
  //         <div className="w-[600px] h-60 flex flex-col items-center justify-center text-xl">
  //           You have reached the end! Let's make a new recipe!
  //         </div>
  //       )}
  //     </InfiniteScroll>
  //   </div>
  // );
  return (
    <div className="min-h-screen flex pt-20 bg-putih justify-center">
      <div className="w-[650px] relative rounded-2xl overflow-hidden flex flex-col items-center">
        <div className="w-full flex justify-center bg-putih z-10">
          <div className="bg-putih w-[600px] h-auto py-5 relative z-10">
            {printRecipe()}
            {loading && (
              <div className="py-20 flex flex-col justify-center items-center">
                <Loading className="h-20 w-20 animate-bounce" />
                <div>Please wait...</div>
              </div>
            )}
            {!hasMore && !loading && (
              <div className="py-20 flex flex-col justify-center items-center text-center">
                You have reached the end! Let's make a new recipe!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
