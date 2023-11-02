import React, { useRef, useState } from "react";
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import { CALL_STATUS } from "../Status";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const Capture = ({socket, handler, imageRef, uploadStatus, uploadError}) => {
  
  const [capture, setCapture] = useState(false);
  const navigate = useNavigate();

  function handleTakePhotoAnimationDone(dataUri) {
    imageRef.current = dataUri;
    setCapture(!capture);
  }

  const isLoading = uploadStatus === CALL_STATUS.LOADING;
  const isSuccess = uploadStatus === CALL_STATUS.SUCCESS;
  const isError = uploadStatus === CALL_STATUS.ERROR;

  if(isSuccess){
     socket.emit("sendVote", { data: 1 }); 
     toast.success('Vote cast successfully', {
      position: "top-center"
     })
     navigate('/')
  }
  
  const isFullscreen = false;
  return (
    <>
      <h1 className="text-2xl text-gray-900 mt-5 text-center">
        Capture your profile picture
      </h1>
      {isError && <p className="text-red-600 my-4 text-xl text-center">{uploadError}</p>}

      {capture ? (
        <div className="w-full md:w-[600px] mx-auto my-5 flex flex-col justify-center items-center">
          <div>
            <img src={imageRef.current} />
          </div>
          <button
            className="bg-green-700 text-white w-full mt-4 p-4 rounded-md text-xl hover:bg-green-600"
            onClick={handler}
          >
            {isLoading ? "Uploading..." : "Upload"}
          </button>
          {isLoading ? null : (
            <button
              className="bg-gray-700 text-white w-full mt-4 p-4 rounded-md text-xl hover:bg-gray-500"
              onClick={(e) => setCapture(!capture)}
            >
              Capture
            </button>
          )}
        </div>
      ) : (
        <Camera
          onTakePhotoAnimationDone={handleTakePhotoAnimationDone}
          isFullscreen={isFullscreen}
        />
      )}
    </>
  );
};

export default Capture;
