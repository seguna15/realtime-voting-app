import React, { useEffect, useState } from 'react'
import Header from '../../../components/Header';

const VoteResultPage = ({socket}) => {

  const [result, setResult] = useState({});

  useEffect(() => {
    socket.on("voteResult", (payload) => {
      console.log(payload);
      setResult(payload.data);
    });
  }, [socket])
  return (
    <>
      <Header />
      <h1>
        Result: {result._id}
      </h1>
    </>
  );
}

export default VoteResultPage