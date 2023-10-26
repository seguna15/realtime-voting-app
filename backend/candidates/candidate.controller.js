import ErrorHandler from "../utils/ErrorHandler.js";
import Candidate from "./candidates.model.js";


export const createCandidate = async(req, res, next) => {
    try {
        const {candidateName, politicalParty} = req.body;
        if(!candidateName || !politicalParty) return next(new ErrorHandler("Kindly ensure all fields are filled", 400));

        const foundParty = await Candidate.findOne({politicalParty});
        if (foundParty)
          return next(
            new ErrorHandler(`${politicalParty} already has a candidate`, 409)
          );

        const newCandidate = new Candidate({
          candidateName,
          politicalParty,
        });

        await newCandidate.save()
        return res.status(201).send(newCandidate);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}

export const getAllCandidates = async (req, res, next) => {
    try {
        const candidates = await Candidate.find();
        if(!candidates) return next(new ErrorHandler('No candidate found', 404));
        return res.status(201).send(candidates);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}

export const getCandidate = async (req, res, next) => {
    try{
        const {id} = req.params;
        if(!id) return next(new ErrorHandler('Something went wrong.', 400));
        const candidate = await Candidate.findById({_id: id});

        if(!candidate) return next(new ErrorHandler("Candidate not found.", 404));

        return res.status(200).send(candidate);
    }catch(error){
        return next(new ErrorHandler(error.message, 500))
    }
}

export const updateCandidate = async (req, res, next) => {
    try {
        const {id} = req.params;
        const {candidateName, politicalParty} = req.body;
        if(!id) return next(new ErrorHandler('Candidate not found.', 400));

        const updatedCandidate = await Candidate.findByIdAndUpdate(
          {_id: id},
          {
            $set: {
              candidateName,
              politicalParty,
            },
          },
          { new: true }
        );
        

        if(!updatedCandidate) return next(new ErrorHandler("Could update the candidate", 404));
        return res.status(201).send(updatedCandidate);
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}

export const deleteCandidate = async (req, res, next) => {
  try {
    const {id} = req.params;
    if(!id) return next(new ErrorHandler('Candidate not found.', 400));

    const deletedCandidate = await Candidate.findByIdAndDelete(id);
    if(!deletedCandidate) return next(new ErrorHandler("Could not delete user", 404))
    return res.status(200).send(deletedCandidate);
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
}