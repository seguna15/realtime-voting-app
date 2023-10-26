import mongoose from "mongoose";

const candidateSchema = new mongoose.Schema(
  {
    candidateName: {
      type: String,
      required: true,
    },
    politicalParty: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

// Hash password

const Candidate = mongoose.model("Candidate", candidateSchema);

export default Candidate;
