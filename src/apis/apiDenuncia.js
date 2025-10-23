import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_BASE_URL}/denuncia`

export const enviarDenuncia = async (data, files) => {
  const formData = new FormData();
  if (files && files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      formData.append("file", files[i]);
    }
  }
  formData.append("denuncia", JSON.stringify(data));
  return axios.post(`${BASE_URL}/subirDenuncia`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    },
  });
};

export const traerDenuncias = async (token) => {
  const res = await axios.get(`${BASE_URL}/traerDenuncia`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const traerDenunciaPorId = async (id, token) => {
  const res = await axios.get(`${BASE_URL}/traerDenunciaPorId/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const eliminarDenuncia = async (id, token) => {
  return axios.delete(`${BASE_URL}/eliminar/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const actualizarEstadoDenuncia = async (id, nuevoEstado, motivoEstado, token) => {
  return axios.put(
    `${BASE_URL}/actualizarEstado/${id}`,
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
  const res = await axios.get(`http://100.83.50.21:8080/doc/traerPorDenuncia/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export const mandarCorreo = async (id, observacion, token) => {
  return axios.post(`${BASE_URL}/mandarCorreo/${id}`, 
    observacion, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export const traerHistorialDenuncia = async (nroExp, token) => {
  const res = await axios.get(`${BASE_URL}/historial/${nroExp}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const traerDenunciaPorUsuario = async (token) => {
  const res = await axios.get(`${BASE_URL}/traerDenunciasPorUsuario`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
  });
  return res.data
}