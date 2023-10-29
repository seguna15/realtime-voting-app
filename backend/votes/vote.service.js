import Vote from "./votes.model.js"

export const findUserVoteAndDelete = async (id) => {
    const foundVote = await Vote.findOne({voterId: id});
    if (!foundVote) false;

    await Vote.findOneAndDelete({voterId: id});
    return true;
    
}