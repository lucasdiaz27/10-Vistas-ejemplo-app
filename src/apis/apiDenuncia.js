import axios from "axios";

export const enviarDenuncia = async (data, files) => {
  const formData = new FormData();
  if (files && files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      formData.append("file", files[i]);
    }
  }
  formData.append("denuncia", JSON.stringify(data));
  return axios.post("https://site-backend-f8xg.onrender.com/denuncia/subirDenuncia", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    },
  });
};

export const traerDenuncias = async (token) => {
  const res = await axios.get("https://site-backend-f8xg.onrender.com/denuncia/traerDenuncia", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const traerDenunciaPorId = async (id, token) => {
  const res = await axios.get(`https://site-backend-f8xg.onrender.com/denuncia/traerDenunciaPorId/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const eliminarDenuncia = async (id, token) => {
  return axios.delete(`https://site-backend-f8xg.onrender.com/denuncia/eliminar/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const actualizarEstadoDenuncia = async (id, nuevoEstado, motivoEstado, token) => {
  return axios.put(
    `https://site-backend-f8xg.onrender.com/denuncia/actualizarEstado/${id}`,
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
  const res = await axios.get(`https://site-backend-f8xg.onrender.com/doc/traerPorDenuncia/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export const mandarCorreo = async (id, observacion, token) => {
  return axios.post(`https://site-backend-f8xg.onrender.com/denuncia/mandarCorreo/${id}`, 
    observacion, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export const traerHistorialDenuncia = async (nroExp, token) => {
  const res = await axios.get(`https://site-backend-f8xg.onrender.com/denuncia/historial/${nroExp}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const traerDenunciaPorUsuario = async (token) => {
  const res = await axios.get(`https://site-backend-f8xg.onrender.com/denuncia/traerDenunciasPorUsuario`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
  });
  return res.data
}