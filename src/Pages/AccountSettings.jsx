import cat from "../Assets/cat.jpg";
import cover from "../Assets/cover.jpg";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import API_URL from "../Helpers/apiurl";
import Cookies from "js-cookie";
import ModalImageCropper from "../components/ModalImageCropper";
import Loading from "../components/Loading";

const AccountSettings = () => {
  const dispatch = useDispatch();
  const avaRef = useRef();
  const coverRef = useRef();
  const [modalImageCropper, setModalImageCropper] = useState(false);
  let {
    profile_picture,
    profile_cover,
    id,
    username,
    email,
    is_verified,
    fullname,
    bio,
    error_mes,
  } = useSelector((state) => state.user);

  if (bio == null) {
    bio = "";
  }
  if (fullname == null) {
    fullname = "";
  }

  const [loadingVerify, setloadingVerify] = useState(false);
  const [loadingSubmit, setloadingSubmit] = useState(false);
  const [profilePicture, setProfilePicture] = useState({
    ava: { url: profile_picture ? API_URL + profile_picture : cat, file: null },
    cover: { url: profile_cover ? API_URL + profile_cover : cover, file: null },
  });

  const [changed, setChanged] = useState(false);
  const [cropping, setCropping] = useState(null);

  const initialValues = {
    profile_picture: null,
    profile_cover: null,
    fullname,
    username,
    bio,
  };
  // let [selectedImage, setSelectedImage] = useState(cat);

  const modalImageCropperHandler = () => {
    setModalImageCropper(!modalImageCropper);
  };

  const validationSchema = Yup.object({
    fullname: Yup.string().max(50, "Must be 50 characters or fewer"),
    username: Yup.string()
      .min(4, "Username must be 4 to 15 characters.")
      .max(15, "Username  must be 4 to 15 characters.")
      .matches(/^[a-zA-Z0-9]+$/, "Cannot contain special characters or spaces/")
      .required("Username is required!"),
    bio: Yup.string().max(160, "Must be 160 characters or fewer"),
  });

  const onSubmit = async (values) => {
    let formData = new FormData();
    if (values.profile_picture) {
      values.profile_picture[0] = profilePicture.ava.file;
      formData.append("profile_picture", values.profile_picture[0]);
    }
    if (values.profile_cover) {
      values.profile_cover[0] = profilePicture.cover.file;
      formData.append("profile_cover", values.profile_cover[0]);
    }

    let dataInput = {
      username: values.username,
      fullname: values.fullname,
      bio: values.bio,
    };

    formData.append("data", JSON.stringify(dataInput));
    try {
      setChanged(false);
      setloadingSubmit(true);
      let token = Cookies.get("token");
      let res = await axios.patch(
        `${API_URL}/profile/profile-update`,
        formData,
        {
          headers: { authorization: token },
        }
      );

      dispatch({ type: "LOGIN", payload: res.data });
      toast.success("Updated!", {
        theme: "colored",
        position: "top-center",
        style: { backgroundColor: "#3A7D44" },
      });
    } catch (error) {
      dispatch({
        type: "ERROR",
        payload: error.response.data.message || "Network Error",
      });
    } finally {
      setloadingSubmit(false);
    }
  };

  const sendEmail = async () => {
    try {
      setloadingVerify(true);
      await axios.post(`${API_URL}/auth/email-verification`, {
        id,
        username,
        email,
      });
      dispatch({ type: "DONE" });
      toast.success("Email sent!", {
        theme: "colored",
        position: "top-center",
        style: { backgroundColor: "#3A7D44" },
      });
    } catch (error) {
      alert(error);
    } finally {
      setloadingVerify(false);
    }
  };

  const onCancel = () => {
    setCropping(null);
  };
  // useEffect(() => {
  //   dispatch({ type: "CLEARERROR" });

  //   return () => {
  //     dispatch({ type: "CLEARERROR" });
  //   };
  // }, []);
  // console.log(profilePicture.ava.url);
  return (
    <>
      {modalImageCropper && (
        <ModalImageCropper
          image={cropping}
          cropInit={cropping.crop}
          zoomInit={cropping.zoom}
          setPicture={setProfilePicture}
          picture={profilePicture}
          // resetValue={resetValue}
          onCancel={onCancel}
          // setCroppedImageFor={setCroppedImageFor}
          // resetImage={resetImage}
          modalImageCropper={modalImageCropper}
          setModalImageCropper={setModalImageCropper}
          modalImageCropperHandler={modalImageCropperHandler}
        />
      )}
      <div className="min-h-screen flex pt-20 bg-putih justify-center ">
        <div className="min-w-[600px] flex flex-col items-center shadow-lg rounded-2xl  my-5 shadow-black bg-putih py-5">
          <div className="my-3">Account Settings</div>
          <div className="my-3">
            <span
              className={`text-sm mr-5 ${
                is_verified ? `text-hijau` : `text-merah`
              }`}
            >
              {is_verified ? "Already verified!" : "Not yet verified!"}
            </span>
            {loadingVerify ? (
              <Loading className={"animate-spin h-10 w-10 ml-5"} />
            ) : (
              <button
                type="button"
                disabled={is_verified || loadingVerify}
                className="shadow-md inline-flex justify-center px-4 py-2 text-sm font-medium text-putih bg-hijau border border-transparent rounded-md
            disabled:shadow-none disabled:text-white disabled:bg-putih disabled:border-merah disabled:cursor-not-allowed
            hover:text-white hover:shadow-black focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-biru duration-500"
                onClick={() => sendEmail()}
              >
                Send Email Verification
              </button>
            )}
          </div>
          {!is_verified && (
            <div className="text-sm mr-5 text-merah">
              Please verify your account to be able to change User Details.
            </div>
          )}
          <Formik
            initialValues={initialValues}
            // isValid
            // validateOnMount
            // validateOnBlur={false}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
          >
            {(formik) => {
              const {
                handleChange,
                errors,
                touched,
                isSubmitting,
                isValid,
                values,
                dirty,
                handleBlur,
              } = formik;
              return (
                <Form className="flex flex-col items-center gap-y-3">
                  <div className="flex flex-col relative w-full items-center">
                    {/* Profile Picture */}
                    <label
                      htmlFor="profile_picture"
                      className="py-2 inline-block"
                    >
                      Profile Picture
                    </label>
                    <div className="rounded-full h-44 aspect-square  border border-merah overflow-hidden relative">
                      <img
                        src={profilePicture.ava.url}
                        alt=""
                        className="object-cover h-full"
                      />
                    </div>
                    <input
                      type="file"
                      ref={avaRef}
                      name="profile_picture"
                      accept=".gif,.jpg,.jpeg,.JPG,.JPEG,.png"
                      className="hidden"
                      // style={{ display: "none" }}
                      // className="text-center"
                      // ref={(fileInput) => (fileInput = fileInput)}
                      onClick={(event) => (event.target.value = null)}
                      onChange={(event) => {
                        console.log("event :", event.target.files[0]);
                        if (event.target.files[0]) {
                          console.log("event :", event.target.files[0]);
                          let format = event.target.files[0].name.split(".");
                          format = format[format.length - 1];
                          const reader = new FileReader();
                          reader.readAsDataURL(event.target.files[0]);
                          reader.addEventListener("load", () => {
                            setCropping({
                              type: "ava",
                              value: reader.result,
                              fileType: event.target.files[0].type,
                              format,
                            });
                            setChanged(true);
                            setModalImageCropper(true);
                          });
                          formik.setFieldValue("profile_picture", [
                            event.target.files[0],
                          ]);
                        } else {
                          setProfilePicture({
                            ...profilePicture,
                            ava: {
                              url: profile_picture
                                ? API_URL + profile_picture
                                : cat,
                              file: null,
                            },
                          });
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="shadow-md my-2 inline-flex justify-center px-4 py-2 text-sm font-medium text-putih bg-hijau border border-transparent rounded-md 
                      disabled:shadow-none disabled:text-white disabled:bg-putih disabled:border-merah disabled:cursor-not-allowed
                     hover:text-white hover:shadow-black focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-biru duration-500"
                      onClick={() => avaRef.current.click()}
                      disabled={!is_verified}
                    >
                      Change Picture
                    </button>

                    {/* Profile Cover */}
                    <label
                      htmlFor="profile_cover"
                      className="py-2 inline-block"
                    >
                      Profile Cover
                    </label>
                    <div className=" h-[300px] aspect-video border rounded-lg border-merah overflow-hidden">
                      <img
                        src={profilePicture.cover.url}
                        alt=""
                        className="object-cover w-full"
                      />
                    </div>
                    <input
                      type="file"
                      ref={coverRef}
                      className="hidden"
                      name="profile_cover"
                      accept=".gif,.jpg,.jpeg,.JPG,.JPEG,.png"
                      // style={{ display: "none" }}
                      // className="text-center"
                      // ref={(fileInput) => (fileInput = fileInput)}
                      onClick={(event) => (event.target.value = null)}
                      onChange={(event) => {
                        if (event.target.files[0]) {
                          console.log("event :", event.target.files[0]);
                          const reader = new FileReader();
                          reader.readAsDataURL(event.target.files[0]);
                          reader.addEventListener("load", () => {
                            setCropping({
                              type: "cover",
                              value: reader.result,
                            });
                            setChanged(true);
                            setModalImageCropper(true);
                          });
                          formik.setFieldValue("profile_cover", [
                            event.target.files[0],
                          ]);
                        } else {
                          setProfilePicture({
                            ...profilePicture,
                            cover: {
                              url: profile_cover
                                ? API_URL + profile_cover
                                : cat,
                              file: null,
                            },
                          });
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="shadow-md my-2 inline-flex justify-center px-4 py-2 text-sm font-medium text-putih bg-hijau border border-transparent rounded-md 
                      disabled:shadow-none disabled:text-white disabled:bg-putih disabled:border-merah disabled:cursor-not-allowed
                     hover:text-white hover:shadow-black focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-biru duration-500"
                      onClick={() => coverRef.current.click()}
                      disabled={!is_verified}
                    >
                      Change Cover
                    </button>
                  </div>
                  {/* Personal Data */}
                  <div className="flex flex-col relative w-full items-center">
                    <div className="flex justify-between w-full items-end">
                      {/* Full Name */}
                      <label htmlFor="fullname">Full Name</label>
                      <div
                        className={`${
                          errors.fullname ? "text-merah" : "text-black"
                        } text-xs`}
                      >
                        {values.fullname.length}/50
                      </div>
                    </div>
                    <input
                      name="fullname"
                      placeholder="Full Name"
                      type="text"
                      onChange={(e) => {
                        setChanged(true);
                        handleChange(e);
                      }}
                      disabled={!is_verified}
                      onBlur={handleBlur}
                      value={values.fullname}
                      className={`p-2 rounded bg-putih w-full disabled:cursor-not-allowed disabled:outline-gray-600 ${
                        errors.fullname
                          ? "outline outline-2 outline-merah"
                          : "focus:outline focus:outline-biru focus:outline-2"
                      }`}
                    />
                    {errors.fullname && dirty && values.fullname.length ? (
                      <div
                        name="fullname"
                        className="text-merah -mt-5 ml-2 text-xs absolute bg-putih px-2 -bottom-2 pointer-events-none"
                      >
                        {errors.fullname}
                      </div>
                    ) : null}
                  </div>

                  {/* Username */}
                  <div className="flex flex-col relative w-full items-center">
                    <div className="flex justify-between w-full items-end">
                      <label htmlFor="username">Username</label>
                      <div
                        className={`${
                          errors.username ? "text-merah" : "text-black"
                        } text-xs`}
                      >
                        {values.username.length}/15
                      </div>
                    </div>
                    <input
                      name="username"
                      placeholder="Username*"
                      type="text"
                      onChange={(e) => {
                        setChanged(true);
                        handleChange(e);
                      }}
                      disabled={!is_verified}
                      onBlur={handleBlur}
                      value={values.username}
                      className={`p-2 rounded bg-putih w-full disabled:cursor-not-allowed disabled:outline-gray-600 ${
                        errors.username
                          ? "outline outline-2 outline-merah"
                          : "focus:outline focus:outline-biru focus:outline-2"
                      }`}
                    />

                    {errors.username && dirty ? (
                      <div
                        name="username"
                        className="text-merah -mt-5 ml-2 text-xs absolute bg-putih px-2 -bottom-2 pointer-events-none"
                      >
                        {errors.username}
                      </div>
                    ) : null}
                    {error_mes && !errors.username && (
                      <div className="text-merah -mt-5 mx-2 text-xs absolute bottom-0">
                        {error_mes}
                      </div>
                    )}
                  </div>

                  {/* Bio */}
                  <div className="flex flex-col relative w-full items-center">
                    <div className="flex justify-between w-full items-end">
                      <label htmlFor="bio">Bio</label>
                      <div
                        className={`${
                          errors.bio && touched.bio
                            ? "text-merah"
                            : "text-black"
                        } text-xs`}
                      >
                        {values.bio.length}/160
                      </div>
                    </div>

                    <textarea
                      name="bio"
                      placeholder="Tell us about yourself"
                      type="text"
                      onChange={(e) => {
                        setChanged(true);
                        handleChange(e);
                      }}
                      cols="30"
                      rows="5"
                      disabled={!is_verified}
                      onBlur={handleBlur}
                      value={values.bio}
                      className={`p-2 rounded bg-putih w-full disabled:cursor-not-allowed disabled:outline-gray-600 ${
                        errors.bio
                          ? "outline outline-2 outline-merah"
                          : "focus:outline focus:outline-biru focus:outline-2"
                      }`}
                    />
                    {errors.bio && dirty && values.bio.length ? (
                      <div
                        name="bio"
                        className="text-merah -mt-5 ml-2 text-xs absolute bg-putih px-2 -bottom-2 pointer-events-none"
                      >
                        {errors.bio}
                      </div>
                    ) : null}
                  </div>
                  <div className="flex flex-col relative w-full items-center">
                    <div className="flex justify-between w-full items-end">
                      <label htmlFor="">Email</label>
                      <div className={`text-merah text-xs`}>
                        Email cannot be changed.
                      </div>
                    </div>
                    <input
                      type="email"
                      name=""
                      id=""
                      className="p-2 outline outline-gray-600 outline-2 rounded bg-putih w-full cursor-not-allowed"
                      value={email}
                      disabled
                    />
                  </div>
                  <div className="">
                    {loadingSubmit ? (
                      <Loading className={"animate-spin h-10 w-10 ml-5"} />
                    ) : (
                      <button
                        type="submit"
                        disabled={
                          !isValid || isSubmitting || loadingSubmit || !changed
                        }
                        className="shadow-md inline-flex justify-center px-4 py-2 text-sm font-medium text-putih bg-hijau border border-transparent rounded-md 
                    disabled:shadow-none disabled:text-white disabled:bg-putih disabled:border-merah disabled:cursor-not-allowed
                    hover:text-white hover:shadow-black focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-biru duration-500"
                      >
                        Save Changes
                      </button>
                    )}
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default AccountSettings;
