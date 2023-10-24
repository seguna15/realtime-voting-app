import React from 'react'

const VoteCard = ({data, socket}) => {
  const handleVote = (e) => {
    e.preventDefault();
    socket.emit('sendVote', {data});
    
  }

  return (
    <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow">
     
      <div className="flex flex-col items-center pb-10">
        <img
          className="w-24 h-24 mb-3 rounded-full shadow-lg"
          src="https://img.freepik.com/premium-vector/man-avatar-profile-picture-vector-illustration_268834-538.jpg"
          alt="Bonnie image"
        />
        <h5 className="mb-1 text-xl font-medium text-gray-900 ">
          Bonnie Green
        </h5>
        <span className="text-sm text-gray-500 ">
          Visual Designer
        </span>
        <div className="flex mt-4 space-x-3 md:mt-6">
          <button
            onClick={handleVote}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
          >
            Vote
          </button>
          
          
        </div>
      </div>
    </div>
  );
}

export default VoteCard