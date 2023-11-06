import Vote from "./votes.model.js";
import {ref, deleteObject } from "firebase/storage";
import { storage } from "../config/firebase.js";

export const findUserVoteAndDelete = async (id) => {
    const foundVote = await Vote.findOne({voterId: id});
    if (!foundVote) return false;

    await Vote.findOneAndDelete({voterId: id});
    return true;
    
}

export const findCandidateVotesAndDelete = async (id) => {
    const foundCandidatesVotes = (await Vote.find({candidateId: id}))

    await foundCandidatesVotes.forEach(async(candidate) => {
        const desertRef = ref(storage, candidate.voterPicture);
            
        // Delete the file
        await deleteObject(desertRef);
    });

    if(!foundCandidatesVotes) return false;

    await Vote.deleteMany({candidateId: id});
    return true;
}


export const fetchVoteStats = async () => {
  try {
    const stats = await Vote.aggregate([
      { $match: { voteStatus: true } },
      {
        $group: {
          _id: "$candidateId",
          votes: { $sum: 1 },
        },
      },

      {
        $lookup: {
          from: "candidates",
          localField: "_id",
          foreignField: "_id",
          as: "candidate_data",
        },
      },
      {
        $unwind: "$candidate_data",
      },
      {
        $project: {
          _id: 1,
          votes: 1,
          "candidate_data.candidateName": 1,
          "candidate_data.politicalParty": 1,
        },
      },
    ]);

    const voteStats = stats.sort((a, b) => {
      const nameA = a.candidate_data.politicalParty;
      const nameB = b.candidate_data.politicalParty;

      if (nameA < nameB) return -1;

      if (nameA > nameB) return 1;

      return 0;
    });
    const totalVoteCast = voteStats.reduce((accumulator, curValue) => {
      return accumulator + curValue.votes;
    }, 0);

    return { voteStats, totalVoteCast };
  } catch (error) {
    return error.message;
  }
};