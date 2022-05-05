import { MinusIcon, MinusSmIcon, PlusSmIcon } from "@heroicons/react/outline";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useCallback, useEffect, useState } from "react";
import * as Yup from "yup";
import Cropper from "react-easy-crop";

const NewRecipe = () => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    // console.log(croppedArea, croppedAreaPixels);
  }, []);
  const initialValues = {
    recipeName: "",
    photo: "",
    ingredients: [""],
    instructions: [""],
  };
  const validationSchema = Yup.object({
    recipeName: Yup.string()
      .max(50, "Recipe's name  must be 4 to 15 characters.")
      .required("Recipe's name is required!"),
    // email: Yup.string()
    //   .email("Invalid email address.")
    //   .required("Email is required!"),
    // ingredients: Yup.array()
    //   .min(8, "Password is too short - minimimum of 8 characters.")
    //   .required("Password is required!"),
    // passwordConfirm: Yup.string()
    //   .oneOf([Yup.ref("password"), null], "Passwords do not match.")
    //   .required("Passwords do not match."),
  });
  const onSubmit = (values, { setSubmitting }) => {
    setTimeout(() => {
      console.log(JSON.stringify(values, null, 2));

      setSubmitting(false);
    }, 400);
  };

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
        >
          {(formik) => {
            return (
              <Form className="flex flex-col gap-y-5 p-5">
                {/* Recipe's Name */}
                <div className="flex flex-col relative">
                  <label htmlFor="recipeName" className="text-center">
                    Recipe's Name:
                  </label>
                  <Field
                    name="recipeName"
                    placeholder="Recipe's Name"
                    type="text"
                    className={
                      formik.errors.recipeName && formik.touched.recipeName
                        ? "p-2 outline outline-merah outline-2 rounded bg-putih"
                        : "p-2 focus:outline focus:outline-biru focus:outline-2 rounded bg-putih"
                    }
                  />
                  <ErrorMessage
                    component="div"
                    name="recipeName"
                    className="text-merah -mt-5 ml-2 text-xs absolute bottom-0"
                  />
                </div>
                {/* Upload photo */}
                <div className="flex flex-col relative">
                  <div className="border-2 border-black w-100 h-72">Photo</div>
                  {/* <div className="border-2 border-black w-100 mb-5">
                    Upload Photo
                  </div> */}
                  <input type="file" accept="image/*" onChange={() => {}} />
                  <div className="absolute top-0 left-0 right-0 bottom-20 w-1/2">
                    <Cropper
                      image="https://img.huffingtonpost.com/asset/5ab4d4ac2000007d06eb2c56.jpeg?cache=sih0jwle4e&ops=1910_1000"
                      crop={crop}
                      zoom={zoom}
                      aspect={1}
                      onCropChange={setCrop}
                      onCropComplete={onCropComplete}
                      onZoomChange={setZoom}
                      cropShape={"round"}
                    />
                  </div>
                  <div className="absolute bottom-5 left-1/2 w-1/2 -translate-x-1/2 h-10 flex items-center">
                    <input
                      type="range"
                      value={zoom}
                      min={1}
                      max={3}
                      step={0.1}
                      aria-labelledby="Zoom"
                      onChange={(e) => {
                        setZoom(e.target.value);
                      }}
                      className="w-full bg-merah"
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
                  disabled={!formik.isValid || formik.isSubmitting}
                  className={`m-auto mt-3 justify-center px-4 py-2 text-sm font-medium border rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 
                          focus-visible:ring-biru duration-500
                        shadow-md hover:shadow-black text-white bg-hijau border-transparent 
                        disabled:bg-putih disabled:shadow-none disabled:border-merah disabled:text-white disabled:cursor-not-allowed
                        }`}
                  onClick={() => {
                    // props.modalSignUpHandler();
                    // passVisHandler();
                    console.log(formik.isSubmitting);
                    // navigate("/VerifyAccount");
                  }}
                >
                  Submit Your Recipe
                </button>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

export default NewRecipe;
