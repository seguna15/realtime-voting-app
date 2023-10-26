import React, { useEffect, useState } from 'react'
import Header from '../../../components/Header'
import CandidateForm from '../../../components/CandidateForm';
import CandidateTable from '../../../components/CandidateTable';
import { CALL_STATUS } from '../../../Status';
import { useDispatch, useSelector } from 'react-redux';
import {  candidateFetch,  setVisible } from '../../../redux/candidates/candidateSlice';
import axios from 'axios';
import EditCandidateForm from '../../../components/EditCandidateForm';


const CandidatePage = () => {
  const { candidates, editVisible } = useSelector((state) => state.candidates);

  const [candidateName, setCandidateName] = useState('');
  const [politicalParty, setPoliticalParty] = useState('');
  const [id, setId] = useState('');
  const [status, setStatus] = useState(CALL_STATUS.IDLE);
  const [error, setError] = useState(null);
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(candidateFetch())
  },[dispatch])
  
  const handleFetchEdit = async (e, id) => {
    e.preventDefault();
    dispatch(setVisible(true));
    setStatus(CALL_STATUS.LOADING);
    try {
      const res = await axios.get(
        `/candidate/${id}`,
        {},
        { withCredentials: true }
      );
      setId(id);
      setCandidateName(res.data.candidateName);
      setPoliticalParty(res.data.politicalParty);
      setStatus(CALL_STATUS.SUCCESS)
    } catch (error) {
      setError("Something went wrong");
      setStatus(CALL_STATUS.ERROR);
    }
  };

  
  const isFetchError = status === CALL_STATUS.ERROR;
  
  
  return (
    <>
      <Header />
      <main className="mt-5 flex justify-center items-center min-h-[600px] w-full">
        <section className="relative flex flex-col lg:flex-row justify-center items-center  w-full ">
          {isFetchError ? <p className="mb-4 text-red-600">{error}</p> : null}
          {editVisible ? (
            <EditCandidateForm
              candidateName={candidateName}
              politicalParty={politicalParty}
              setCandidateName={setCandidateName}
              setPoliticalParty={setPoliticalParty}
              id={id}
            />
          ) : (
            <CandidateForm
              candidateName={candidateName}
              politicalParty={politicalParty}
              setCandidateName={setCandidateName}
              setPoliticalParty={setPoliticalParty}
            />
          )}

          <CandidateTable
            candidates={candidates}
            handleFetchEdit={handleFetchEdit}
          />
        </section>
      </main>
    </>
  );
}



export default CandidatePage