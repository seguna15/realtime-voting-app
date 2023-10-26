import React, { useEffect } from 'react'
import VoteCard from '../../components/VoteCard'
import Header from '../../components/Header'
import { useDispatch, useSelector } from 'react-redux'
import { candidateFetch } from '../../redux/candidates/candidateSlice'

const VotingPage = ({socket}) => {
  const {candidates, fetchError, fetchStatus } = useSelector( state => state.candidates);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(candidateFetch())
  },[])

  socket
  return (
    <>
      <Header />
      <main className="w-full mt-5 p-5 flex gap-4 justify-center">
        {candidates &&
          candidates.map((candidate) => (
            <VoteCard key={candidate._id} data={candidate} socket={socket} />
          ))}
      </main>
    </>
  );
}

export default VotingPage