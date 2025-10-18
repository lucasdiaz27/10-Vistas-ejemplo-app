import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { traerExpedientePorId } from "../../apis/expedientesApi"; // importamos la función que trae el expediente por ID

// definimos un thunk que obtiene un expediente desde  el backend
export const fetchExpedienteById = createAsyncThunk(
    "expediente/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token"); // obtenemos el token del localStorage
            const data = await traerExpedientePorId(id, token); // llamamos a la API para traer el expediente
            return data; // retornamos los datos obtenidos
        } catch (error) {
            return rejectWithValue(error.message); // en caso de error, retornamos el mensaje de error
        }
    }
);

// un estado incial
const initialState = {
    expediente: null, // exp actual
    loading: false, // estado de carga
    error: null, // error
};

//slice principal
const expedienteSlice = createSlice({
  name: "expediente",
  initialState,
  reducers: {
    // accion para limpiar el expediente del store
    clearExpediente: (state) => {
      state.expediente = null;
      state.error = null;
      state.loading = false;
    },
    // accionn para actualizar manualmente el expediente
    updateExpediente: (state, action) => {
      state.expediente = { ...state.expediente, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpedienteById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpedienteById.fulfilled, (state, action) => {
        state.loading = false;
        state.expediente = action.payload;
      })
      .addCase(fetchExpedienteById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// hay que exportar aaciones y reducers
export const { clearExpediente, updateExpediente } = expedienteSlice.actions;
export default expedienteSlice.reducer;
