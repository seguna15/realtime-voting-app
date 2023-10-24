import React, { useEffect, useState } from 'react'

const VoteResultPage = ({socket}) => {

  const [result, setResult] = useState(0);
  useEffect(() => {
    socket.on("voteResult", (result) => {
      
      setResult(result.data);
    });
  }, [socket])
  return (
    <>
      <h1>Result: {result}</h1>
    </>
  );
}

export default VoteResultPage