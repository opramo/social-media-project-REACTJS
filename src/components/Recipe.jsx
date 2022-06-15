import kiss from "../Assets/kiss.png";
import cat from "../Assets/cat.jpg";
import {
  PaperAirplaneIcon,
  ChevronLeftIcon,
  ChatAltIcon,
  DotsHorizontalIcon,
  LinkIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import { useState } from "react";
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
import Loading from "./Loading";
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import ModalDeleteComment from "./ModalDeleteComment";
import WEB_URL from "../Helpers/websiteUrl";

const Recipe = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { data } = props;
  const { id, is_verified, username } = useSelector((state) => state.user);
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
  const [loading, setLoading] = useState(false);
  const [kissed, setKissed] = useState(liked);
  const [likes, setLikes] = useState(totalLikes);
  const [likers, setLikers] = useState(0);
  const [likersMore, setLikersMore] = useState({ more: false, total: 0 });
  const [comments, setComments] = useState([]);
  const [comment_id, setComment_id] = useState(0);
  const [modalDeleteComment, setModalDeleteComment] = useState(false);
  const [commentsMore, setCommentsMore] = useState({ more: false, total: 0 });
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

  // Animation share button
  const animationShare = {
    item4: {
      hidden: { x: 0, y: 5, opacity: 1 },
      visible: {
        x: 45,
        y: -35,
        opacity: 1,
      },
    },
    item3: {
      hidden: { x: 0, y: 5, opacity: 1 },
      visible: {
        x: -2,
        y: -45,
        opacity: 1,
      },
    },
    item2: {
      hidden: { x: 0, y: 5, opacity: 1 },
      visible: {
        x: -43,
        y: -18,
        opacity: 1,
      },
    },
    item1: {
      hidden: { x: 0, y: 5, opacity: 1 },
      visible: {
        x: -40,
        y: 30,
        opacity: 1,
      },
    },
    container: {
      hidden: { opacity: 1, x: 0 },
      visible: {
        opacity: 1,
        x: 0,
        transition: {
          delayChildren: 0,
          staggerChildren: 0.1,
        },
      },
    },
  };
  //////////////////////

  const createdAtPost = new Date(updated_at).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  function copy() {
    navigator.clipboard.writeText(`${WEB_URL}/recipe/${post_id}`);
  }

  const modalNewCommentHandler = () => {
    setModalNewComment(!modalNewComment);
  };
  const modalDeleteHandler = () => {
    setModalDelete(!modalDelete);
  };
  const modalDeleteCommentHandler = () => {
    setModalDeleteComment(!modalDeleteComment);
  };

  ///////////////////////// Fetching Methods//////////////////////
  ///////// Comments Fetching /////////////
  const getComments = async () => {
    try {
      setLoading(true);
      setIsPage({ main: 0, recipe: 0, kisses: 0, comment: 1 });
      let res = await axios.post(`${API_URL}/recipe/recipe-comments`, {
        post_id: post_id,
      });
      setComments(res.data.splice(0, 5));
      if (res.data[0]) {
        setCommentsMore({ more: true, total: res.data.length });
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  /////////////////////////////////////////

  ////////// Likers Fetching //////////////
  const getLikers = async () => {
    try {
      setLoading(true);
      setIsPage({ main: 0, recipe: 0, kisses: 1, comment: 0 });
      let res = await axios.post(`${API_URL}/recipe/recipe-likers`, {
        post_id,
      });
      setLikers(res.data.splice(0, 5));
      if (res.data[0]) {
        setLikersMore({ more: true, total: res.data.length });
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  /////////////////////////////////////////

  // Ingredients & Instructions Fetching //
  const getRecipe = async () => {
    try {
      if (recipeFetched) {
        setIsPage({ main: 0, recipe: 1, kisses: 0, comment: 0 });
      } else {
        setLoading(true);
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
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  /////////////////////////////////////////
  /////////////////////////////////////////////////////////////////

  //////////////////// Render Functions ///////////////////////////
  // Like Button Render ////////////////////
  const printKissed = () => {
    return (
      <button
        className={`h-12 w-12 rounded-full border-2 border-merah mr-2 overflow-hidden duration-500 hover:shadow-black shadow-md shadow-black/50 focus:outline-none ${
          kissed ? "bg-merah" : "bg-putih"
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
        <img
          src={kiss}
          alt=""
          className={`${kissed ? null : "grayscale"} scale-75`}
        />
      </button>
    );
  };
  //////////////////////////////////////////

  // Ingredients List Render ///////////////
  const printIngredients = () => {
    return (
      <ul className="max-w-full h-full list-disc ml-5 break-words text-xs sm:text-base bg-putih">
        {recipe.ingredients.map((content) => {
          return (
            <li key={content.ingredient_id} className="my-2">
              {content.ingredient}
            </li>
          );
        })}
      </ul>
    );
  };
  //////////////////////////////////////////

  // Instructions List Render //////////////
  const printInstructions = () => {
    return (
      <ol className="max-w-full h-full list-decimal ml-5 break-words text-xs sm:text-base bg-putih">
        {recipe.instructions.map((content) => {
          return (
            <li key={content.instruction_id} className="my-2">
              {content.instruction}
            </li>
          );
        })}
      </ol>
    );
  };
  //////////////////////////////////////////

  // Likers List Render ////////////////////
  const printUserLikes = () => {
    return (
      <ul className="max-w-full ml-5 break-words text-base bg-putih">
        {likers.map((content) => {
          return (
            <li key={content.id}>
              <div
                className="flex rounded-md hover:bg-white/50 cursor-pointer text-base py-2"
                onClick={() => {
                  content.username === username
                    ? navigate("/account")
                    : navigate(`/profile/${content.username}`);
                }}
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full mr-3  overflow-hidden">
                  <img
                    src={
                      content.profile_picture
                        ? API_URL + content.profile_picture
                        : cat
                    }
                    alt=""
                  />
                </div>
                <div className="text-xs md:text-base">
                  <div className="mb-1">{content.username}</div>
                  <div>{content.fullname}</div>
                </div>
              </div>
            </li>
          );
        })}
        {likersMore.more ? (
          <div
            className="bg-merah flex justify-center py-3 text-xs sm:text-base rounded-xl text-center items-center text-putih cursor-pointer"
            onClick={() => navigate(`/recipe/${post_id}`)}
          >
            See {likersMore.total} more comments on recipe details
          </div>
        ) : null}
      </ul>
    );
  };
  //////////////////////////////////////////

  // Comments List Render //////////////////
  const printComments = () => {
    return (
      <ul className="max-w-full ml-5 break-words text-base bg-putih py-2">
        {comments.map((content) => {
          return (
            <li className="flex flex-col mb-2" key={content.id}>
              <div className="flex justify-between items-center">
                <div className="w-full flex justify-between">
                  <div
                    className="flex rounded-md hover:bg-white/50 cursor-pointer text-base"
                    onClick={() => {
                      content.username === username
                        ? navigate("/account")
                        : navigate(`/profile/${content.username}`);
                    }}
                  >
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full mr-3 overflow-hidden">
                      <img
                        src={
                          content.profile_picture
                            ? API_URL + content.profile_picture
                            : cat
                        }
                        alt=""
                      />
                    </div>
                    <div className="text-xs md:text-base">
                      <div className="mb-1">{content.username}</div>
                      <div>{content.fullname}</div>
                    </div>
                  </div>
                </div>
                {id === content.user_id ? (
                  <button
                    onClick={() => {
                      setComment_id(content.id);
                      modalDeleteCommentHandler();
                    }}
                    className={`cursor-pointer text-merah/50 duration-500 border-2 rounded-full mr-3 p-1 focus:outline-none hover:bg-merah/30 hover:border-transparent border-merah/30`}
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                ) : (
                  ""
                )}
              </div>
              <div className="ml-8 sm:ml-16 relative mr-2">
                <div className="absolute border-b border-hijau w-7 h-2 rotate-45 top-3 bg-putih "></div>
                <div className="absolute border-t border-hijau w-5 h-2 rotate-[21deg] top-3"></div>
                <div className="border-hijau border ml-5 p-2 block rounded-lg text-xs sm:text-base bg-putih">
                  {content.comment}
                </div>
              </div>
            </li>
          );
        })}
        {commentsMore.more ? (
          <div
            className="bg-merah flex justify-center text-xs sm:text-base items-center text-center text-putih py-3 rounded-xl cursor-pointer"
            onClick={() => navigate(`/recipe/${post_id}`)}
          >
            See {commentsMore.total} more comments on recipe details
          </div>
        ) : null}
      </ul>
    );
  };
  ////////////////////////////////////////////////////////////////

  ///////////////////////// Component Render /////////////////////
  return (
    <div
      className={`
    relative w-full aspect-square mb-5 rounded-xl overflow-hidden bg-transparent shadow-black/50 shadow-lg`}
    >
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

      {modalDelete && (
        <ModalDelete
          setModalDelete={setModalDelete}
          modalDelete={modalDelete}
          modalDeleteHandler={modalDeleteHandler}
          post_id={post_id}
        />
      )}

      {modalDeleteComment && (
        <ModalDeleteComment
          setModalDeleteComment={setModalDeleteComment}
          modalDeleteComment={modalDeleteComment}
          modalDeleteCommentHandler={modalDeleteCommentHandler}
          comment_id={comment_id}
          getComments={getComments}
          printComments={printComments}
          post_id={post_id}
        />
      )}

      {/* Side Nav Buttons */}
      <div className="absolute w-[6%] left-[94%] flex flex-col h-full z-10 bg-black/40 rounded-r">
        {/* Front Page Button */}
        <button
          type="button"
          className={`w-full h-[10%]  rounded-r focus:outline-none duration-500 border-b border-black/30 ${
            isPage.main ? "text-merah bg-putih" : "bg-putih brightness-75"
          }`}
          onClick={() => {
            return setIsPage({ main: 1, recipe: 0, kisses: 0, comment: 0 });
          }}
        >
          <ChevronLeftIcon
            className={`${
              isPage.main
                ? "w-full h-full duration-500"
                : "w-full h-full duration-500"
            }`}
          />
        </button>

        {/* Recipe Page Button */}
        <button
          type="button"
          className={`${
            isPage.recipe ? " text-merah" : "brightness-75"
          } w-full h-[30%] rounded-r bg-putih focus:outline-none  duration-500 text-xs sm:text-sm border-b border-black/30`}
          onClick={() => getRecipe()}
        >
          <p className="rotate-90 tracking-[.5em] sm:tracking-[1em] -mt-8 sm:-mt-14">
            RECIPE
          </p>
        </button>
        {/*  */}
        {/* Likes Page Button */}
        <button
          type="button"
          className={`w-full h-[30%] bg-putih rounded-r focus:outline-none duration-500 text-xs sm:text-sm border-b border-black/30 ${
            isPage.kisses ? "text-merah" : "brightness-75"
          }`}
          onClick={() => getLikers()}
        >
          <p className="rotate-90 tracking-[.5em] sm:tracking-[1em] -mt-9 sm:-mt-14 translate-y-1">
            KISSES
          </p>
        </button>

        {/* Comments Page Button */}
        <button
          type="button"
          className={`w-full h-[30%] rounded-r bg-putih focus:outline-none duration-500 text-xs sm:text-sm ${
            isPage.comment ? "text-merah" : "brightness-75"
          }`}
          onClick={() => getComments()}
        >
          <p className="rotate-90 tracking-[.25em] sm:tracking-[.5em] -mt-10 sm:-mt-14 -translate-y-1 ">
            COMMENTS
          </p>
        </button>
      </div>

      {/* Front Page */}
      {isPage.main === 1 && (
        <>
          <div className="h-full w-[95%] absolute pr-3 rounded-l-xl overflow-hidden">
            <div className="h-full flex flex-col w-full py-5 bg-putih rounded-l">
              <div className="h-[10%] w-full flex justify-between px-5 text-sm">
                <div
                  className="flex rounded-full items-center pr-5 hover:bg-white/50 cursor-pointer duration-500"
                  onClick={() => {
                    user.username === username
                      ? navigate("/account")
                      : navigate(`/profile/${user.username}`);
                  }}
                >
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full mr-3 overflow-hidden">
                    <img
                      src={
                        user.profile_picture
                          ? API_URL + user.profile_picture
                          : cat
                      }
                      alt=""
                    />
                  </div>
                  <div className="flex flex-col justify-around">
                    <div className="text-lg font-semibold">{user.username}</div>
                    <div className="text-xs">{createdAtPost}</div>
                  </div>
                </div>
                <div className="flex flex-col text-center items-end justify-end mb-1">
                  {/* Popover Button Settings */}
                  {id === user_id ? (
                    <Popover className="relative">
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
              <div className="h-[80%] w-full relative mt-3 pb-4">
                {/* <div className="w-20 h-6 origin-center rotate-[-45deg] absolute top-4 z-10 bg-white/50"></div>
                <div className="w-20 h-6 origin-center rotate-[-45deg] absolute bottom-14 z-10 right-0 bg-white/50"></div> */}
                <div className="h-full w-full p-5 -mt-3 ">
                  <div className="h-full bg-white relative flex flex-col">
                    <div
                      className="w-full aspect-video p-2 pb-0 cursor-pointer"
                      onClick={() => navigate(`/recipe/${post_id}`)}
                    >
                      <img
                        src={`${API_URL}${photo}`}
                        alt=""
                        className="w-full h-full object-cover"
                        style={{ objectPosition: "0 0" }}
                      />
                    </div>
                    <div
                      className="h-[100px] flex items-center  w-full font-semibold justify-center text-center p-2 m text-sm sm:text-xl cursor-pointer"
                      onClick={() => navigate(`/recipe/${post_id}`)}
                    >
                      "{title}"
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-[10%] w-full flex justify-between item px-10 -mt-5">
                <div className="flex items-center">
                  {printKissed()}
                  <span className="text-xs">
                    {likes
                      ? `${likes} chefs like this!`
                      : "No chef likes this recipe :<"}
                  </span>
                </div>
                {/* Popover Button Share */}
                <div className="flex items-center">
                  <Popover className="relative overflow-visible w-12 h-12 rounded-full">
                    {({ open }) => (
                      <>
                        <Popover.Button
                          className={`${
                            open ? "bg-biru" : "bg-putih"
                          } h-12 w-12 z-20 rounded-full border-2 border-biru overflow-hidden duration-500 shadow-md shadow-black/50 hover:shadow-black focus:outline-none relative`}
                        >
                          <PaperAirplaneIcon
                            className={`${
                              open
                                ? "text-putih rotate-[45deg]"
                                : "text-black/60 -rotate-180"
                            } h-full w-full scale-75 duration-500 z-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
                          />
                        </Popover.Button>
                        <AnimatePresence>
                          {open && (
                            <Popover.Panel
                              as={motion.div}
                              static
                              variants={animationShare.container}
                              initial="hidden"
                              animate="visible"
                              exit="hidden"
                              className="absolute top-0 focus:outline-none z-10 flex flex-col gap-y-2 h-14 w-14 pointer-events-none"
                            >
                              <motion.div
                                variants={animationShare.item1}
                                className="absolute h-11 w-11"
                              >
                                <TwitterShareButton
                                  url={`${WEB_URL}/recipe/${post_id}`}
                                  title={`Check this delicious recipe from TheChefBook.com: ${data.title}`}
                                >
                                  <TwitterIcon
                                    size={40}
                                    round={true}
                                    className="absolute top-0 left-0 rounded-full shadow-black shadow-md pointer-events-auto"
                                    style={{ backgroundColor: "#00ACED" }}
                                  />
                                </TwitterShareButton>
                              </motion.div>
                              <motion.div
                                variants={animationShare.item2}
                                className="absolute h-11 w-11"
                              >
                                <WhatsappShareButton
                                  url={`${WEB_URL}/recipe/${post_id}`}
                                  title={`Check this delicious recipe from TheChefBook.com: ${data.title}`}
                                >
                                  <WhatsappIcon
                                    size={40}
                                    round={true}
                                    className="absolute top-0 left-0 rounded-full shadow-black shadow-md pointer-events-auto"
                                    style={{ backgroundColor: "#25D366" }}
                                  />
                                </WhatsappShareButton>
                              </motion.div>
                              <motion.div
                                variants={animationShare.item3}
                                className="absolute h-11 w-11"
                              >
                                <FacebookShareButton
                                  url={`${WEB_URL}/recipe/${post_id}`}
                                  quote={`Check this delicious recipe from TheChefBook.com: ${data.title}`}
                                >
                                  <FacebookIcon
                                    size={40}
                                    round={true}
                                    className="absolute top-0 left-0 rounded-full shadow-black shadow-md pointer-events-auto"
                                    style={{ backgroundColor: "#3B5998" }}
                                  />
                                </FacebookShareButton>
                              </motion.div>
                              <motion.div
                                variants={animationShare.item4}
                                className="absolute  h-11 w-11"
                              >
                                <button
                                  onClick={() => {
                                    copy();
                                    toast.success("URL copied to clipboard!", {
                                      position: "top-center",
                                      theme: "colored",
                                      style: { backgroundColor: "#3A7D44" },
                                    });
                                  }}
                                  className="h-10 w-10 rounded-full  overflow-hidden  bg-merah shadow-black shadow-md focus:outline-none pointer-events-auto"
                                >
                                  <LinkIcon className="h-full w-full p-2 text-putih" />
                                </button>
                              </motion.div>
                            </Popover.Panel>
                          )}
                        </AnimatePresence>
                      </>
                    )}
                  </Popover>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Recipe Page */}
      {isPage.recipe === 1 && (
        <>
          <div className="h-full w-[95%] absolute pr-3 rounded-l">
            <div className="h-full flex flex-col w-full p-5 bg-putih rounded-l">
              <div className="w-full h-1/2 bg-putih flex flex-col text-sm sm:text-base">
                Ingredients:
                <div className="w-full h-full overflow-y-scroll border-y border-merah">
                  {loading ? (
                    <div className="h-full flex flex-col justify-center items-center">
                      <Loading className="h-12 w-12 md:h-14 md:w-14 animate-spin" />
                      <div>Please wait...</div>
                    </div>
                  ) : (
                    printIngredients()
                  )}
                </div>
              </div>
              <div className="w-full h-1/2 bg-putih flex flex-col text-sm sm:text-base">
                Instructions:
                <div className="w-full h-full overflow-y-scroll border-y border-merah">
                  {loading ? (
                    <div className="h-full flex flex-col justify-center items-center">
                      <Loading className="h-12 w-12 md:h-14 md:w-14 animate-spin" />
                      <div>Please wait...</div>
                    </div>
                  ) : (
                    printInstructions()
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Kisses Page */}
      {isPage.kisses === 1 && (
        <>
          <div className="h-full w-[95%] absolute pr-3 flex rounded-l ">
            <div className="h-full flex flex-col w-full p-5 bg-putih rounded-l">
              <div className="w-full relative bg-putih text-xl sm:text-3xl">
                {likes} Chefs loved this recipe:
              </div>

              <div className="h-full w-full relative bg-putih border-y border-merah  overflow-y-scroll mt-5">
                {loading ? (
                  <div className="h-full flex flex-col justify-center items-center">
                    <Loading className="h-12 w-12 md:h-14 md:w-14 animate-spin" />
                    <div>Please wait...</div>
                  </div>
                ) : likers[0] ? (
                  printUserLikes()
                ) : (
                  "No chef likes this recipe :<"
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Comments Page */}
      {isPage.comment === 1 && (
        <>
          <div className="h-full w-[95%] absolute pr-3 flex rounded-l">
            <div className="h-full flex flex-col w-full p-5 bg-putih rounded-l">
              <div className="w-full relative bg-putih text-xl sm:text-3xl">
                Comments from other chefs:
              </div>
              <div className="h-full w-full relative bg-putih overflow-y-scroll border-y border-merah mt-5">
                {loading ? (
                  <div className="py-20 flex flex-col justify-center items-center">
                    <Loading className="h-12 w-12 md:h-14 md:w-14 animate-spin" />
                    <div>Please wait...</div>
                  </div>
                ) : comments[0] ? (
                  printComments()
                ) : (
                  <div className="h-full flex items-center justify-center text-center text-xs md:text-base">
                    No chef commented here :&#60;
                  </div>
                )}
              </div>

              <div className="w-full relative bg-putih text-3xl">
                <div className="flex items-center pt-2">
                  <button
                    type="button"
                    className={`${
                      modalNewComment ? "bg-hijau" : "bg-putih"
                    } h-12 w-12 md:h-14 md:w-14 rounded-full border-2 border-hijau ml-1 
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
                        modalNewComment ? "text-putih" : "text-black/60"
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
  ////////////////////////////////////////////////////////////////
};

export default Recipe;
