import axios from "axios";

export const enviarDenuncia = async (data, files) => {
  const formData = new FormData();

  if (files && files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      formData.append("file", files[i]);
    }
  }

  formData.append("denuncia", JSON.stringify(data));
  
  return axios.post("http://localhost:8080/denuncia/subirDenuncia", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const traerDenuncias = async () => {
  const res = await axios.get("http://localhost:8080/denuncia/traerDenuncia");
  return res.data;
};

export const traerDenunciaPorId = async (id) => {
  const res = await axios.get(`http://localhost:8080/denuncia/traerDenunciaPorId/${id}`);
  return res.data;
}


export const eliminarDenuncia = async (id) => {
  return axios.delete(`http://localhost:8080/denuncia/eliminar/${id}`);
};

export const actualizarEstadoDenuncia = async (id, nuevoEstado, motivoEstado) => {
  return axios.put(
    `http://localhost:8080/denuncia/actualizarEstado/${id}`,
    { estado: nuevoEstado, motivo: motivoEstado }
  );
};
