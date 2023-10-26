import { createAsyncThunk, createSlice, isRejectedWithValue } from "@reduxjs/toolkit";
import { CALL_STATUS } from "../../Status";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
    candidates: [],
    createStatus:  CALL_STATUS.IDLE,
    createError: null,
    fetchStatus: CALL_STATUS.IDLE,
    fetchError: null,
    updateStatus: CALL_STATUS.IDLE,
    updateError: null,
    deleteStatus: CALL_STATUS.IDLE,
    deleteError: null,
    editVisible: false,
}

export const candidateFetch = createAsyncThunk(
  "candidates/candidateFetch",
  async (id=null, { rejectWithValue }) => {
    try {
      const res = await axios.get("/candidate", {}, { withCredentials: true });
      return res?.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

export const candidateCreate = createAsyncThunk(
  "candidates/candidateCreate",
  async(values, { rejectWithValue }) => {
    try { 
      const res = await axios.post(
        "/candidate",
        {candidateName:values.candidateName, politicalParty: values.politicalParty},
        { withCredentials: true }
      );
     return res?.data
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    } 
  }
);

export const candidateUpdate = createAsyncThunk(
  "candidates/candidateUpdate",
  async(values, { rejectWithValue }) => {
    try { 
      
      const res = await axios.put(
        `/candidate/${values.id}`,
        values,
        { withCredentials: true }
      );
      
     return res?.data
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    } 
  }
);

export const candidateDelete = createAsyncThunk(
  "candidates/candidateDelete",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.delete(
        `candidate/${id}`,
        {},
        { withCredentials: true }
      );
      return res?.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const candidateSlice = createSlice({
    name: "candidates",
    initialState,
    reducers: {
      setVisible(state, action){
        const visibility = action.payload;
        state.editVisible = visibility;
      }
    },
    extraReducers: (builder) => {
        builder.addCase(candidateFetch.pending, (state, action) => {
            state.fetchStatus = CALL_STATUS.LOADING;
        });
        builder.addCase(candidateFetch.fulfilled, (state, action) => {
            state.candidates = action.payload;
            state.fetchStatus = CALL_STATUS.SUCCESS;
        });
        builder.addCase(candidateFetch.rejected, (state, action) => {
            state.fetchStatus = CALL_STATUS.ERROR;
            state.fetchError = action.payload;
        });
        builder.addCase(candidateCreate.pending, (state, action) => {
            state.createStatus = CALL_STATUS.LOADING;
        });
        builder.addCase(candidateCreate.fulfilled, (state, action) => {
            state.candidates.push(action.payload);
            state.createStatus = CALL_STATUS.SUCCESS;
            toast.success("Candidate created successfully", {
              position: "top-center",
            }); 
        });
        builder.addCase(candidateCreate.rejected, (state, action) => {
            state.createStatus = CALL_STATUS.ERROR;
            state.createError = action.payload;
            toast.error(state.createError, {
              position: "top-center",
            }); 
        });
        builder.addCase(candidateUpdate.pending, (state, action) => {
            state.updateStatus = CALL_STATUS.LOADING;
        });
        builder.addCase(candidateUpdate.fulfilled, (state, action) => {
           const updateCandidate = state.candidates.map(candidate => candidate._id === action.payload._id ? action.payload : candidate);
            state.candidates = updateCandidate;
            state.updateStatus = CALL_STATUS.SUCCESS;
            toast.success("Candidate updated successfully.", {
              position: "top-center",
            }); 
        });
        builder.addCase(candidateUpdate.rejected, (state, action) => {
            state.updateStatus = CALL_STATUS.ERROR;
            state.updateError = action.payload;
            toast.error(state.updateError, {
              position: "top-center",
            }); 
        });
        builder.addCase(candidateDelete.pending, (state, action) => {
            state.deleteStatus = CALL_STATUS.LOADING;
        });
        builder.addCase(candidateDelete.fulfilled, (state, action) => {
           const newCandidates = state.candidates.filter(candidate => candidate._id !== action.payload._id);
            state.candidates = newCandidates;
            state.deleteStatus = CALL_STATUS.SUCCESS;
            toast.success("Candidate deleted successfully.", {
              position: "top-center",
            }); 
        });
        builder.addCase(candidateDelete.rejected, (state, action) => {
            state.deleteStatus = CALL_STATUS.ERROR;
            state.deleteError = action.payload;
            toast.error(state.deleteError, {
              position: "top-center",
            }); 
        });
    }
})

export const {setVisible} = candidateSlice.actions;

export default candidateSlice.reducer;