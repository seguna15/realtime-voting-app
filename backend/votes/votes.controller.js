import ErrorHandler from "../utils/ErrorHandler.js";
import Vote from "./votes.model.js";

export const createVote  = async (req, res, next) => {
    try {
        
        const { id, role } = req.user;
        if (!id && !role ) return next( new ErrorHandler('Unauthenticated user', 403));
        
        if(!role === 'User') return next( new ErrorHandler('Only registered users can vote', 403));

        const {candidateId} = req.body;
        if(!candidateId) return next(new ErrorHandler('Something went wrong', 400));
        
        const existingVote = await Vote.findOne({voterId: id});
        if(existingVote) return next(new ErrorHandler('You cannot cast multiple votes', 409));

       
        const vote = new Vote({
          voterId: id,
          candidateId,
        });
        await vote.save();
        return res.status(201).send("Vote cast successfully.");
    } catch (error) {
        return next( new ErrorHandler(error.message, 500));
    }
}

export const getAllVotes = async(req, res, next) => {
    try {
        const allVotes = await Vote.find().populate("candidateId", ["candidateName","politicalParty"]);
        
        return res.status(200).send(allVotes);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}

export const voteStats = async (req, res, next) => {
    try{
        const stats = await Vote.aggregate([
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

        
        
        return res.status(200).send({voteStats, totalVoteCast})
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}