
import React, { useRef, useState } from "react";
import Camera from "react-html5-camera-photo";
import "react-html5-camera-photo/build/css/index.css";
import Header from "../../components/Header";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { CALL_STATUS } from "../../Status";

const CapturePage = () => {
  const imageRef = useRef("");
  const [capture, setCapture] = useState(false)
  const {email} = useParams();
  const [status, setStatus] = useState(CALL_STATUS.IDLE);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  function handleTakePhotoAnimationDone(dataUri) {
    imageRef.current = dataUri;
    setCapture(true);
  }

  const handleUpload = async (e) => {
    e.preventDefault();
    setStatus(CALL_STATUS.LOADING)
    try {
        const res = await axios.post('/auth/addPicture', {image: imageRef.current, email});

        if (res?.data.activation === "Next") {
          setStatus(CALL_STATUS.SUCCESS);
        }
    } catch (error) {
        console.log(error);
        setError(error.response.data.message || error.message);
        setStatus(CALL_STATUS.ERROR);
    }
  }

 

  const statusObj = {
    isLoading : status === CALL_STATUS.LOADING,
    isSuccess : status === CALL_STATUS.SUCCESS,
    isError : status === CALL_STATUS.ERROR,
  }

  if(statusObj.isSuccess){
    navigate(`/activation/${email}`);
  }
  
  const isFullscreen = false;
  return (
    <>
      <Header />
      <main className="w-full md:max-w-[600px] mx-auto mt-5">
        <h1 className="text-2xl text-gray-900 mb-5 text-center">
          Capture your profile picture
        </h1>
        {capture ? (
          <>
            {statusObj.isError && <p className="text-red-700 text-xl mb-4">{error}</p>}
            <div>
              <img src={imageRef.current} />
            </div>
            <button
              className="bg-green-700 text-white w-full mt-4 p-4 rounded-md text-xl hover:bg-green-600"
              onClick={handleUpload}
            >
              {statusObj.isLoading ? "Uploading..." : "Upload" }
            </button>
            <button
              className="bg-gray-700 text-white w-full mt-4 p-4 rounded-md text-xl hover:bg-gray-500"
              onClick={(e) => setCapture(!capture)}
            >
              Capture
            </button>
          </>
        ) : (
          <Camera
            onTakePhotoAnimationDone={handleTakePhotoAnimationDone}
            isFullscreen={isFullscreen}
          />
        )}
      </main>
    </>
  );
};

export default CapturePage