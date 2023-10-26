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
              total: { $sum: 1 },
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
              total: 1,
              "candidate_data.candidateName": 1,
              "candidate_data.politicalParty": 1,
            },
          },
        ]);

      
        
        return res.status(200).send(stats)
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}