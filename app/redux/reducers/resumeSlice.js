import { createSlice } from '@reduxjs/toolkit';
import {
  fetchResumes,
  fetchResumeById,
  createResume,
  updateResume,
  deleteResume,
  generateAIResume,
} from '../actions/resumeActions';

const initialState = {
  resumes: [],
  currentResume: null,
  loading: false,
  error: null,
  generatingAI: false,
};

const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    // Synchronous actions
    clearError: (state) => {
      state.error = null;
    },
    setCurrentResume: (state, action) => {
      state.currentResume = action.payload;
    },
    clearCurrentResume: (state) => {
      state.currentResume = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all resumes
    builder
      .addCase(fetchResumes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResumes.fulfilled, (state, action) => {
        state.loading = false;
        state.resumes = action.payload;
        state.error = null;
      })
      .addCase(fetchResumes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch resume by ID
    builder
      .addCase(fetchResumeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResumeById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentResume = action.payload;
        state.error = null;
      })
      .addCase(fetchResumeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create resume
    builder
      .addCase(createResume.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createResume.fulfilled, (state, action) => {
        state.loading = false;
        state.resumes.push(action.payload);
        state.currentResume = action.payload;
        state.error = null;
      })
      .addCase(createResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update resume
    builder
      .addCase(updateResume.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateResume.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.resumes.findIndex(
          (resume) => resume.id === action.payload.id
        );
        if (index !== -1) {
          state.resumes[index] = action.payload;
        }
        state.currentResume = action.payload;
        state.error = null;
      })
      .addCase(updateResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete resume
    builder
      .addCase(deleteResume.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteResume.fulfilled, (state, action) => {
        state.loading = false;
        state.resumes = state.resumes.filter(
          (resume) => resume.id !== action.payload
        );
        if (state.currentResume?.id === action.payload) {
          state.currentResume = null;
        }
        state.error = null;
      })
      .addCase(deleteResume.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Generate AI resume
    builder
      .addCase(generateAIResume.pending, (state) => {
        state.generatingAI = true;
        state.error = null;
      })
      .addCase(generateAIResume.fulfilled, (state, action) => {
        state.generatingAI = false;
        state.currentResume = action.payload;
        state.resumes.push(action.payload);
        state.error = null;
      })
      .addCase(generateAIResume.rejected, (state, action) => {
        state.generatingAI = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setCurrentResume, clearCurrentResume } = resumeSlice.actions;
export default resumeSlice.reducer;
