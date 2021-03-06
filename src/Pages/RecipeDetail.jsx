import {
  ChatAltIcon,
  DotsHorizontalIcon,
  PaperAirplaneIcon,
  LinkIcon,
  TrashIcon,
} from "@heroicons/react/outline";
import cat from "../Assets/cat.jpg";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import API_URL from "../Helpers/apiurl";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import kiss from "../Assets/kiss.png";
import { Popover } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import Loading from "../components/Loading";
import ModalDelete from "../components/ModalDelete";
import ModalNewComment from "../components/ModalNewComment";
import ModalDeleteComment from "../components/ModalDeleteComment";

const RecipeDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();

  const { is_verified, id, username, isLogIn } = useSelector(
    (state) => state.user
  );
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [modalNewComment, setModalNewComment] = useState(false);
  const [modalDelete, setModalDelete] = useState(false);
  const [modalDeleteComment, setModalDeleteComment] = useState(false);
  const [data, setData] = useState({
    title: "",
    user_id: 0,
    photo: "",
    updated_at: "",
    username: "",
    fullname: "",
    profile_picture: "",
    ingredients: [],
    instructions: [],
  });
  const [kissed, setKissed] = useState(null);
  const [likes, setLikes] = useState(0);
  const [likers, setLikers] = useState([]);
  const [likersRender, setLikersRender] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentsRender, setCommentsRender] = useState([]);
  const [comment_id, setComment_id] = useState(0);
  const post_id = params.post_id;

  const animationShare = {
    item4: {
      hidden: { x: 0, y: 10, opacity: 1 },
      visible: {
        x: -55,
        y: -35,
        opacity: 1,
      },
    },
    item3: {
      hidden: { x: 0, y: 10, opacity: 1 },
      visible: {
        x: -60,
        y: 10,
        opacity: 1,
      },
    },
    item2: {
      hidden: { x: 0, y: 10, opacity: 1 },
      visible: {
        x: -40,
        y: 50,
        opacity: 1,
      },
    },
    item1: {
      hidden: { x: 0, y: 10, opacity: 1 },
      visible: {
        x: 0,
        y: 70,
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

  const modalNewCommentHandler = () => {
    setModalNewComment(!modalNewComment);
  };
  const modalDeleteHandler = () => {
    setModalDelete(!modalDelete);
  };
  const modalDeleteCommentHandler = () => {
    setModalDeleteComment(!modalDeleteComment);
  };

  const printKissed = () => {
    return (
      <button
        className={`h-12 w-12 sm:h-14 sm:w-14 rounded-full border-2 border-merah overflow-hidden duration-500 hover:shadow-black shadow-md focus:outline-none ${
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
            } else if (!isLogIn) {
              toast.error("Please login into your account!", {
                theme: "colored",
                position: "top-center",
                style: { backgroundColor: "#A90409" },
              });
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

  useEffect(() => {
    (async function fetchdata() {
      try {
        setLoadingPosts(true);
        let res = await axios.get(`${API_URL}/recipe/recipe-detail`, {
          params: { post_id, id },
        });
        const {
          ingredients,
          instructions,
          post,
          user,
          likes,
          liked,
          likers,
          comments,
        } = res.data;
        const { username, fullname, profile_picture } = user;
        const { updated_at, photo, title, user_id } = post;
        setData({
          photo,
          profile_picture,
          title,
          user_id,
          updated_at,
          username,
          fullname,
          ingredients,
          instructions,
        });
        setLikes(likes);
        setLikers(likers);
        setComments(comments);
        setKissed(liked);
        setLoadingPosts(false);
        if (comments[0]) {
          setCommentsRender([...comments.splice(0, 5)]);
        }
        if (likers[0]) {
          setLikersRender([...likers.splice(0, 5)]);
        }
      } catch (error) {
        navigate("/notfound404");
      }
    })();
    window.scrollTo(0, 0);
    // eslint-disable-next-line
  }, []);

  window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  };

  const moreComments = () => {
    if (comments[0]) {
      setCommentsRender((prev) => [...prev, ...comments.splice(0, 5)]);
    }
  };
  const moreLikers = () => {
    if (likers[0]) {
      setLikersRender((prev) => [...prev, ...likers.splice(0, 5)]);
    }
  };

  function copy() {
    const el = document.createElement("input");
    el.value = window.location.href;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  }

  const createdAtPost = new Date(data.updated_at).toLocaleDateString(
    undefined,
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  if (loadingPosts) {
    return (
      <div className="min-h-screen flex pt-20 bg-putih justify-center">
        <div className="shadow-lg my-10 shadow-black w-[600px] rounded-2xl overflow-hidden flex flex-col justify-center items-center">
          <Loading className="h-20 w-20 animate-bounce" />
          <div>Please wait...</div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex pt-20 bg-putih justify-center">
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
          post_id={post_id}
        />
      )}
      {/* Div to center content */}
      <div className="h-60 hidden sticky top-32 sm:flex flex-col items-end w-20 pointer-events-none" />

      {/* Content */}
      <div className="flex sm:my-5 justify-center overflow-hidden relative z-0  sm:rounded-2xl shadow-lg shadow-black/50 sm:w-[600px]">
        <div className="z-0 w-full rounded-2xl relative ">
          <div className="w-full flex flex-col justify-center bg-putih z-10">
            <div className="w-full aspect-video rounded-t-2xl relative">
              <img
                src={API_URL + data.photo}
                alt=""
                className="w-full h-full object-cover"
                style={{ objectPosition: "0 0" }}
              />
              <div className="w-full h-20 bg-gradient-to-t from-black/50 absolute bottom-0"></div>
              <div className="absolute -bottom-1 right-5 mb-1 text-putih text-xs sm:text-base">
                {createdAtPost}
              </div>
            </div>
            <div className="w-full flex justify-between px-5 text-sm relative">
              <div
                className="flex h-full rounded-full py-2 hover:bg-white/50 cursor-pointer text-putih hover:text-black -mt-7 duration-500"
                onClick={() => {
                  data.username === username
                    ? navigate("/account")
                    : navigate(`/profile/${data.username}`);
                }}
              >
                <div className="w-20 h-20 rounded-full overflow-hidden absolute -bottom-2 border-2 border-putih">
                  <img
                    src={
                      data.profile_picture
                        ? API_URL + data.profile_picture
                        : cat
                    }
                    alt=""
                  />
                </div>
                <div className="pl-24 pr-5 flex flex-col justify-between">
                  <div className="">
                    by
                    <span className="font-bold"> {data.username}</span>
                  </div>
                  <div className="text-black">{data.fullname}</div>
                </div>
              </div>
              <div className="flex flex-col text-center items-end justify-end mb-1 -mt-5">
                {id === data.user_id ? (
                  <Popover className="relative h-5">
                    {({ open }) => (
                      <>
                        <Popover.Button>
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
            <div className="flex items-center justify-center text-center text-xl sm:text-3xl py-3 sm:py-5">
              "{data.title}"
            </div>
            <div className="flex items-center justify-center text-center text-xs sm:text-base">
              {likes
                ? `${likes} chefs like this!`
                : "No chef likes this recipe :<"}
            </div>

            <div className="flex flex-col w-full p-5 bg-putih">
              {/* Ingredients */}
              <div className="w-full bg-putih h mb-0 text-xl border-t border-merah">
                <div className="h-10 flex items-center">Ingredients:</div>
                <div className="w-full border-y border-merah">
                  <ul className="max-w-full list-disc ml-5 break-words text-sm sm:text-lg py-3">
                    {data.ingredients.map((content) => {
                      return (
                        <li key={content.ingredient_id} className="mb-3">
                          {content.ingredient}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
              <div className="w-full bg-putih text-xl ">
                <div className="h-10 flex items-center">Instructions:</div>
                <div className="w-full border-y border-merah">
                  <ol className="max-w-full list-decimal ml-5 break-words text-sm sm:text-lg py-3">
                    {data.instructions.map((content) => {
                      return (
                        <li
                          key={content.instruction_id}
                          className="mb-3 text-justify pr-2"
                        >
                          {content.instruction}
                        </li>
                      );
                    })}
                  </ol>
                </div>
              </div>
              {/* Liked */}
              <div className="w-full bg-putih text-xl">
                <div className="h-10 flex items-center">
                  Chefs loved this recipe:
                </div>
                <div className="h-full w-full relative bg-putih overflow-y-scroll border-y border-merah">
                  {likersRender[0] ? (
                    <ul className="max-w-full break-words text-xl bg-putih">
                      {likersRender.map((content) => {
                        return (
                          <li key={content.id}>
                            <div
                              className="flex rounded-md hover:bg-white/50 cursor-pointer text-base py-2 w-auto"
                              onClick={() => {
                                content.username === username
                                  ? navigate("/account")
                                  : navigate(`/profile/${content.username}`);
                              }}
                            >
                              <div className="w-12 h-12 rounded-full mr-3 overflow-hidden">
                                <img
                                  src={
                                    content.profile_picture
                                      ? API_URL + content.profile_picture
                                      : cat
                                  }
                                  alt=""
                                />
                              </div>
                              <div className="text-sm">
                                <div className="mb-1">{content.username}</div>
                                <div>{content.fullname}</div>
                              </div>
                            </div>
                          </li>
                        );
                      })}
                      {likers[0] ? (
                        <div
                          className="bg-merah flex justify-center items-center text-putih py-3 rounded-xl my-3 cursor-pointer text-base"
                          onClick={() => moreLikers()}
                        >
                          See {likers.length} more
                        </div>
                      ) : null}
                    </ul>
                  ) : (
                    <div className="h-20 flex items-center justify-center text-center text-xs sm:text-base">
                      No chef likes this recipe :&#60;
                    </div>
                  )}
                </div>
              </div>
              {/* Comments */}
              <div className="w-full bg-putih text-xl">
                <div className="h-10 flex items-center">
                  Comments from other chefs:
                </div>
                <div className="h-full w-full relative bg-putih overflow-y-scroll border-y border-merah">
                  {commentsRender[0] ? (
                    <ul className="max-w-full break-words text-base bg-putih py-2">
                      {commentsRender.map((content) => {
                        return (
                          <li className="flex flex-col" key={content.id}>
                            <div className="flex justify-between items-center">
                              <div className="w-full flex justify-between">
                                <div
                                  className="flex rounded-md hover:bg-white/50 cursor-pointer text-base"
                                  onClick={() => {
                                    content.username === username
                                      ? navigate("/account")
                                      : navigate(
                                          `/profile/${content.username}`
                                        );
                                  }}
                                >
                                  <div className="w-12 h-12 rounded-full mr-3 overflow-hidden">
                                    <img
                                      src={
                                        content.profile_picture
                                          ? API_URL + content.profile_picture
                                          : cat
                                      }
                                      alt=""
                                    />
                                  </div>
                                  <div className="text-sm">
                                    <div className="mb-1">
                                      {content.username}
                                    </div>
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
                              <div className="absolute border-b border-hijau w-7 h-2 rotate-45 top-3 bg-putih"></div>
                              <div className="absolute border-t border-hijau w-5 h-2 rotate-[21deg] top-3"></div>
                              <div className="border-hijau border ml-5 p-2 block rounded-lg bg-putih">
                                {content.comment}
                              </div>
                            </div>
                          </li>
                        );
                      })}
                      {comments[0] ? (
                        <div
                          className="bg-merah flex justify-center items-center text-putih py-3 rounded-xl my-3 cursor-pointer"
                          onClick={() => moreComments()}
                        >
                          See {comments.length} more comments
                        </div>
                      ) : null}
                    </ul>
                  ) : (
                    <div className="h-20 flex items-center justify-center text-center text-xs sm:text-base">
                      No chef commented here :&#60;
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar Nav */}
      <div className="h-80 fixed sm:sticky top-32 right-2 flex flex-col items-end w-20">
        <>{printKissed()}</>

        <button
          type="button"
          className={`${
            modalNewComment ? "bg-hijau" : "bg-putih"
          } z-40 h-12 w-12 sm:h-14 sm:w-14 mt-2 rounded-full  border-2 border-hijau overflow-hidden duration-500 hover:shadow-black shadow-md focus:outline-none`}
          onClick={() => {
            if (is_verified) {
              modalNewCommentHandler();
            } else if (!isLogIn) {
              toast.error("Please login into your account!", {
                theme: "colored",
                position: "top-center",
                style: { backgroundColor: "#A90409" },
              });
            } else {
              toast.error("Please verify your account!", {
                theme: "colored",
                position: "top-center",
                style: { backgroundColor: "#A90409" },
              });
            }
          }}
        >
          <ChatAltIcon
            className={`${
              modalNewComment ? "text-putih" : "text-black/60"
            } h-full w-full p-2`}
          />
        </button>

        <Popover className="relative overflow-visible h-12 w-12 sm:h-14 sm:w-14 mt-2 rounded-full">
          {({ open }) => (
            <>
              <Popover.Button
                className={`${
                  open ? "bg-biru" : "bg-putih"
                } h-12 w-12 sm:h-14 sm:w-14 z-20 rounded-full border-2 border-biru overflow-hidden duration-500 hover:shadow-black shadow-md 
                focus:outline-none relative`}
              >
                <PaperAirplaneIcon
                  className={`${
                    open
                      ? "text-putih rotate-[310deg]"
                      : "text-black/60 rotate-180"
                  } h-full w-full p-2 duration-500 z-30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2`}
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
                    className="absolute top-0 focus:outline-none flex flex-col gap-y-2 h-14 w-14 pointer-events-none"
                  >
                    <motion.div
                      variants={animationShare.item1}
                      className="absolute"
                    >
                      <TwitterShareButton
                        url={`vermillion-gnome-3a524b.netlify.app/recipe/${post_id}`}
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
                      className="absolute"
                    >
                      <WhatsappShareButton
                        url={`vermillion-gnome-3a524b.netlify.app/recipe/${post_id}`}
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
                      className="absolute"
                    >
                      <FacebookShareButton
                        url={`vermillion-gnome-3a524b.netlify.app/recipe/${post_id}`}
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
                      className="absolute"
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
  );
};

export default RecipeDetails;
