import { MinusSmIcon, PlusSmIcon } from "@heroicons/react/outline";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import API_URL from "../Helpers/apiurl";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ModalImageCropper from "../components/ModalImageCropper";
import Loading from "../components/Loading";

const EditRecipe = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const photoRef = useRef();
  const { edit } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [photoRecipe, setPhotoRecipe] = useState(null);
  const [modalImageCropper, setModalImageCropper] = useState(false);
  const [cropping, setCropping] = useState(null);

  let editTitle = data ? data.post.title : "";

  let editIngredients = data
    ? data.ingredients.map((val) => val.ingredient)
    : [""];
  let editInstructions = data
    ? data.instructions.map((val) => val.instruction)
    : [""];

  const modalImageCropperHandler = () => {
    setModalImageCropper(!modalImageCropper);
  };

  const initialValues = {
    title: editTitle,
    photo: null,
    ingredients: editIngredients,
    instructions: editInstructions,
  };
  // const editValues = {
  //   title: editTitle,
  //   photo: editPhoto,
  //   ingredients: editIngredients,
  //   instructions: editInstructions,
  // };

  const validationSchema = Yup.object({
    title: Yup.string()
      .max(50, "Recipe's name  must be 4 to 15 characters.")
      .required("Recipe's name is required!"),
    // photo: Yup.string().required("Photo is required!"),
    // ingredients: Yup.array()
    //   .min(8, "Password is too short - minimimum of 8 characters.")
    //   .required("Password is required!"),
    // passwordConfirm: Yup.string()
    //   .oneOf([Yup.ref("password"), null], "Passwords do not match.")
    //   .required("Passwords do not match."),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    let formData = new FormData();
    if (values.photo) {
      values.photo[0] = photoRecipe?.file;
      formData.append("photo", values.photo[0]);
    }

    let dataInput = {
      title: values.title,
      ingredients: values.ingredients,
      instructions: values.instructions,
      post_id: edit,
    };
    formData.append("data", JSON.stringify(dataInput));

    try {
      setLoading(true);
      let token = Cookies.get("token");
      await axios.patch(`${API_URL}/recipe/edit-recipe`, formData, {
        headers: { authorization: token },
      });
      toast.success("Post edited!", {
        theme: "colored",
        position: "top-center",
        style: { backgroundColor: "#3A7D44" },
      });
      setTimeout(() => {
        navigate("/home");
      }, 1000);
    } catch (error) {
      dispatch({
        type: "ERROR",
        payload: error.response.data.message || "Network Error",
      });
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  const getRecipe = async () => {
    try {
      setLoading(true);
      let res = await axios.get(`${API_URL}/recipe/recipe-detail`, {
        params: { post_id: edit },
      });
      setData(res.data);
      setPhotoRecipe({ url: API_URL + res.data.post.photo, file: null });
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRecipe();
    if (!edit) {
      toast.error("No post detected!", {
        theme: "colored",
        position: "top-center",
        style: { backgroundColor: "#A90409" },
      });
      setTimeout(() => {
        navigate(-1);
      }, 2000);
    }
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {modalImageCropper && (
        <ModalImageCropper
          image={cropping}
          cropInit={cropping.crop}
          zoomInit={cropping.zoom}
          setPicture={setPhotoRecipe}
          picture={photoRecipe}
          // onCancel={onCancel}
          // setCroppedImageFor={setCroppedImageFor}
          // resetImage={resetImage}
          modalImageCropper={modalImageCropper}
          setModalImageCropper={setModalImageCropper}
          modalImageCropperHandler={modalImageCropperHandler}
        />
      )}
      <div className="min-h-screen flex pt-20 bg-putih justify-center">
        <div className="shadow-lg shadow-black w-[600px]">
          <Formik
            initialValues={initialValues}
            validateOnMount
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            enableReinitialize
          >
            {(formik) => {
              return (
                <Form className="flex flex-col gap-y-5 p-5">
                  {/* Recipe's Name */}
                  <div className="flex flex-col relative">
                    <label htmlFor="title" className="text-center">
                      Recipe's Name:
                    </label>
                    <Field
                      name="title"
                      placeholder="Recipe's Name"
                      type="text"
                      className={
                        formik.errors.title && formik.touched.title
                          ? "p-2 outline outline-merah outline-2 rounded bg-putih"
                          : "p-2 focus:outline focus:outline-biru focus:outline-2 rounded bg-putih"
                      }
                    />
                    <ErrorMessage
                      component="div"
                      name="title"
                      className="text-merah -mt-5 ml-2 text-xs absolute bottom-0"
                    />
                  </div>
                  {/* Upload photo */}
                  <div className="flex flex-col relative">
                    <label
                      htmlFor="photo"
                      className="py-2 inline-block text-center"
                    >
                      Recipe Photo
                    </label>
                    <div className=" h-[300px] aspect-video border rounded-lg border-merah overflow-hidden">
                      <img
                        src={photoRecipe?.url}
                        alt=""
                        className="object-cover w-full"
                      />
                    </div>
                    <input
                      type="file"
                      ref={photoRef}
                      className="hidden"
                      name="photo"
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
                              type: "photo",
                              value: reader.result,
                            });
                            // setChanged(true);
                            setModalImageCropper(true);
                          });
                          formik.setFieldValue("photo", [
                            event.target.files[0],
                          ]);
                        } else {
                          setPhotoRecipe({
                            url: null,
                            file: null,
                          });
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="shadow-md my-2 inline-flex justify-center px-4 py-2 text-sm font-medium text-putih bg-hijau border border-transparent rounded-md 
                    hover:text-white hover:shadow-black focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-biru duration-500"
                      onClick={() => photoRef.current.click()}
                    >
                      Add Photo
                    </button>
                  </div>
                  {/* Ingredients' list */}
                  <div className="flex flex-col relative">
                    <label htmlFor="ingredients" className="text-center">
                      Ingredients:
                    </label>
                    <FieldArray name="ingredients">
                      {(ingredientsProps) => {
                        const { push, remove, form } = ingredientsProps;
                        const { values } = form;
                        const { ingredients } = values;
                        return (
                          <ul>
                            {ingredients.map((ingredient, index) => {
                              return (
                                <li
                                  key={index}
                                  className="w-full flex flex-wrap items-center  mb-1"
                                >
                                  <Field
                                    autoFocus={index > 0 ? true : false}
                                    as="textarea"
                                    name={`ingredients[${index}]`}
                                    placeholder={`Ingredients No. ${index + 1}`}
                                    type="text"
                                    className={`p-2 w-[90%] rounded bg-putih ${
                                      formik.errors.recipeName &&
                                      formik.touched.recipeName
                                        ? " outline outline-merah outline-2 "
                                        : " focus:outline focus:outline-biru focus:outline-2  focus:bg-white"
                                    }`}
                                  />
                                  <div className="w-[10%] flex gap-2 justify-center items-center">
                                    <button
                                      type="button"
                                      disabled={
                                        ingredients.length > 1 ? false : true
                                      }
                                      onClick={() => remove(index)}
                                      className="w-8 h-8 rounded-full bg-kuning border border-transparent duration-500 shadow-md hover:shadow-black 
                                    disabled:shadow-none disabled:bg-putih disabled:border-merah disabled:text-white disabled:cursor-not-allowed"
                                    >
                                      <MinusSmIcon className="scale-50" />
                                    </button>
                                  </div>
                                  <div className="w-full flex justify-center">
                                    <button
                                      disabled={
                                        index === ingredients.length - 1
                                          ? false
                                          : true
                                      }
                                      type="button"
                                      className="w-8 h-8 rounded-full bg-hijau border border-transparent shadow-md hover:shadow-black disabled:hidden my-2 duration-500"
                                      onClick={() => push("")}
                                    >
                                      <PlusSmIcon className="scale-50" />
                                    </button>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        );
                      }}
                    </FieldArray>
                  </div>
                  {/* Instructions' list */}
                  <div className="flex flex-col relative">
                    <label htmlFor="instructions" className="text-center">
                      Instructions (max. 10 instructions):
                    </label>
                    <FieldArray name="instructions">
                      {(instructionsProps) => {
                        const { push, remove, form } = instructionsProps;
                        const { values } = form;
                        const { instructions } = values;
                        return (
                          <ul>
                            {instructions.map((ingredient, index) => {
                              // const [buttonDisable, setButtonDisable] =
                              //   useState(false);
                              return (
                                <li
                                  key={index}
                                  className="w-full flex flex-wrap items-center relative mb-1"
                                >
                                  <span className="w-[10%] flex items-center justify-center">
                                    {index + 1}.
                                  </span>
                                  <Field
                                    autoFocus={index > 0 ? true : false}
                                    as="textarea"
                                    name={`instructions[${index}]`}
                                    placeholder="Instruction"
                                    type="text"
                                    className={`p-2 w-[80%] rounded bg-putih ${
                                      formik.errors.recipeName &&
                                      formik.touched.recipeName
                                        ? "outline outline-merah outline-2"
                                        : "focus:outline focus:outline-biru focus:outline-2 focus:bg-white"
                                    }`}
                                  />
                                  <div className="w-[10%] flex gap-2 justify-center items-center">
                                    <button
                                      type="button"
                                      disabled={
                                        instructions.length > 1 ? false : true
                                      }
                                      onClick={() => remove(index)}
                                      className="w-8 h-8 rounded-full bg-kuning border border-transparent duration-500 shadow-md hover:shadow-black 
                                    disabled:shadow-none disabled:bg-putih disabled:border-merah disabled:text-white disabled:cursor-not-allowed"
                                    >
                                      <MinusSmIcon className="scale-50" />
                                    </button>
                                  </div>
                                  <div className="w-full flex justify-center">
                                    <button
                                      disabled={
                                        index === instructions.length - 1 &&
                                        instructions.length <= 9
                                          ? false
                                          : true
                                      }
                                      type="button"
                                      className="w-8 h-8 rounded-full bg-hijau border border-transparent shadow-md hover:shadow-black disabled:hidden my-2 duration-500"
                                      onClick={() => push("")}
                                    >
                                      <PlusSmIcon className="scale-50" />
                                    </button>
                                    {index === 9 ? (
                                      <div className="text-xs text-merah my-2">
                                        The allowed maximum amount of steps
                                        currently only 10 steps.
                                      </div>
                                    ) : null}
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        );
                      }}
                    </FieldArray>
                  </div>
                  {loading ? (
                    <Loading className={"animate-spin h-10 w-10 ml-5"} />
                  ) : (
                    <button
                      type="submit"
                      disabled={
                        !formik.isValid || formik.isSubmitting || loading
                      }
                      className={`m-auto mt-3 justify-center px-4 py-2 text-sm font-medium border rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 
                  focus-visible:ring-biru duration-500
                  shadow-md hover:shadow-black text-white bg-hijau border-transparent 
                  disabled:bg-putih disabled:shadow-none disabled:border-merah disabled:text-white disabled:cursor-not-allowed
                }`}
                    >
                      Edit Your Recipe
                    </button>
                  )}
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </>
  );
};

export default EditRecipe;
