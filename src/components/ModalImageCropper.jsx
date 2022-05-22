import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import React, { Fragment, useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "../Helpers/cropImage.js";

function ModalImageCropper({
  resetValue,
  image,
  cropInit,
  zoomInit,
  picture,
  setPicture,
  modalImageCropper,
  onCancel,
  setModalImageCropper,
  modalImageCropperHandler,
}) {
  const [zoom, setZoom] = useState(1);
  const [objectFit, setObjectFit] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [aspect, setAspect] = useState(0);
  const [shape, setShape] = useState("");
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    if (image.type === "ava") {
      setObjectFit("vertical-cover");
      setAspect(1);
      setShape("round");
    } else {
      setObjectFit("horizontal-cover");
      setAspect(16 / 9);
      setShape("rect");
    }
  }, []);

  const onCropChange = (crop) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom) => {
    setZoom(zoom);
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const onCrop = async () => {
    const { url, file } = await getCroppedImg(image.value, croppedAreaPixels);
    var newFile = new File([file], "image.jpeg", { type: "image/jpeg" });
    console.log("URL:", url);
    console.log(file);
    console.log(newFile);
    if (image.type === "ava") {
      setPicture({ ...picture, ava: { file: newFile, url } });
    } else if (image.type === "cover") {
      setPicture({ ...picture, cover: { file: newFile, url } });
    } else {
      setPicture({ file: newFile, url });
    }
  };

  return (
    <>
      <Transition appear show={modalImageCropper} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto bg-black/50"
          onClose={() => {
            // if (image.type === "ava") {
            //   setPicture({ ...picture, ava: null });
            // } else if (image.type === "cover") {
            //   setPicture({ ...picture, ava: null });
            // } else {
            //   setPicture(null);
            // }
            onCrop();
            modalImageCropperHandler();
          }}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0" />
            </Transition.Child>
            <span
              className="inline-block h-screen align-middle"
              aria-hidden="true"
            >
              &#8203;
            </span>
            {/* <Transition.Child
              as="div"
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            > */}
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-putih shadow-2xl rounded-2xl">
              <Dialog.Title
                as="div"
                className="relative text-lg font-medium leading-6 text-putih bg-merah rounded text-center mb-5 -mt-7 -mx-10"
              >
                <h1 className="h-20 w-100 flex justify-center items-center text-xl">
                  Edit image
                </h1>
              </Dialog.Title>
              <div className="border border-merah h-64 relative">
                <Cropper
                  cropShape={shape}
                  image={image.value}
                  zoom={zoom}
                  crop={crop}
                  aspect={aspect}
                  onCropChange={onCropChange}
                  onZoomChange={onZoomChange}
                  onCropComplete={onCropComplete}
                  objectFit={objectFit}
                />
              </div>
              <div className="flex items-center flex-col">
                <div className="w-full flex justify-center py-2">
                  <input
                    type="range"
                    min={1}
                    max={3}
                    step={0.1}
                    value={zoom}
                    onInput={(e) => {
                      onZoomChange(e.target.value);
                    }}
                    className="w-3/4"
                  ></input>
                </div>
                <div className="button-area">
                  <button
                    type="button"
                    className="hover:text-white shadow-md hover:shadow-black inline-flex justify-center px-4 py-2 text-sm font-medium text-putih bg-hijau border border-transparent rounded-md  focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-biru duration-500"
                    onClick={() => {
                      onCrop();
                      modalImageCropperHandler();
                    }}
                  >
                    Crop
                  </button>
                </div>
              </div>
            </div>
            {/* </Transition.Child> */}
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export default ModalImageCropper;
