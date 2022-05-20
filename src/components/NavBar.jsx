import { Menu } from "@headlessui/react";
import { useLocation, useNavigate } from "react-router-dom";
import Logo from "../Assets/chef.png";
import Logo1 from "../Assets/chefputih.png";
import cat from "../Assets/cat.jpg";
import cover from "../Assets/cover.jpg";
import hat from "../Assets/chefhat.png";
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
  const { username, is_verified, fullname, profile_picture, profile_cover } =
    useSelector((state) => state.user);
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
  const refresh = () => {
    window.location.reload();
  };

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
    if (modalSignUp && token) {
      console.log(`Berhasil Sign Up`);
      navigate("/verifyaccount");
      setModalSignUp(false);
    }

    if (modalLogIn && token && !is_verified) {
      console.log(`Berhasil Log In`);
      navigate("/verifyaccount");
      setModalLogIn(false);
    }
    if (
      !token &&
      (location.pathname === "/home" ||
        location.pathname === "/account" ||
        location.pathname === "/newrecipe" ||
        location.pathname === "/editrecipe" ||
        location.pathname === "/verifyaccount")
    ) {
      console.log(`Tidak ada Session`);
      navigate("/");
    }
    // eslint-disable-next-line
  }, [token]);

  // React.useEffect(() => console.log("isverified!"), [is_verified]);
  return (
    <>
      <ModalLogIn
        modalLogIn={modalLogIn}
        passVis={passVis}
        setPassVis={setPassVis}
        setModalLogIn={setModalLogIn}
        modalForgotPasswordHandler={modalForgotPasswordHandler}
        modalLogInHandler={modalLogInHandler}
        modalSignUpHandler={modalSignUpHandler}
      />
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
      <ModalForgotPassword
        modalForgotPassword={modalForgotPassword}
        modalForgotPasswordHandler={modalForgotPasswordHandler}
      />

      <div className="z-50 fixed w-screen h-20 flex justify-center bg-putih shadow-lg">
        <div className="px-10 flex items-center justify-center  relative bg-putih pointer-events-none">
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
              navigate("/");
              token ? navigate("/home") : navigate("/");
              (location.pathname === "/home" || location.pathname === "/") &&
                refresh();
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
            <Menu as="div" className="relative ">
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
                    className={`border-2 border-merah rounded-full w-36 p-2 text-left pl-8 hover:shadow-black shadow-md duration-500 focus:outline-none pointer-events-auto flex items-center
                  ${location.pathname === "/account" && "bg-merah text-putih"}
                  ${open && "bg-merah text-putih scale-110"}
                  `}
                  >
                    Profile
                    <ChevronDownIcon className="h-4 w-4 ml-3" />
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
                        className="absolute right-0 mt-4 w-56 bg-merah shadow-xl shadow-black rounded -z-10 pointer-events-auto"
                      >
                        <Menu.Item as="div" className="p-2">
                          <div className="items-center relative flex flex-col justify-end w-full text-center h-48 rounded overflow-hidden">
                            <img
                              src={
                                profile_cover ? API_URL + profile_cover : cover
                              }
                              alt="cover"
                              className="h-full w-full absolute z-0"
                            />
                            <div className=" absolute top-3 left-32 origin-center rotate-[40deg]  h-10 w-10">
                              <img
                                src={hat}
                                alt="hat"
                                className="object-cover absolute bottom-0 bg-merah/50 rounded"
                              />
                            </div>
                            <div className="my-3 rounded-full h-20 w-20 overflow-hidden border-2 border-merah z-10">
                              <img
                                src={
                                  profile_picture
                                    ? API_URL + profile_picture
                                    : cat
                                }
                                alt="pp"
                              />
                            </div>
                            <div className="h-auto w-full z-10 bg-black/30 text-white">
                              {username} {is_verified ? null : `unverified`}
                            </div>
                            <div className="h-auto w-full z-10 bg-black/30 text-white">
                              {fullname}
                            </div>
                          </div>
                        </Menu.Item>
                        <Menu.Item as="div" className="pb-2 px-2">
                          <motion.button
                            whileTap={{ scale: 0.8 }}
                            onClick={() => navigate("/account")}
                            className="border-2 w-full bg-putih border-merah block text-center rounded-full hover:text-putih hover:border-putih hover:bg-merah duration-500"
                          >
                            My Kitchen
                          </motion.button>
                        </Menu.Item>
                        <Menu.Item as="div" className="px-2">
                          <motion.button
                            whileTap={{ scale: 0.8 }}
                            onClick={() => navigate("/accountsettings")}
                            className="border-2 w-full bg-putih border-merah block text-center rounded-full hover:text-putih hover:border-putih hover:bg-merah duration-500"
                          >
                            Account Settings
                          </motion.button>
                        </Menu.Item>
                        <Menu.Item as="div" className="p-2">
                          <motion.button
                            whileTap={{ scale: 0.8 }}
                            onClick={() => {
                              logoutHandler();
                              dispatch({ type: "LOGOUT" });
                            }}
                            className="border-2 w-full bg-putih border-merah block text-center rounded-full hover:text-putih hover:border-putih hover:bg-merah duration-500"
                          >
                            Log Out
                          </motion.button>
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

          {/* <button
            className="bg-merah rounded-full p-2 w-36 text-center text-putih hover:bg-kuning hover:shadow-black shadow-md duration-500 focus:outline-none pointer-events-auto "
            onClick={() => {
              modalSignUpHandler();
            }}
          >
            Sign Up
          </button> */}
        </div>
      </div>
    </>
  );
};

export default NavBar;
