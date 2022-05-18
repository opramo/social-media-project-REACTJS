import kiss from "../Assets/kiss.png";
// import cat from "../Assets/cat.jpg";

import {
  PaperAirplaneIcon,
  ChevronLeftIcon,
  ChatAltIcon,
  DotsHorizontalIcon,
} from "@heroicons/react/outline";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalNewComment from "./ModalNewComment";
import { Popover } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import API_URL from "../Helpers/apiurl";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Cookies from "js-cookie";
import ModalDelete from "./ModalDelete";
import { toast } from "react-toastify";

const Recipe = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data, getFeeds } = props;
  const { id, comment, deleted, is_verified, loading } = useSelector(
    (state) => state.user
  );
  const {
    liked,
    likes: totalLikes,
    photo,
    post_id,
    title,
    updated_at,
    user,
    user_id,
  } = data;

  const [modalNewComment, setModalNewComment] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [kissed, setKissed] = useState(liked);
  const [likes, setLikes] = useState(totalLikes);
  const [likers, setLikers] = useState(0);
  const [comments, setComments] = useState([]);
  const [recipe, setRecipe] = useState({
    ingredients: [],
    instructions: [],
  });
  const [recipeFetched, setRecipeFetched] = useState(false);
  const [isPage, setIsPage] = useState({
    main: 1,
    recipe: 0,
    kisses: 0,
    comment: 0,
  });

  const createdAtPost = new Date(updated_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const modalNewCommentHandler = () => {
    setModalNewComment(!modalNewComment);
  };
  const modalDeleteHandler = () => {
    setModalDelete(!modalDelete);
  };

  useEffect(() => {
    printKissed();
    if (comment) {
      printComments();
      dispatch({ type: "NOCOMMENT" });
    }
    if (deleted) {
      getFeeds();
      dispatch({ type: "NODELETE" });
    }
    // eslint-disable-next-line
  }, [kissed, likes, modalNewComment, modalDelete]);

  // const onKissed = async

  // Fetching Methods/////////////////////
  // Comments Fetching
  const getComments = async () => {
    try {
      dispatch({ type: "LOADING" });
      setIsPage({ main: 0, recipe: 0, kisses: 0, comment: 1 });
      let res = await axios.post(`${API_URL}/recipe/recipe-comments`, {
        post_id: post_id,
      });
      setComments(res.data);
      dispatch({ type: "DONE" });
    } catch (error) {
      console.log(error);
    }
  };

  // Likers Fetching
  const getLikers = async () => {
    try {
      dispatch({ type: "LOADING" });
      setIsPage({ main: 0, recipe: 0, kisses: 1, comment: 0 });
      let res = await axios.post(`${API_URL}/recipe/recipe-likers`, {
        post_id,
      });
      setLikers(res.data);
      dispatch({ type: "DONE" });
    } catch (error) {
      console.log(error);
    }
  };

  // Ingredients & Instructions Fetching
  const getRecipe = async () => {
    try {
      if (recipeFetched) {
        setIsPage({ main: 0, recipe: 1, kisses: 0, comment: 0 });
      } else {
        dispatch({ type: "LOADING" });
        setIsPage({ main: 0, recipe: 1, kisses: 0, comment: 0 });
        let res = await axios.post(`${API_URL}/recipe/recipe-recipe`, {
          post_id: post_id,
        });
        const { ingredients, instructions } = res.data;
        setRecipe({
          ingredients,
          instructions,
        });
        setRecipeFetched(true);
        dispatch({ type: "DONE" });
      }
    } catch (error) {
      console.log(error);
    }
  };
  /////////////////////////////////////////

  //Render Methods/////////////////////////
  // Like Button Render
  const printKissed = () => {
    return (
      <button
        className={`h-14 w-14 rounded-full border-2 border-merah mr-1 overflow-hidden duration-500 hover:shadow-black shadow-md focus:outline-none ${
          kissed ? "bg-merah" : "grayscale"
        }`}
        onClick={async () => {
          try {
            if (is_verified) {
              let token = Cookies.get("token");

              await axios.post(
                `${API_URL}/recipe/like-recipe`,
                { post_id: post_id },
                {
                  headers: { authorization: token },
                }
              );
              kissed ? setLikes(likes - 1) : setLikes(likes + 1);
              setKissed(!kissed);
              console.log("liked!");
            } else {
              toast.error("Please verify your account!", {
                theme: "colored",
                position: "top-center",
                style: { backgroundColor: "#A90409" },
              });
            }
          } catch (error) {
            console.log(error);
          }
        }}
      >
        <img src={kiss} alt="" className="scale-90" />
      </button>
    );
  };

  // Ingredients List Render
  const printIngredients = () => {
    return (
      <ul className="max-w-full list-disc ml-5 break-words text-base bg-putih">
        {recipe.ingredients.map((content) => {
          return <li key={content.ingredient_id}>{content.ingredient}</li>;
        })}
      </ul>
    );
  };

  // Instructions List Render
  const printInstructions = () => {
    return (
      <ol className="max-w-full list-decimal ml-5 break-words text-sm bg-putih">
        {recipe.instructions.map((content) => {
          return <li key={content.instruction_id}>{content.instruction}</li>;
        })}
      </ol>
    );
  };

  // Likers List Render
  const printUserLikes = () => {
    return (
      <ul className="max-w-full ml-5 break-words text-xl bg-putih">
        {likers.map((content) => {
          return (
            <li key={content.id}>
              <div
                className="flex rounded-md hover:bg-white/50 cursor-pointer text-base py-2"
                onClick={() => navigate("/account")}
              >
                <div className="w-12 h-12 rounded-full mr-3 bg-merah overflow-hidden">
                  <img src={`${API_URL}${content.profile_picture}`} alt="" />
                </div>
                <div>
                  <div className="mb-1">{content.username}</div>
                  <div>{content.fullname}</div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  // Comments List Render
  const printComments = () => {
    return (
      <ul className="max-w-full ml-5 break-words text-base bg-putih">
        {comments.map((content) => {
          return (
            <li className="flex flex-col" key={content.id}>
              <div className="h-[10%] w-full flex justify-between">
                <div
                  className="flex  rounded-md hover:bg-white/50 cursor-pointer text-base py-2"
                  onClick={() => navigate("/account")}
                >
                  <div className="w-12 h-12 rounded-full mr-3 overflow-hidden">
                    <img src={`${API_URL}${content.profile_picture}`} alt="" />
                  </div>
                  <div>
                    <div className="mb-1">{content.username}</div>
                    <div>{content.fullname}</div>
                  </div>
                </div>
              </div>
              <div className="ml-16">{content.comment}</div>
            </li>
          );
        })}
      </ul>
    );
  };
  //////////////////////////////////////////

  return (
    <div className="relative w-full min-h-[600px] mb-5 rounded bg-transparent shadow-black shadow-xl">
      {modalNewComment && (
        <ModalNewComment
          modalNewComment={modalNewComment}
          modalNewCommentHandler={modalNewCommentHandler}
          post_id={post_id}
          comments={comments}
          setComments={setComments}
          setModalNewComment={setModalNewComment}
        />
      )}
      <ModalDelete
        modalDelete={modalDelete}
        modalDeleteHandler={modalDeleteHandler}
        post_id={post_id}
      />

      {/* Nav Content */}
      <div className="absolute w-[6%] left-[94%] flex flex-col h-full z-10 bg-black/40 rounded-r">
        {/* Front Page Button */}
        <button
          type="button"
          className={`w-full h-[10%]  rounded-r focus:outline-none duration-500 ${
            isPage.main
              ? "bg-merah "
              : "bg-putih brightness-75 border-b border-merah hover:brightness-100 hover:border-transparent"
          }`}
          onClick={() => {
            return setIsPage({ main: 1, recipe: 0, kisses: 0, comment: 0 });
          }}
        >
          <ChevronLeftIcon
            className={`${
              isPage.main
                ? "w-full h-full text-putih duration-500"
                : "w-full h-full duration-500"
            }`}
          />
        </button>

        {/* Recipe Page Button */}
        <button
          type="button"
          className={`w-full h-[30%] rounded-r break-words px-2 focus:outline-none  duration-500 ${
            isPage.recipe
              ? " bg-merah text-putih "
              : "bg-putih brightness-75 border-b border-merah hover:brightness-100 hover:border-transparent"
          }`}
          onClick={() => getRecipe()}
        >
          REC I PE
        </button>

        {/* Likes Page Button */}
        <button
          type="button"
          className={`w-full h-[30%] rounded-r break-words px-2 focus:outline-none duration-500 ${
            isPage.kisses
              ? "bg-merah text-putih"
              : "bg-putih brightness-75 border-b border-merah hover:brightness-100 hover:border-transparent"
          }`}
          onClick={() => getLikers()}
        >
          K I<br /> S SES
        </button>

        {/* Comments Page Button */}
        <button
          type="button"
          className={`w-full h-[30%] rounded-r break-words px-2 focus:outline-none duration-500 ${
            isPage.comment
              ? "bg-merah text-putih"
              : "bg-putih brightness-75 hover:brightness-100 "
          }`}
          onClick={() => getComments()}
        >
          COMMENT
        </button>
      </div>

      {/* Front Page */}
      {isPage.main === 1 && (
        <>
          <div className="h-full w-[95%] absolute pr-5  bg-merah rounded-l border-4 border-merah">
            <div className="h-full flex flex-col w-full py-5 bg-putih">
              <div className="h-[10%] w-full flex justify-between px-5 text-sm">
                <div
                  className="flex  rounded-md hover:bg-white/50 cursor-pointer"
                  onClick={() => navigate("/account")}
                >
                  <div className="w-12 h-12 rounded-full mr-3 overflow-hidden">
                    <img src={`${API_URL}${user.profile_picture}`} alt="" />
                  </div>
                  <div>
                    <div className="mb-1">{user.username}</div>
                    <div>{user.fullname}</div>
                  </div>
                </div>
                <div className="flex flex-col text-center items-end mb-1">
                  <div className="text-xs">{createdAtPost}</div>
                  {id === user_id ? (
                    <Popover className="relative mt-2">
                      {({ open }) => (
                        <>
                          <Popover.Button className="">
                            <DotsHorizontalIcon
                              className={`${
                                open
                                  ? "bg-merah/30 border-transparent text-merah"
                                  : "hover:bg-merah/30 hover:border-transparent border-merah/30"
                              } h-5 w-5 cursor-pointer text-merah/50 duration-500 border-2 rounded-full`}
                              onClick={() => {}}
                            />
                          </Popover.Button>
                          <AnimatePresence>
                            {open && (
                              <Popover.Panel
                                as={motion.div}
                                static
                                initial={{ height: 0 }}
                                animate={{ height: "auto" }}
                                exit={{ height: 0 }}
                                transition={{ duration: 0.3, type: "spring" }}
                                className="absolute right-0 z-10 bg-putih rounded focus:outline-none shadow-xl shadow-black overflow-hidden"
                              >
                                <div
                                  className={`hover:bg-merah hover:text-putih duration-500 cursor-pointer border-b border-merah block px-5 py-3 whitespace-no-wrap`}
                                  onClick={() => {
                                    navigate("/editrecipe");
                                    dispatch({
                                      type: "NEWEDIT",
                                      payload: post_id,
                                    });
                                  }}
                                >
                                  Edit
                                </div>
                                <div
                                  className={`hover:bg-merah hover:text-putih duration-500 cursor-pointer block px-5 py-3 whitespace-no-wrap`}
                                  onClick={() => {
                                    modalDeleteHandler();
                                  }}
                                >
                                  Delete
                                </div>
                              </Popover.Panel>
                            )}
                          </AnimatePresence>
                        </>
                      )}
                    </Popover>
                  ) : null}
                </div>
              </div>
              <div className="h-[80%] w-full relative">
                <div className="w-20 h-6 origin-center rotate-[-45deg] absolute top-4 bg-white/50"></div>
                <div className="w-20 h-6 origin-center rotate-[-45deg] absolute bottom-10 right-0 bg-white/50"></div>
                <div
                  className="h-full w-full p-5 -mt-3 cursor-pointer"
                  onClick={() => navigate(`/recipe/${post_id}`)}
                >
                  <div className="h-5/6 p-2 pb-0 bg-white">
                    <img
                      src={`${API_URL}${photo}`}
                      alt=""
                      className="w-full h-full object-cover"
                      style={{ objectPosition: "0 0" }}
                    />
                  </div>
                  <div className="h-1/6 flex items-center justify-center text-center text-2xl bg-white">
                    "{title}"
                  </div>
                </div>
              </div>
              <div className="h-[10%] w-full flex justify-between item px-10 -mt-3">
                <div className="flex items-center">
                  {printKissed()}
                  <span className="text-xs">
                    {likes
                      ? `${likes} chefs like this!`
                      : "No chef likes this recipe :<"}
                  </span>
                </div>
                <button className="h-14 w-14 rounded-full  border-2 border-biru ml-1 overflow-hidden  hover:bg-biru duration-500 hover:shadow-black shadow-md focus:outline-none">
                  <PaperAirplaneIcon className="h-full w-full p-2 hover:text-white " />
                </button>
                {/* <Popover as="div" className="relative h-14 w-14">
                  {({ open, close }) => (
                    <>
                      <Popover.Button className="absolute h-14 w-14 rounded-full  border-2 border-biru overflow-hidden  hover:bg-biru duration-500 hover:shadow-black shadow-md focus:outline-none">
                        Solutions
                      </Popover.Button>
                      const container =
                       hidden: { opacity: 1, scale: 0 },
                        visible: {
                          opacity: 1,
                          scale: 1,
                          transition: {
                            delayChildren: 0.3,
                            staggerChildren: 0.2
                          }
                        }
                      }

                      const item = {
                        hidden: { y: 20, opacity: 0 },
                        visible: {
                          y: 0,
                          opacity: 1
                        }
                      {open && (
                        <Popover.Panel
                          static
                          as={motion.div}
                          className="relative border-2 border-merah w-36 h-32 -translate-y-16 -translate-x-[32%] pointer-events-none"
                          transition={{
                            hidden: { opacity: 1, scale: 0 },
                            visible: {
                              opacity: 1,
                              scale: 1,
                              transition: {
                                delayChildren: 0.3,
                                staggerChildren: 0.2,
                              },
                            },
                          }}
                        >
                          <motion.button
                            hidden={{ opacity: 0 }}
                            visible={{ opacity: 1 }}
                            className="bg-kuning z-50 h-14 w-14 rounded-full overflow-hidden  duration-500 hover:shadow-black shadow-md focus:outline-none pointer-events-auto"
                            onClick={() => {
                              close();
                            }}
                          >
                            Edit
                          </motion.button>

                          <button
                            as="button"
                            className="absolute top-0 right-0 bg-merah z-10 h-14 w-14 rounded-full overflow-hidden  duration-500 hover:shadow-black shadow-md focus:outline-none pointer-events-auto"
                            onClick={() => {
                              close();
                            }}
                          >
                            Delete
                          </button>
                        </Popover.Panel>
                      )}
                    </>
                  )}
                </Popover> */}
              </div>
            </div>
          </div>
        </>
      )}
      {/* Recipe Page */}
      {isPage.recipe === 1 && (
        <>
          <div className="h-full w-[95%] absolute pr-5  bg-merah rounded-l border-4 border-merah">
            <div className="h-full flex flex-col w-full p-5 bg-putih">
              <div className="w-full h-[250px] bg-putih h mb-7">
                Ingredients:
                <div className="w-full h-full overflow-y-scroll border-y border-merah">
                  {loading ? "Loading..." : printIngredients()}
                </div>
              </div>
              <div className="w-full h-[250px] bg-putih">
                Instructions:
                <div className="w-full h-full overflow-y-scroll border-y border-merah">
                  {loading ? "Loading..." : printInstructions()}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {/* Kisses Page */}
      {isPage.kisses === 1 && (
        <>
          <div className="h-full w-[95%] absolute pr-5 flex bg-merah rounded-l border-4 border-merah">
            <div className="h-full flex flex-col w-full p-5 bg-putih">
              <div className="w-full relative bg-putih text-3xl">
                {likes} Chefs loved this recipe:
              </div>
              {
                <div className="h-full w-full relative bg-putih border-y border-merah  overflow-y-scroll mt-5">
                  {loading
                    ? "Loading..."
                    : likers[0]
                    ? printUserLikes()
                    : "No chef likes this recipe :<"}
                </div>
              }
            </div>
          </div>
        </>
      )}
      {/* Comments Page */}
      {isPage.comment === 1 && (
        <>
          <div className="h-full w-[95%] absolute pr-5 flex bg-merah rounded-l border-4 border-merah">
            <div className="h-full flex flex-col w-full p-5 bg-putih">
              <div className="w-full relative bg-putih text-3xl">
                Comments from other chefs:
              </div>
              <div className="h-full w-full relative bg-putih overflow-y-scroll border-y border-merah mt-5">
                {loading
                  ? "Loading.."
                  : comments[0]
                  ? printComments()
                  : "No chef commented here :<"}
              </div>
              <div className="w-full relative bg-putih text-3xl">
                <div className="flex items-center">
                  <button
                    type="button"
                    className={`${
                      modalNewComment ? "bg-hijau" : "bg-putih"
                    } h-14 w-14 mt-2 rounded-full border-2 border-hijau ml-1 
                    overflow-hidden duration-500 hover:shadow-black 
                    shadow-md focus:outline-none`}
                    onClick={() => {
                      is_verified
                        ? modalNewCommentHandler()
                        : toast.error("Please verify your account!", {
                            theme: "colored",
                            position: "top-center",
                            style: { backgroundColor: "#A90409" },
                          });
                    }}
                  >
                    <ChatAltIcon
                      className={`${
                        modalNewComment ? "text-putih" : ""
                      } h-full w-full p-2 duration-500`}
                    />
                  </button>
                  {/* <span className="text-xs ml-5">
                    Leave a comment on this recipe!
                  </span> */}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Recipe;
