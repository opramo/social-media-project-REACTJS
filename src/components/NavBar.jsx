import { Menu } from "@headlessui/react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../Assets/chef.png";
import Logo1 from "../Assets/chefputih.png";
import cat from "../Assets/cat.jpg";
import cover from "../Assets/cover.jpg";
import * as React from "react";
import ModalLogIn from "../components/ModalLogIn";
import ModalSignUp from "../components/ModalSignUp";
import ModalForgotPassword from "./ModalForgotPassword";
import { ChevronDownIcon, PlusIcon } from "@heroicons/react/outline";
import { AnimatePresence, motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { logoutAction } from "../Redux/Actions/userActions";
import Cookies from "js-cookie";
import API_URL from "../Helpers/apiurl";
import { toast } from "react-toastify";

const NavBar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Global states
  let {
    username,
    is_verified,
    fullname,
    profile_picture,
    profile_cover,
    refresh,
  } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  // Local states
  const [modalLogIn, setModalLogIn] = React.useState(false);
  const [modalSignUp, setModalSignUp] = React.useState(false);
  const [modalForgotPassword, setModalForgotPassword] = React.useState(false);
  const [passVis, setPassVis] = React.useState(false);
  const [passConfVis, setPassConfVis] = React.useState(false);

  let token = Cookies.get("token");

  const modalLogInHandler = () => {
    setModalLogIn(!modalLogIn);
    setPassVis(false);
    dispatch({ type: "CLEARERROR" });
  };
  // const refresh = () => {
  //   window.location.reload();
  // };

  // Handler functions)
  const modalSignUpHandler = () => {
    setModalSignUp(!modalSignUp);
    setPassConfVis(false);
    setPassVis(false);
    dispatch({ type: "CLEARERROR" });
  };
  const modalForgotPasswordHandler = () => {
    setModalForgotPassword(!modalForgotPassword);
  };
  const logoutHandler = () => {
    logoutAction();
    navigate("/");
  };

  React.useEffect(() => {
    if (
      !token &&
      (location.pathname === "/home" ||
        location.pathname === "/account" ||
        location.pathname === "/accountsettings" ||
        location.pathname === "/newrecipe" ||
        location.pathname === "/editrecipe" ||
        location.pathname === "/verifyaccount")
    ) {
      console.log(`No Session`);
      navigate("/");
    }
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {modalLogIn && (
        <ModalLogIn
          modalLogIn={modalLogIn}
          passVis={passVis}
          setPassVis={setPassVis}
          setModalLogIn={setModalLogIn}
          modalForgotPasswordHandler={modalForgotPasswordHandler}
          modalLogInHandler={modalLogInHandler}
          modalSignUpHandler={modalSignUpHandler}
        />
      )}
      {modalSignUp && (
        <ModalSignUp
          setPassVis={setPassVis}
          setPassConfVis={setPassConfVis}
          setModalSignUp={setModalSignUp}
          passVis={passVis}
          passConfVis={passConfVis}
          modalSignUp={modalSignUp}
          modalSignUpHandler={modalSignUpHandler}
          modalLogInHandler={modalLogInHandler}
        />
      )}
      {modalForgotPassword && (
        <ModalForgotPassword
          modalForgotPassword={modalForgotPassword}
          modalForgotPasswordHandler={modalForgotPasswordHandler}
        />
      )}

      <div className="z-40 fixed w-screen h-20 flex justify-center bg-putih shadow-lg">
        <div className="px-36 flex items-center justify-center  relative bg-putih pointer-events-none">
          {/* Left Button */}
          {token ? (
            <motion.button
              type="button"
              // whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              transition={{
                duration: 0.1,
              }}
              onClick={() => {
                is_verified
                  ? navigate("/newrecipe")
                  : toast.error("Please verify your account!", {
                      theme: "colored",
                      position: "top-center",
                      style: { backgroundColor: "#A90409" },
                    });
              }}
              className={`border-2 text-left pl-4 border-merah rounded-full p-2 w-36 shadow-md hover:shadow-black duration-500 focus:outline-none pointer-events-auto flex items-center
               ${location.pathname === "/newrecipe" && "bg-merah  text-putih"}`}
            >
              New Recipe
              <PlusIcon className="h-4 w-4" />
            </motion.button>
          ) : (
            <motion.button
              type="button"
              // whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              transition={{
                duration: 0.1,
              }}
              className="border-merah border-2 rounded-full p-2 w-36 text-center hover:shadow-black shadow-md duration-500 focus:outline-none pointer-events-auto "
              onClick={modalLogInHandler}
            >
              Log In
            </motion.button>
          )}
          <motion.button
            type="button"
            // whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            transition={{
              duration: 0.1,
            }}
            onClick={() => {
              token ? navigate("/home") : navigate("/");
              if (location.pathname === "/home") {
                dispatch({ type: "REFRESH", payload: refresh + 1 });
                toast.success("Feeds refreshed!", {
                  theme: "colored",
                  position: "top-center",
                  style: { backgroundColor: "#3A7D44" },
                });
              }
            }}
            className={`border-2 border-merah rounded-full w-14 h-14 mx-3 shadow-md hover:shadow-black duration-500 focus:outline-none pointer-events-auto
            ${
              location.pathname === "/home" || "/"
                ? " bg-merah"
                : "bg-putih hover:bg-merah"
            }
            `}
          >
            <img
              src={location.pathname === "/home" || "/" ? Logo1 : Logo}
              alt="TheChefBook"
              className="rounded-full duration-500"
              onMouseEnter={(e) => (e.currentTarget.src = Logo1)}
              onMouseLeave={(e) => {
                if (location.pathname === "/home" || "/") {
                  return (e.currentTarget.src = Logo1);
                } else {
                  return (e.currentTarget.src = Logo);
                }
              }}
            />
          </motion.button>

          {/* Right Button */}
          {token ? (
            <Menu as="div" className="relative">
              {({ open }) => (
                <>
                  <Menu.Button
                    type="button"
                    as={motion.button}
                    // whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{
                      duration: 0.1,
                    }}
                    className={`border-2 border-merah rounded-full w-36 p-1 text-left pl-8 hover:shadow-black shadow-md duration-500 focus:outline-none pointer-events-auto flex items-center
                  ${location.pathname === "/account" && "bg-merah text-putih"}
                  ${open && "bg-merah text-putih scale-110"}
                  `}
                  >
                    Profile
                    <div className="h-8 w-8 rounded-full ml-2 overflow-hidden">
                      <ChevronDownIcon
                        className={`${
                          open ? "translate-y-2" : "-translate-y-4"
                        } h-4 w-4 rotate-180 mx-auto text-putih duration-300 `}
                      />
                      <img
                        src={profile_picture ? API_URL + profile_picture : cat}
                        alt="pp"
                        className={`${
                          open ? "translate-y-4" : "-translate-y-4"
                        } h-8 w-8 rounded-full duration-300`}
                      />
                    </div>
                    {/* <div
                      className={`${
                        open ? "rotate-180" : null
                      } ml-3 duration-500`}
                    >
                      <ChevronDownIcon className={`h-4 w-4 `} />
                    </div> */}
                  </Menu.Button>
                  <AnimatePresence>
                    {open && (
                      <Menu.Items
                        as={motion.div}
                        static
                        initial={{ y: "-100%" }}
                        animate={{ y: "0%" }}
                        exit={{ y: "-120%" }}
                        transition={{
                          duration: 0.5,
                          // ease: "easeInOut",
                          type: "spring",
                        }}
                        className="fixed sm:absolute right-0 mt-5 w-screen sm:w-56 shadow-xl bg-putih shadow-black rounded-lg overflow-hidden -z-10 pointer-events-auto cursor-pointer"
                      >
                        <Menu.Item
                          as="button"
                          className="items-center relative flex flex-col justify-end w-full text-center h-48 overflow-hidden border-b border-merah"
                          onClick={() => navigate("/account")}
                        >
                          <img
                            src={
                              profile_cover ? API_URL + profile_cover : cover
                            }
                            alt="cover"
                            className="object-cover absolute sm:h-full"
                          />
                          {is_verified ? (
                            <div className="h-auto w-full z-10 bg-gradient-to-b from-black/70 leading-10 text-white absolute top-0 font-semibold tracking-widest">
                              {username}
                            </div>
                          ) : (
                            <div className="bg-merah text-putih text-center z-10 absolute top-0 w-full py-1">
                              unverified
                            </div>
                          )}
                          {/* <div className=" absolute top-0 left-20 origin-center h-14 w-14">
                            <img
                              src={hat}
                              alt="hat"
                              className="object-cover absolute bottom-0 "
                            />
                          </div> */}
                          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full h-20 w-20 overflow-hidden shadow-md shadow-black  z-10">
                            <img
                              src={
                                profile_picture
                                  ? API_URL + profile_picture
                                  : cat
                              }
                              alt="pp"
                              className="h-20 w-20"
                            />
                          </div>

                          <div className="h-auto w-full z-10 bg-gradient-to-t from-black/70 leading-10 text-white absolute bottom-0 ">
                            {is_verified ? fullname : username}
                          </div>
                        </Menu.Item>
                        <Menu.Item
                          as={motion.button}
                          className="border-y w-full bg-putih border-merah block text-center py-2 hover:text-putih hover:bg-merah duration-250"
                          whileTap={{ scale: 0.8 }}
                          onClick={() => navigate("/account")}
                        >
                          My Profile
                        </Menu.Item>
                        <Menu.Item
                          as={motion.button}
                          whileTap={{ scale: 0.8 }}
                          onClick={() => navigate("/accountsettings")}
                          className="border-y w-full bg-putih border-merah block text-center py-2 hover:text-putih hover:bg-merah duration-250"
                        >
                          Account Settings
                        </Menu.Item>
                        <Menu.Item
                          as={motion.button}
                          className="border-t w-full bg-putih border-merah block text-center py-2 hover:text-putih hover:bg-merah duration-250"
                          whileTap={{ scale: 0.8 }}
                          onClick={() => {
                            logoutHandler();
                            dispatch({ type: "LOGOUT" });
                          }}
                        >
                          Log Out
                        </Menu.Item>
                      </Menu.Items>
                    )}
                  </AnimatePresence>
                </>
              )}
            </Menu>
          ) : (
            <motion.button
              type="button"
              // whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              transition={{
                duration: 0.1,
              }}
              className="bg-merah rounded-full p-2 w-36 text-center text-putih hover:shadow-black shadow-md duration-500 focus:outline-none pointer-events-auto "
              onClick={modalSignUpHandler}
            >
              Sign Up
            </motion.button>
          )}
        </div>
      </div>
    </>
  );
};

export default NavBar;
