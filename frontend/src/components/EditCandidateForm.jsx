import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { candidateUpdate, setVisible } from "../redux/candidates/candidateSlice";
import { CALL_STATUS } from "../Status";

const EditCandidateForm = ({
  candidateName,
  setCandidateName,
  politicalParty,
  setPoliticalParty,
  id,
}) => {
  const {  updateStatus, updateError } = useSelector((state) => state.candidates);
  
  const dispatch = useDispatch();

  const removeVisibility = (e) => {
    e.preventDefault;
    dispatch(setVisible(false));
  };

  const editCandidate = async (e) => {
    e.preventDefault()
    dispatch(candidateUpdate({id, candidateName, politicalParty}))
     dispatch(setVisible(false));
  };

   const isLoading = updateStatus === CALL_STATUS.LOADING;
   const isSuccess = updateStatus === CALL_STATUS.SUCCESS;
   const isError = updateStatus === CALL_STATUS.ERROR;
  
  return (
    <>
      <form
        className="flex flex-col gap-4 w-full md:w-[30%] px-4"
        onSubmit={editCandidate}
      >
        <div className="flex justify-between">
          <h1 className="text-xl text-gray-700 font-bold">Edit Candidate</h1>
          <svg
            className=" w-6 h-6 text-red-800"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
            onClick={removeVisibility}
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m13 7-6 6m0-6 6 6m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
          
        </div>
        {isError ? <p className="text-red-600">{updateError}</p> : null}
        <div>
          <label
            htmlFor="candidate-name"
            className="block mb-2 text-sm font-medium text-gray-900 "
          >
            Candidate Name
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
              <svg
                className="w-4 h-4 text-gray-500 "
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
              </svg>
            </span>
            <input
              type="text"
              id="candidate-name"
              className="rounded-none rounded-r-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5 "
              placeholder="Adam John"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="website-admin"
            className="block mb-2 text-sm font-medium text-gray-900 "
          >
            Political Party
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md">
              <svg
                className="w-4 h-4 text-gray-600 "
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.333 6.764a3 3 0 1 1 3.141-5.023M2.5 16H1v-2a4 4 0 0 1 4-4m7.379-8.121a3 3 0 1 1 2.976 5M15 10a4 4 0 0 1 4 4v2h-1.761M13 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm-4 6h2a4 4 0 0 1 4 4v2H5v-2a4 4 0 0 1 4-4Z"
                />
              </svg>
            </span>
            <input
              type="text"
              id="website-admin"
              className="rounded-none rounded-r-lg bg-gray-50 border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm p-2.5 "
              placeholder="Workers Party"
              value={politicalParty}
              onChange={(e) => setPoliticalParty(e.target.value)}
            />
          </div>
        </div>
        <input type="hidden" name="id" value={id || ""} />
        <button
          type="submit"
          className="text-white bg-gray-800 hover:bg-gray-600 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2"
        >
          {isLoading ? "Loading..." : "Update"}
        </button>
      </form>
    </>
  );
};

export default EditCandidateForm;
