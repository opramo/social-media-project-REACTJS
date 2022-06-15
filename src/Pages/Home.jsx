import { useEffect, useRef, useState } from "react";
import Recipe from "../components/Recipe";
import Loading from "../components/Loading";
import useInfiniteScroll from "../Helpers/useInfiniteScroll";
import { useCallback } from "react";
import { useSelector } from "react-redux";

const Home = () => {
  const initialPage = 0;
  const [page, setPage] = useState(initialPage);
  const limit = 3;
  let { refresh } = useSelector((state) => state.user);
  const { recipe, loading, hasMore, error, errorMsg } = useInfiniteScroll(
    limit,
    page
  );
  // console.log(refresh);
  console.log(`page: ${page}`);

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

  useEffect(() => {
    window.scrollTo(0, 0);
    setPage(initialPage);
    // eslint-disable-next-line
  }, [refresh]);

  const printRecipe = () => {
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

  return (
    <div className="min-h-screen flex pt-20 bg-putih justify-center">
      <div className="w-[650px] rounded-2xl overflow-hidden flex flex-col items-center">
        <div className="w-full flex justify-center bg-putih z-10">
          <div className="bg-putih w-[600px] h-auto py-5 relative z-10">
            {printRecipe()}
            {loading && (
              <div
                className={`${
                  recipe[0] ? "py-20" : "min-h-screen -mt-20"
                } flex flex-col justify-center items-center`}
              >
                <Loading className="h-20 w-20 animate-bounce" />
                <div>Please wait...</div>
              </div>
            )}
            {!hasMore && !loading && (
              <div className="py-20 flex flex-col justify-center items-center text-center">
                You have reached the end! Let's make a new recipe!
              </div>
            )}
            {error && (
              <div className="py-20 flex flex-col justify-center items-center text-center">
                {errorMsg}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
