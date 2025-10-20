// src/features/pases/pasesThunks.js

import { createAsyncThunk } from "@reduxjs/toolkit";
import { 
    traerPasesPorExp, 
    crearPase, 
    editarPase, 
    eliminarPase 
} from "../../apis/pasesApi";

// THUNK PARA OBTENER LOS PASES DE UN EXPEDIENTE (Sin cambios)
export const fetchPasesByExpId = createAsyncThunk(
    'pases/fetchPasesByExpId',
    async (expedienteId, { rejectWithValue }) => {
        const token = localStorage.getItem("token");
        try {
            const data = await traerPasesPorExp(expedienteId, token);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error al traer los pases");
        }
    }
);

// CAMBIO: Thunk de crear ahora maneja FormData
export const addNewPase = createAsyncThunk(
    'pases/addNewPase',
    async ({ paseData, file }, { rejectWithValue }) => {
        const token = localStorage.getItem("token");
        const formDataToSend = new FormData();
        
        // Adjuntamos el JSON del pase como un string
        formDataToSend.append('pase', JSON.stringify(paseData));

        // Si hay un archivo, lo adjuntamos
        if (file) {
            formDataToSend.append('file', file);
        }

        try {
            // Enviamos el FormData completo a la API
            const nuevoPase = await crearPase(formDataToSend, token);
            return nuevoPase;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Error al crear el pase");
        }
    }
);

// CAMBIO: Thunk de actualizar ahora maneja FormData
export const updateExistingPase = createAsyncThunk(
    'pases/updateExistingPase',
    async ({ id, paseData, file }, { rejectWithValue }) => {
        const token = localStorage.getItem("token");
        const formDataToSend = new FormData();
        
        formDataToSend.append('pase', JSON.stringify(paseData));
        if (file) {
            formDataToSend.append('file', file);
        }

        try {
            const paseActualizado = await editarPase(id, formDataToSend, token);
            return paseActualizado;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || "Error al editar el pase");
        }
    }
);

// THUNK PARA ELIMINAR UN PASE (Sin cambios)
export const deleteExistingPase = createAsyncThunk(
    'pases/deleteExistingPase',
    async (paseId, { rejectWithValue }) => {
        const token = localStorage.getItem("token");
        try {
            await eliminarPase(paseId, token);
            return paseId; // Devolvemos el ID para saber cuál eliminar del estado
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error al eliminar el pase");
        }
    }
);