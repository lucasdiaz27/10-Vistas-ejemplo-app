import { authAxios } from '../utils/auth';

const BASE_URL = '/api/auditoria/logs';

// Obtener logs de auditoría (Solo ADMIN)
export const traerLogsAuditoria = async (token) => {
    // GET /api/auditoria/logs?page=0&size=10 (Default)
    const res = await authAxios.get(`${BASE_URL}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};

// Obtener logs por usuario
export const traerLogsPorUsuario = async (idUsuario, token) => {
    const res = await authAxios.get(`${BASE_URL}/usuario/${idUsuario}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
};
