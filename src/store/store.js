// src/store/store.js

import { configureStore } from "@reduxjs/toolkit";
import expedienteReducer from "../features/expediente/expedienteSlice";
// CAMBIO: Se corrigió la ruta para que apunte directamente a la carpeta 'pases'
import pasesReducer from "../features/pases/pasesSlice"; 
import audienciasReducer from "../features/audiencias/audienciaSlice.js";

export const store = configureStore({
  reducer: {
    expediente: expedienteReducer,
    pases: pasesReducer,
    audiencias: audienciasReducer,
  },
});