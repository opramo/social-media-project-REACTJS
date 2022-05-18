import {
  ChatAltIcon,
  DotsHorizontalIcon,
  PaperAirplaneIcon,
} from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import API_URL from "../Helpers/apiurl";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate, useParams } from "react-router-dom";
import kiss from "../Assets/kiss.png";
import cat from "../Assets/cat.jpg";
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
import ModalNewComment from "../components/ModalNewComment";

const RecipeDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const { is_verified, loading, id } = useSelector((state) => state.user);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [modalNewComment, setModalNewComment] = useState(false);
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
  const [kissed, setKissed] = useState(0);
  const [likes, setLikes] = useState(0);
  const [likers, setLikers] = useState([]);
  const [comments, setComments] = useState([]);

  const post_id = params.post_id;

  const modalNewCommentHandler = () => {
    setModalNewComment(!modalNewComment);
  };

  const getRecipe = async () => {
    try {
      setLoadingPosts(true);
      let res = await axios.post(`${API_URL}/recipe/recipe-detail`, {
        post_id,
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
        photo: `${API_URL}${photo}`,
        profile_picture: `${API_URL}${profile_picture}`,
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
    } catch (error) {
      console.log(error);
    }
  };
  console.log("modal comment detail: ", modalNewComment);
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
  useEffect(() => {
    getRecipe();
  }, []);

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
  const onSubmit = async (values, { setSubmitting }) => {};
  if (loadingPosts) {
    return (
      <div className="min-h-screen flex pt-20 bg-putih justify-center">
        <div className="shadow-lg my-10 shadow-black w-[600px] rounded-2xl overflow-hidden">
          Loading
        </div>
      </div>
    );
  }
  return (
    <div className="h-screen flex pt-20 bg-putih justify-center">
      <ModalNewComment
        modalNewComment={modalNewComment}
        modalNewCommentHandler={modalNewCommentHandler}
        post_id={post_id}
        comments={comments}
        setComments={setComments}
        setModalNewComment={setModalNewComment}
      />
      <div className="w-full flex h-full justify-center overflow-y-scroll relative">
        <div className="w-20 sticky top-10 flex flex-col">
          <>{printKissed()}</>
          <button
            type="button"
            className={`${
              modalNewComment ? "bg-hijau" : "bg-putih"
            } z-40 h-14 w-14 mt-2 rounded-full  border-2 border-hijau overflow-hidden duration-500 hover:shadow-black shadow-md focus:outline-none`}
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
              } h-full w-full p-2`}
            />
          </button>
          <button className="h-14 w-14 mt-2 rounded-full  border-2 border-biru overflow-hidden  hover:bg-biru duration-500 hover:shadow-black shadow-md focus:outline-none">
            <PaperAirplaneIcon className="h-full w-full p-2 hover:text-white " />
          </button>
          <TwitterShareButton
            url={`${API_URL}/recipe/${post_id}`}
            title="TheChefBook.com"
          >
            <TwitterIcon size={32} round={true} />
          </TwitterShareButton>
          <WhatsappShareButton url={`${API_URL}/recipe/${post_id}`}>
            <WhatsappIcon size={32} round={true} />
          </WhatsappShareButton>
          <FacebookShareButton url={`${API_URL}/recipe/${post_id}`}>
            <FacebookIcon size={32} round={true} />
          </FacebookShareButton>
          <button
            onClick={copy}
            className="h-14 w-14 mt-2 rounded-full  border-2 border-biru overflow-hidden  hover:bg-biru duration-500 hover:shadow-black shadow-md focus:outline-none"
          >
            URL
          </button>
        </div>
        <div className="shadow-lg my-10 shadow-black w-[600px] rounded-2xl relative">
          <div>
            <img
              src={data.photo}
              alt=""
              className="h-[400px] w-[600px] rounded-t-2xl"
            />
          </div>
          {/* user */}
          <div className="">
            <div className="w-full flex justify-between px-5 text-sm relative">
              <div
                className="flex h-full rounded-md hover:bg-white/50 cursor-pointer"
                onClick={() => navigate("/account")}
              >
                <div className="w-20 h-20 rounded-full overflow-hidden absolute bottom-2 border-2 border-putih">
                  <img src={data.profile_picture} alt="" />
                </div>
                <div className="pl-24 pr-2 flex flex-col justify-between">
                  <div className="mb-1">{data.username}</div>
                  <div>{data.fullname}</div>
                </div>
              </div>
              <div className="h-11 flex flex-col justify-between items-end">
                <div className="text-xs">{createdAtPost}</div>
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
                                  // dispatch({
                                  //   type: "NEWEDIT",
                                  //   payload: post_id,
                                  // });
                                }}
                              >
                                Edit
                              </div>
                              <div
                                className={`hover:bg-merah hover:text-putih duration-500 cursor-pointer block px-5 py-3 whitespace-no-wrap`}
                                onClick={() => {
                                  // modalDeleteHandler();
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
            <div className="flex items-center justify-center text-center text-3xl">
              "{data.title}"
            </div>
            <div className="flex items-center justify-center text-center text-base">
              {likes
                ? `${likes} chefs like this!`
                : "No chef likes this recipe :<"}
            </div>
          </div>
          {/* Ingredients */}
          <div>
            <div className="w-full bg-putih h mb-7">
              Ingredients:
              <div className="w-full border-merah">
                {/* {loading ? "Loading..." : printIngredients()} */}
                <ul className="max-w-full list-disc ml-5 break-words text-base bg-putih">
                  {data.ingredients.map((content) => {
                    return (
                      <li key={content.ingredient_id}>{content.ingredient}</li>
                    );
                  })}
                </ul>
              </div>
            </div>
            <div className="w-full bg-putih">
              Instructions:
              <div className="w-full border-merah">
                <ol className="max-w-full list-decimal ml-5 break-words text-sm bg-putih">
                  {data.instructions.map((content) => {
                    return (
                      <li key={content.instruction_id}>
                        {content.instruction}
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>
          </div>
          {/* Liked */}
          <div className="w-full bg-putih">
            Likers:
            <div className="w-full border-y border-merah">
              <ul className="max-w-full ml-5 break-words text-xl bg-putih">
                {likers.map((content) => {
                  return (
                    <li key={content.id}>
                      <div
                        className="flex rounded-md hover:bg-white/50 cursor-pointer text-base py-2"
                        onClick={() => navigate("/account")}
                      >
                        <div className="w-12 h-12 rounded-full mr-3 bg-merah overflow-hidden">
                          <img
                            src={`${API_URL}${content.profile_picture}`}
                            alt=""
                          />
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
            </div>
          </div>
          {/* Comments */}
          <div className="flex flex-col w-full p-5 bg-putih">
            <div className="w-full relative bg-putih text-3xl">
              Comments from other chefs:
            </div>
            <div className="h-full w-full relative bg-putih overflow-y-scroll border-y border-merah mt-5">
              {comments[0] ? (
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
                              <img
                                src={`${API_URL}${content.profile_picture}`}
                                alt=""
                              />
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
              ) : (
                "No chef commented here :<"
              )}
            </div>
          </div>
        </div>
        <div className="h-60 w-20 sticky top-10  flex flex-col">
          {/* This div to make the content centered */}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetails;
