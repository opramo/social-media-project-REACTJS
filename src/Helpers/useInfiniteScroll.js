import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import API_URL from "./apiurl";
import { useSelector } from "react-redux";

function useInfiniteScroll(limit, page) {
  let { refresh } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [recipe, setRecipe] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  const getFeeds = async () => {
    try {
      setLoading(true);
      setError(false);
      let token = Cookies.get("token");
      let res = await axios.get(`${API_URL}/recipe/recipes-feed`, {
        headers: { authorization: token },
        params: { page, limit },
      });
      setRecipe((prev) => [...prev, ...res.data]);
      setHasMore(res.data.length > 0);
    } catch (error) {
      console.log(error);
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getFeeds();
    // eslint-disable-next-line
  }, [limit, page, refresh]);
  useEffect(() => {
    if (refresh) {
      setRecipe([]);
    }

    // eslint-disable-next-line
  }, [refresh]);

  return { loading, error, recipe, hasMore, errorMsg };
}

export default useInfiniteScroll;
