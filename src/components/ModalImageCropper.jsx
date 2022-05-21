import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import React, { Fragment, useEffect, useState } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "../Helpers/cropImage.js";

function ModalImageCropper({
  image,
  cropInit,
  zoomInit,
  picture,
  setPicture,
  modalImageCropper,
  setModalImageCropper,
  modalImageCropperHandler,
}) {
  console.log(image);
  const [zoom, setZoom] = useState(1);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [aspect, setAspect] = useState(0);
  const [shape, setShape] = useState("");
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    if (image.type === "ava") {
      setAspect(1 / 1);
      setShape("round");
    } else {
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
    const { file, url } = await getCroppedImg(image.value, croppedAreaPixels);
    var newFile = new File([file], "jpeg", { type: "image/jpeg" });
    console.log(newFile, url);
    if (image.type === "ava") {
      setPicture({ ...picture, ava: { url, file: newFile } });
    } else if (image.type === "cover") {
      setPicture({ ...picture, cover: { url, file: newFile } });
    } else {
      setPicture({ url, file: newFile });
    }
  };

  const onResetImage = () => {
    // resetImage(id);
  };
  return (
    <>
      <Transition appear show={modalImageCropper} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto bg-black/50"
          onClose={() => {
            if (image.type === "ava") {
              setPicture({ ...picture, ava: null });
            } else if (image.type === "cover") {
              setPicture({ ...picture, ava: null });
            } else {
              setPicture(null);
            }
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
                <XIcon
                  className="h-5 w-5 absolute top-1/2 right-8 -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:text-white text-white/50 duration-500 border-2 border-white/30 rounded-full hover:bg-white/30 hover:border-transparent"
                  onClick={() => modalImageCropperHandler()}
                />
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
                    onClick={
                      () => {}
                      //   onCancel
                    }
                  >
                    Cancel
                  </button>
                  <button onClick={onResetImage}>Reset</button>
                  <button onClick={onCrop}>Crop</button>
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
