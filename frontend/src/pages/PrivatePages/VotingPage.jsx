import React, { useEffect, useRef, useState } from 'react'
import VoteCard from '../../components/VoteCard'
import Header from '../../components/Header'
import { useDispatch, useSelector } from 'react-redux'
import { candidateFetch } from '../../redux/candidates/candidateSlice'
import Capture from '../../components/Capture'
import { CALL_STATUS } from '../../Status'
import axios from 'axios'

const VotingPage = ({socket}) => {
  const {candidates, fetchError, fetchStatus } = useSelector( state => state.candidates);
  const dispatch = useDispatch();
  const [showCapture, setShowCapture] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(CALL_STATUS.IDLE);
  const [uploadError, setUploadError] = useState(null);
  const imageRef = useRef();
  useEffect(() => {
    dispatch(candidateFetch());
  }, [dispatch]);
  
  const handleUpload = async (e) => {
    e.preventDefault();
    setUploadStatus(CALL_STATUS.LOADING);
    try {
      const res = await axios.post("/vote/validate", {
        image: imageRef.current,
      });

      setUploadStatus(CALL_STATUS.SUCCESS)
    } catch (error) {
      console.log(error);
      setUploadError(error.response.data.message || error.message);
      setUploadStatus(CALL_STATUS.ERROR);
    }
  };

 
  return (
    <>
      <Header />
      <main className="w-full">
        {showCapture ? (
          <Capture
            socket={socket}
            handler={handleUpload}
            imageRef={imageRef}
            uploadStatus={uploadStatus}
            uploadError={uploadError}
          />
        ) : (
          <>
            <h1 className="text-2xl text-gray-900 mt-5 text-center">
              Kindly cast your vote for your preferred candidate.
            </h1>
            <div className="mt-5 p-5 flex gap-4 justify-center">
              {candidates &&
                candidates.map((candidate) => (
                  <VoteCard
                    key={candidate._id}
                    data={candidate}
                    setShowCapture={setShowCapture}
                  />
                ))}
            </div>
          </>
        )}
      </main>
    </>
  );
}

export default VotingPage