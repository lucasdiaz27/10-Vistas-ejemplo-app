import { configureStore } from "@reduxjs/toolkit"; // importamos configureStore desde Redux Toolkit
import expedienteReducer from "../features/expediente/expedienteSlice"; // importamos el reductor del slice de expediente

export const store = configureStore({
  reducer: {
    expediente: expedienteReducer, // añadimos el reductor del slice de expediente al store
  },
});