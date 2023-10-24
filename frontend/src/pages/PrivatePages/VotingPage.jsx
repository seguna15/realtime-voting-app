import React from 'react'
import VoteCard from '../../components/VoteCard'
import Header from '../../components/Header'

const VotingPage = ({socket}) => {
  const myArray = [1, 2, 3];
  socket
  return (
    <>
      <Header />
      <main className="w-full mt-5 p-5 flex gap-4 justify-center">
       
        {myArray && myArray.map((item, index) => 
          <VoteCard key={index} data={item} socket={socket} />
        )}
      </main>
    </>
  );
}

export default VotingPage