import mongoose from "mongoose";

const voteSchema = new mongoose.Schema({
    voterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    candidateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Candidate'
    },
    voterPicture: String,
    voteStatus: {
        type: Boolean,
        default: false,
    },
    dateCast: {
        type: Date,
        default: Date.now(),
    }
});

const Vote =  mongoose.model('Vote', voteSchema);

export default Vote;


