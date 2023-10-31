import React from "react";



const VoteChart =  ({data}) => {
    
  return (
    <BarChart
      width={1000}
      height={600}
      data={data}
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
  );
}

export default VoteChart; 