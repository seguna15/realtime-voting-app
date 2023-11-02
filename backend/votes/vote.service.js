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