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
            // --- CASOS PARA OBTENER PASES ---
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

            // --- CASOS PARA LAS ACCIONES CRUD ---
            .addCase(addNewPase.fulfilled, (state, action) => {
                // ✅ CAMBIO: Agregamos el console.log para "espiar" la respuesta de la API
                console.log("PASE RECIBIDO DESDE LA API:", action.payload); 

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