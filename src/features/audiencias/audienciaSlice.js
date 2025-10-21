// src/features/audiencias/audienciaSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
    traerAudienciasPorExpediente,
    crearAudiencia,
    editarAudiencia,
    eliminarAudiencia,
} from "../../apis/audienciasApi";

// Estado inicial
const initialState = {
    audiencias: [],
    loading: false,
    error: null,
};

//Thunks asíncronos (acciones con lógica API)

//Traer audiencias por expediente
export const fetchAudiencias = createAsyncThunk(
    "audiencias/fetchAudiencias",
    async ({ expedienteId, token }, { rejectWithValue }) => {
        try {
            const data = await traerAudienciasPorExpediente(expedienteId, token);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

//Crea una nueva audiencia
export const crearAudienciaThunk = createAsyncThunk(
    "audiencias/crearAudiencia",
    async ({ audiencia, token }, { rejectWithValue }) => {
        try {
            const data = await crearAudiencia(audiencia, token);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

//Edita una audiencia existente
export const editarAudienciaThunk = createAsyncThunk(
    "audiencias/editarAudiencia",
    async ({ id, audiencia, token }, { rejectWithValue }) => {
        try {
            const data = await editarAudiencia(id, audiencia, token);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

//Elimina una audiencia
export const eliminarAudienciaThunk = createAsyncThunk(
    "audiencias/eliminarAudiencia",
    async ({ id, token }, { rejectWithValue }) => {
        try {
            await eliminarAudiencia(id, token);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

//Slice principal
const audienciaSlice = createSlice({
    name: "audiencias",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            //FETCH
            .addCase(fetchAudiencias.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAudiencias.fulfilled, (state, action) => {
                state.loading = false;
                state.audiencias = action.payload;
            })
            .addCase(fetchAudiencias.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            //CREAR
            .addCase(crearAudienciaThunk.fulfilled, (state, action) => {
                state.audiencias.push(action.payload);
            })
            //EDITAR
            .addCase(editarAudienciaThunk.fulfilled, (state, action) => {
                const index = state.audiencias.findIndex(
                    (a) => a.id === action.payload.id
                );
                if (index !== -1) {
                    state.audiencias[index] = action.payload;
                }
            })
            //ELIMINAr
            .addCase(eliminarAudienciaThunk.fulfilled, (state, action) => {
                state.audiencias = state.audiencias.filter(
                    (a) => a.id !== action.payload
                );
            });
    },
});

export default audienciaSlice.reducer;

//selectores
export const selectAudiencias = (state) => state.audiencias.audiencias;
export const selectAudienciaPorId = (id) => (state) =>
    state.audiencias.audiencias.find((a) => a.id === id);
