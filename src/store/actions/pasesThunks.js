import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  traerPasesPorExp,
  crearPase,
  editarPase,
  eliminarPase,
  obtenerAreasEnum
} from '../../apis/pasesApi'; 

const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * (READ) Trae los pases de un expediente específico
 */
export const fetchPasesByExpId = createAsyncThunk(
  'pases/fetchPases',
  async (expedienteId, thunkAPI) => {
    try {
      const token = getToken(); 
      const data = await traerPasesPorExp(expedienteId, token);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

/**
 * (CREATE) Crea un nuevo pase
 * Recibe el FormData
 */
export const addNewPase = createAsyncThunk(
  'pases/addNewPase',
  async (formData, thunkAPI) => {
    try {
      const token = getToken(); 
      const data = await crearPase(formData, token);
      return data; 
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

/**
 * (UPDATE) Edita un pase existente
 * Recibe un objeto con { id, paseData }
 */
export const updateExistingPase = createAsyncThunk(
  'pases/updatePase',
  async ({ id, paseData }, thunkAPI) => {
    try {
      const token = getToken();
      const data = await editarPase(id, paseData, token);
      return data; 
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

/**
 * (DELETE) Elimina un pase
 * Recibe el paseId
 */
export const deleteExistingPase = createAsyncThunk(
  'pases/deletePase',
  async (paseId, thunkAPI) => {
    try {
      const token = getToken(); 
      await eliminarPase(paseId, token);
      return paseId; 
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

/**
 * (READ-Extra) Trae el ENUM de Áreas para los formularios
 */
export const fetchAreasEnum = createAsyncThunk(
  'pases/fetchAreas',
  async (_, thunkAPI) => { 
    try {
      const token = getToken();
      const data = await obtenerAreasEnum(token); 
      return data; 
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);