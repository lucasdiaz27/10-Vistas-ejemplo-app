import { configureStore } from '@reduxjs/toolkit';


// Importamos el reducer desde la carpeta 'slices'
import pasesReducer from './slices/paseSlice'; 
// (Asegúrate de que tu archivo se llame 'paseSlice.js')

export const store = configureStore({
  reducer: {
    // El estado global 'pases' será manejado por tu 'pasesReducer'
    pases: pasesReducer,
    
    // Aquí es donde tus compañeros agregarán los suyos:
    // usuario: usuarioReducer,
    // expediente: expedienteReducer,
  },
});