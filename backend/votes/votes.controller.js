import ErrorHandler from "../utils/ErrorHandler.js";
import Vote from "./votes.model.js";
import {
  getDownloadURL,
  ref,
  uploadString,
} from "firebase/storage";
import {storage} from "../config/firebase.js";
import { v4 as uuidv4 } from "uuid";

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
        return res.status(201).json({status: "pending", message:"Vote cast successfully."});
    } catch (error) {
        return next( new ErrorHandler(error.message, 500));
    }
}

export const validateVote = async (req, res, next) => {
  try {
    const {image} = req.body;

    if(!image) return next(new ErrorHandler('You have to snap a picture', 400))
    const findVote = await Vote.findOne({voterId: req.user.id})

    
    if (!findVote) return next(new ErrorHandler("Vote not found.", 404));
    
    const dateTime = new Date().getTime();

    const filename = `votes/${dateTime}-${uuidv4()}`;
    const storageRef = ref(storage, filename);

    const snapshot = await uploadString(storageRef, image, "data_url");
    const downloadURL = await getDownloadURL(snapshot.ref);

    if (!downloadURL) return next(new ErrorHandle("Upload failed", 504));

    findVote.voteStatus = true;
    findVote.voterPicture = downloadURL;

    await findVote.save()

    return res
      .status(201)
      .json({  message: "Vote has been validated" }); 
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}


export const getAllVotes = async(req, res, next) => {
    try {
        const allVotes = await Vote.find({voteStatus: true}).populate("candidateId", ["candidateName","politicalParty"]);
        
        return res.status(200).send(allVotes);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}

export const voteStats = async (req, res, next) => {
    try{
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

        
        
        return res.status(200).send({voteStats, totalVoteCast})
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}