// src/features/pases/pasesSlice.js

import { createSlice } from "@reduxjs/toolkit";
import { fetchPasesByExpId, addNewPase, updateExistingPase, deleteExistingPase } from "./pasesThunks";

const initialState = {
    pases: [],
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
};

const pasesSlice = createSlice({
    name: 'pases',
    initialState,
    reducers: {
        resetPases: (state) => {
            state.pases = [];
            state.status = 'idle';
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            //  casos para obtener pases
            .addCase(fetchPasesByExpId.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchPasesByExpId.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.pases = action.payload;
            })
            .addCase(fetchPasesByExpId.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            })

            // casos para acciones del crud
            .addCase(addNewPase.fulfilled, (state, action) => {


                state.pases.push(action.payload);
            })
            .addCase(updateExistingPase.fulfilled, (state, action) => {
                const index = state.pases.findIndex(pase => pase.id === action.payload.id);
                if (index !== -1) {
                    state.pases[index] = action.payload;
                }
            })
            .addCase(deleteExistingPase.fulfilled, (state, action) => {
                state.pases = state.pases.filter(pase => pase.id !== action.payload);
            });
    },
});

export const { resetPases } = pasesSlice.actions;

export default pasesSlice.reducer;