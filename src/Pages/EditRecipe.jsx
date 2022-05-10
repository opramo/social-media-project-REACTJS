import { MinusIcon, MinusSmIcon, PlusSmIcon } from "@heroicons/react/outline";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useCallback, useEffect, useState } from "react";
import * as Yup from "yup";
import Cropper from "react-easy-crop";
import { useDispatch, useSelector } from "react-redux";
import { editRecipe, postRecipe } from "../Redux/Actions/userActions";
import axios from "axios";
import API_URL from "../Helpers/apiurl";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const EditRecipe = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, edit } = useSelector((state) => state.user);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [data, setData] = useState(null);
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    // console.log(croppedArea, croppedAreaPixels);
  }, []);
  const [photoRecipe, setPhotoRecipe] = useState(null);

  let editTitle = data ? data.post.title : "";
  console.log(`benerin fotonya ngab`);

  let editIngredients = data
    ? data.ingredients.map((val) => val.ingredient)
    : [""];
  let editInstructions = data
    ? data.instructions.map((val) => val.instruction)
    : [""];

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
    console.log("onSubmitvalues :", values);
    let formData = new FormData();
    if (values.photo) {
      formData.append("photo", values.photo[0]);
    } else {
      formData.append("photo", 0);
    }
    console.log("values.title:", values.title);
    console.log("values.ingredients :", values.ingredients);
    console.log("values.instructions :", values.instructions);
    let dataInput = {
      title: values.title,
      ingredients: values.ingredients,
      instructions: values.instructions,
      post_id: edit,
    };
    console.log(dataInput);
    formData.append("data", JSON.stringify(dataInput));
    try {
      dispatch({ type: "LOADING" });
      let token = Cookies.get("token");
      let res = await axios.patch(`${API_URL}/recipe/edit-recipe`, formData, {
        headers: { authorization: token },
      });
      dispatch({ type: "LOGIN", payload: res.data });
      toast.success("Post edited!", {
        theme: "colored",
        position: "top-center",
      });
      setTimeout(() => {
        navigate("/home");
      }, 3000);
    } catch (error) {
      dispatch({
        type: "ERROR",
        payload: error.response.data.message || "Network Error",
      });
    } finally {
      dispatch({ type: "DONE" });
    }
    setSubmitting(false);
  };

  const getRecipe = async () => {
    try {
      dispatch({ type: "LOADING" });
      let res = await axios.post(`${API_URL}/recipe/recipe-detail`, {
        post_id: edit,
      });
      setData(res.data);
      setPhotoRecipe(`${API_URL}${res.data.post.photo}`);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRecipe();
  }, []);

  useEffect(() => {
    if (loading) {
      dispatch({ type: "NOEDIT" });
    }
    dispatch({ type: "DONE" });
  }, [loading]);

  return (
    <div className="min-h-screen flex pt-20 bg-putih justify-center">
      <div className="shadow-lg shadow-black w-[600px]">
        <Formik
          initialValues={initialValues}
          // isValid
          validateOnMount
          // validateOnBlur={false}
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
                  <div className="border-2 border-black w-100 h-72 overflow-hidden content-center">
                    <img src={photoRecipe} alt="" />
                  </div>
                  {/* <div className="border-2 border-black w-100 mb-5">
                    Upload Photo
                  </div> */}
                  <div className="flex justify-center items-center">
                    <input
                      type="file"
                      name="photo"
                      accept=".gif,.jpg,.jpeg,.JPG,.JPEG,.png"
                      // style={{ display: "none" }}
                      className="w-60"
                      // ref={(fileInput) => (fileInput = fileInput)}
                      onChange={(event) => {
                        if (event.target.files[0]) {
                          setPhotoRecipe(
                            URL.createObjectURL(event.target.files[0])
                          );
                          formik.setFieldValue("photo", [
                            event.target.files[0],
                          ]);
                        }
                        // console.log(event.target.files[0]);
                      }}
                    />
                    <ErrorMessage
                      component="div"
                      name="photo"
                      className="text-merah -mt-5 ml-2 text-xs absolute bottom-0"
                    />
                  </div>
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
                <button
                  type="submit"
                  disabled={!formik.isValid || formik.isSubmitting || loading}
                  className={`m-auto mt-3 justify-center px-4 py-2 text-sm font-medium border rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 
                          focus-visible:ring-biru duration-500
                        shadow-md hover:shadow-black text-white bg-hijau border-transparent 
                        disabled:bg-putih disabled:shadow-none disabled:border-merah disabled:text-white disabled:cursor-not-allowed
                        }`}
                >
                  Edit Your Recipe
                </button>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default EditRecipe;
