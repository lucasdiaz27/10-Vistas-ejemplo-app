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
      "Content-Type": "multipart/form-data"
    },
  });
};

export const traerDenuncias = async (token) => {
  const res = await axios.get("http://localhost:8080/denuncia/traerDenuncia", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const traerDenunciaPorId = async (id, token) => {
  const res = await axios.get(`http://localhost:8080/denuncia/traerDenunciaPorId/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const eliminarDenuncia = async (id, token) => {
  return axios.delete(`http://localhost:8080/denuncia/eliminar/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const actualizarEstadoDenuncia = async (id, nuevoEstado, motivoEstado, token) => {
  return axios.put(
    `http://localhost:8080/denuncia/actualizarEstado/${id}`,
    { estado: nuevoEstado, motivo: motivoEstado },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};


// ale

export const traerDocDenuncia = async (id, token) => {
  const res = await axios.get(`http://localhost:8080/doc/traerPorDenuncia/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export const mandarCorreo = async (id, observacion, token) => {
  return axios.post(`http://localhost:8080/denuncia/mandarCorreo/${id}`, 
    observacion, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export const traerHistorialDenuncia = async (nroExp, token) => {
  const res = await axios.get(`http://localhost:8080/denuncia/historial/${nroExp}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const traerDenunciaPorUsuario = async (token) => {
  const res = await axios.get(`http://localhost:8080/denuncia/traerDenunciasPorUsuario`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
  });
  return res.data
}