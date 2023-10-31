import React, { useEffect, useState } from 'react'
import Header from '../../../components/Header';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import useAxiosFetch from '../../../hooks/useAxiosFetch';

const VoteResultPage = ({socket}) => {
  
  const [payload, setPayload] = useState({});
  const { data, fetchError, statusObj } = useAxiosFetch("/vote/stats");
  
  useEffect(() => {
    setPayload(data);
  },[data])
  
  useEffect(() => {
    socket.on("voteResult", (payload) => {
      setPayload({...payload});
    });
  }, [socket]) 

  return (
    <>
      <Header />

      <main className="flex flex-col items-center gap-4 mt-5 ">
        {statusObj.isLoading && <h1 className="text-3xl">Data is loading..</h1>}
        {statusObj.isError && <h1 className="text-3xl text-red-600">{fetchError}</h1>}

        <h1 className="text-3xl">
          Total Votes: <span>{payload.totalVoteCast}</span>
        </h1>
        <BarChart
          width={1200}
          height={600}
          data={payload.voteStats}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="candidate_data.politicalParty" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="votes" fill="#aed573" />
        </BarChart>
      </main>
    </>
  );
}

export default VoteResultPage