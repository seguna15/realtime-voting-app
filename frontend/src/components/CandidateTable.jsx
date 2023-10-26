import React from 'react'
import CandidateTableBody from './CandidateTableBody';
import { useSelector } from 'react-redux';
import { CALL_STATUS } from '../Status';

const CandidateTable = ({ handleFetchEdit }) => {
  const { candidates, fetchStatus, fetchError } = useSelector(
    (state) => state.candidates
  );

  const isFetchLoading = fetchStatus === CALL_STATUS.LOADING;
  const isFetchSuccess = fetchStatus === CALL_STATUS.SUCCESS;
  const isFetchError = fetchStatus === CALL_STATUS.ERROR;

  return (
    <>
      <div className="relative overflow-x-auto">
        {isFetchLoading && <p className="text-blue-500">Data is loading...</p>}
        {isFetchError && <p className="text-red-500">{fetchError}</p>}
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 ">
            <tr>
              <th scope="col" className="px-6 py-3">
                #
              </th>
              <th scope="col" className="px-6 py-3">
                Candidate's name
              </th>
              <th scope="col" className="px-6 py-3">
                Political Party
              </th>
              <th scope="col" className=" flex justify-center px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {isFetchSuccess && (
              <CandidateTableBody
                data={candidates}
                handleFetchEdit={handleFetchEdit}
              />
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default CandidateTable