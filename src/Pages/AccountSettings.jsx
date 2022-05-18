import cat from "../Assets/cat.jpg";
import cover from "../Assets/cover.jpg";
import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import API_URL from "../Helpers/apiurl";
import Cookies from "js-cookie";

const AccountSettings = () => {
  const dispatch = useDispatch();
  let {
    profile_picture,
    profile_cover,
    id,
    username,
    email,
    is_verified,
    fullname,
    bio,
    loading,
    error_mes,
  } = useSelector((state) => state.user);

  if (bio == null) {
    bio = "";
  }
  if (fullname == null) {
    fullname = "";
  }

  const [profilePicture, setProfilePicture] = useState(
    profile_picture ? API_URL + profile_picture : cat
  );
  const [profileCover, setProfileCover] = useState(
    profile_cover ? API_URL + profile_cover : cover
  );

  const initialValues = {
    profile_picture: null,
    profile_cover: null,
    fullname,
    username,
    bio,
  };
  // let [selectedImage, setSelectedImage] = useState(cat);

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
      formData.append("profile_picture", values.profile_picture[0]);
    }
    if (values.profile_cover) {
      formData.append("profile_cover", values.profile_cover[0]);
    }

    let dataInput = {
      username: values.username,
      fullname: values.fullname,
      bio: values.bio,
    };

    formData.append("data", JSON.stringify(dataInput));
    try {
      dispatch({ type: "LOADING" });
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
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      dispatch({
        type: "ERROR",
        payload: error.response.data.message || "Network Error",
      });
    } finally {
      dispatch({ type: "DONE" });
    }
  };

  const sendEmail = async () => {
    try {
      dispatch({ type: "LOADING" });
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
    }
  };

  // useEffect(() => {
  //   dispatch({ type: "CLEARERROR" });

  //   return () => {
  //     dispatch({ type: "CLEARERROR" });
  //   };
  // }, []);

  return (
    <div className="min-h-screen flex pt-20 bg-putih justify-center ">
      <div className="min-w-[600px] flex flex-col items-center shadow-lg shadow-black bg-putih pb-5">
        <div className="my-3">Account Settings</div>
        <div className="my-3">
          <span
            className={`text-sm mr-5 ${
              is_verified ? `text-hijau` : `text-merah`
            }`}
          >
            {is_verified ? "Already verified!" : "Not yet verified!"}
          </span>
          <button
            type="button"
            disabled={is_verified || loading}
            className="shadow-md inline-flex justify-center px-4 py-2 text-sm font-medium text-putih bg-hijau border border-transparent rounded-md
            disabled:shadow-none disabled:text-white disabled:bg-putih disabled:border-merah disabled:cursor-not-allowed
            hover:text-white hover:shadow-black focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-biru duration-500"
            onClick={() => sendEmail()}
          >
            Send Email Verification
          </button>
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
            return (
              <Form className="flex flex-col items-center gap-y-3">
                <div className="flex flex-col relative w-full items-center">
                  <div className="rounded-full h-44 w-44  border-2 border-black overflow-hidden">
                    <img src={profilePicture} alt="" />
                  </div>
                  <input
                    type="file"
                    disabled={!is_verified}
                    className="disabled:cursor-not-allowed"
                    name="profile_picture"
                    accept=".gif,.jpg,.jpeg,.JPG,.JPEG,.png"
                    // style={{ display: "none" }}
                    // className="text-center"
                    // ref={(fileInput) => (fileInput = fileInput)}
                    onChange={(event) => {
                      if (event.target.files[0]) {
                        setProfilePicture(
                          URL.createObjectURL(event.target.files[0])
                        );
                        formik.setFieldValue("profile_picture", [
                          event.target.files[0],
                        ]);
                      } else {
                        setProfilePicture(cat);
                      }
                    }}
                  />
                  <div className="rounded-full h-[200px]  w-[500px] border-2 border-black overflow-hidden">
                    <img src={profileCover} alt="" />
                  </div>
                  <input
                    type="file"
                    disabled={!is_verified}
                    className="disabled:cursor-not-allowed"
                    name="profile_cover"
                    accept=".gif,.jpg,.jpeg,.JPG,.JPEG,.png"
                    // style={{ display: "none" }}
                    // className="text-center"
                    // ref={(fileInput) => (fileInput = fileInput)}
                    onChange={(event) => {
                      if (event.target.files[0]) {
                        setProfileCover(
                          URL.createObjectURL(event.target.files[0])
                        );
                        formik.setFieldValue("profile_cover", [
                          event.target.files[0],
                        ]);
                      } else {
                        setProfileCover(cat);
                      }
                    }}
                  />
                  {/* <button onClick={() => fileInput.click()}>Pick File</button> */}
                  {/* <button
                    type="submit"
                    disabled={
                      !formik.dirty ||
                      !formik.isValid ||
                      formik.isSubmitting ||
                      loading
                    }
                    className="shadow-md inline-flex justify-center px-4 py-2 text-sm font-medium text-putih bg-hijau border border-transparent rounded-md 
                               disabled:shadow-none disabled:text-white disabled:bg-putih disabled:border-merah disabled:cursor-not-allowed
                              hover:text-white hover:shadow-black focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-biru duration-500"
                    onClick={(e) => {
                      e.preventDefault();
                      onSubmitPhoto();
                    }}
                  >
                    Save Changes
                  </button> */}
                </div>
                <div className="flex flex-col relative w-full items-center">
                  <label htmlFor="fullname">
                    Name{formik.values.fullname.length}
                  </label>
                  <Field
                    name="fullname"
                    placeholder="Add your name"
                    type="text"
                    disabled={!is_verified}
                    className={`p-2 rounded bg-putih w-full disabled:cursor-not-allowed disabled:outline-gray-600 focus:bg-white ${
                      formik.errors.fullname && formik.touched.fullname
                        ? "outline outline-2 outline-merah"
                        : "focus:outline focus:outline-biru focus:outline-2"
                    }`}
                  />
                  <ErrorMessage
                    component="div"
                    name="fullname"
                    className="text-merah -mt-5 mx-2 text-xs absolute bg-putih px-2 -bottom-2 pointer-events-none"
                  />
                </div>

                {/* Username */}
                <div className="flex flex-col relative w-full items-center">
                  <label htmlFor="username">Username</label>
                  <Field
                    name="username"
                    placeholder="Username*"
                    type="text"
                    disabled={!is_verified}
                    className={`p-2 rounded bg-putih w-full disabled:cursor-not-allowed disabled:outline-gray-600 focus:bg-white ${
                      formik.errors.username && formik.touched.username
                        ? "outline outline-2 outline-merah"
                        : "focus:outline focus:outline-biru focus:outline-2"
                    }`}
                  />
                  <ErrorMessage
                    component="div"
                    name="username"
                    className="text-merah -mt-5 mx-2 text-xs absolute bottom-0  pointer-events-none"
                  />
                  {error_mes &&
                    !(formik.errors.username && formik.touched.username) && (
                      <div className="text-merah -mt-5 mx-2 text-xs absolute bottom-0">
                        {error_mes}
                      </div>
                    )}
                </div>

                {/* Bio */}
                <div className="flex flex-col relative w-full items-center">
                  <label htmlFor="bio">Bio</label>
                  <Field
                    as="textarea"
                    name="bio"
                    placeholder="Tell us about yourself"
                    disabled={!is_verified}
                    type="text"
                    cols="30"
                    rows="10"
                    className={`p-2 rounded bg-putih w-full disabled:cursor-not-allowed disabled:outline-gray-600 focus:bg-white ${
                      formik.errors.bio && formik.touched.bio
                        ? "outline outline-2 outline-merah"
                        : "focus:outline focus:outline-biru focus:outline-2"
                    }`}
                  />
                  <ErrorMessage
                    component="div"
                    name="bio"
                    className="text-merah -mt-5 mx-10 text-xs absolute bg-putih px-2 -bottom-2 pointer-events-none"
                  />
                  {/* <textarea name="" id="" cols="30" rows="10"></textarea> */}
                </div>
                <div className="flex flex-col relative w-full items-center">
                  <div className="">Email</div>
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
                  <button
                    type="submit"
                    disabled={
                      !formik.dirty ||
                      !formik.isValid ||
                      formik.isSubmitting ||
                      loading
                    }
                    className="shadow-md inline-flex justify-center px-4 py-2 text-sm font-medium text-putih bg-hijau border border-transparent rounded-md 
                               disabled:shadow-none disabled:text-white disabled:bg-putih disabled:border-merah disabled:cursor-not-allowed
                              hover:text-white hover:shadow-black focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-biru duration-500"
                    onClick={() => {}}
                  >
                    Save Changes
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default AccountSettings;
