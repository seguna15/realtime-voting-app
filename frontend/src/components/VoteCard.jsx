import React, { useState } from 'react';
import axios from 'axios';
import { CALL_STATUS } from '../Status';
import { toast } from 'react-toastify';

const VoteCard = ({ data, setShowCapture }) => {
  const [status, setStatus] = useState(CALL_STATUS.IDLE);
  const [error, setError] = useState(null);
  

  const handleVote = async (e, candidateId) => {
    e.preventDefault();
    setStatus(CALL_STATUS.LOADING);
    try {
      const res = await axios.post(
        "/vote",
        { candidateId },
        { withCredentials: true }
      );
      if (res.data.status === "pending") {
        setStatus(CALL_STATUS.SUCCESS);
        
      }
    } catch (error) {
      console.log(error.response.data.message);
      setError(error.response.data.message);
      setStatus(CALL_STATUS.ERROR);
    }
  };

  const isError = status === CALL_STATUS.ERROR;
  const isSuccess = status === CALL_STATUS.SUCCESS;

  if (isError) {
    toast.error(error, {
      position: "top-center",
    });
  }

  if (isSuccess) {
    setShowCapture(true);
  }

  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow">
      <div className="flex flex-col items-center py-4 ">
        <h2 className="mb-1 text-xl font-medium text-gray-900 ">
          {data.politicalParty}
        </h2>
        <span className="text-sm text-gray-500 ">{data.candidateName}</span>
        <div className="flex mt-4 space-x-3 md:mt-6">
          <button
            onClick={(e) => handleVote(e, data._id)}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
          >
            Vote
          </button>
        </div>
      </div>
    </div>
  );
};

export default VoteCard