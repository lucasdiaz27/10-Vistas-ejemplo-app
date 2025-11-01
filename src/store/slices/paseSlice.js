import { createSlice } from '@reduxjs/toolkit';
import {
  fetchPasesByExpId,
  addNewPase,
  updateExistingPase,
  deleteExistingPase,
  fetchAreasEnum
} from '../actions/pasesThunks'; 

// Estructura de estado inicial, siguiendo las convenciones
const initialState = {
  pases: [],     // La lista de pases del expediente
  areas: [],     // El ENUM de áreas
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

export const paseSlice = createSlice({
  name: 'pases',
  initialState,
  // Reducers síncronos (para limpiar estado, etc.)
  reducers: {
    // Acción para resetear el estado si es necesario
    resetPasesStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
    // Podrías agregar una acción para limpiar los pases al salir de un expediente
    clearPases: (state) => {
      state.pases = [];
      state.status = 'idle';
      state.error = null;
    }
  },
  // Reducers asíncronos (reaccionan a los thunks)
  extraReducers: (builder) => {
    builder
      // --- Thunk: fetchPasesByExpId (Leer) ---
      .addCase(fetchPasesByExpId.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchPasesByExpId.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.pases = action.payload; // Carga la lista de pases
      })
      .addCase(fetchPasesByExpId.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload; // action.payload viene del rejectWithValue
      })

      // --- Thunk: addNewPase (Crear) ---
      .addCase(addNewPase.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(addNewPase.fulfilled, (state) => {
        state.status = 'succeeded';
        // No modificamos la lista aquí.
        // El componente se encargará de re-llamar 'fetchPasesByExpId'
      })
      .addCase(addNewPase.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // --- Thunk: updateExistingPase (Actualizar) ---
      .addCase(updateExistingPase.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(updateExistingPase.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(updateExistingPase.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // --- Thunk: deleteExistingPase (Borrar) ---
      .addCase(deleteExistingPase.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(deleteExistingPase.fulfilled, (state, action) => {
        state.status = 'succeeded';
      })
      .addCase(deleteExistingPase.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })

      // --- Thunk: fetchAreasEnum ---
      .addCase(fetchAreasEnum.fulfilled, (state, action) => {
        state.areas = action.payload; // Carga el ENUM
      })
      .addCase(fetchAreasEnum.rejected, (state, action) => {
        // No queremos que esto ponga el status principal en 'failed'
        console.error('Error al cargar ENUM de áreas:', action.payload);
      });
  }
});

// Exportamos las acciones síncronas
export const { resetPasesStatus, clearPases } = paseSlice.actions;

// Exportamos el reducer
export default paseSlice.reducer;