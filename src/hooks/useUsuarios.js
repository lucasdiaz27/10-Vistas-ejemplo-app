import { useEffect, useState } from "react";
import { traerUsuarios } from "../apis/usuarioAPI";

export const useUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);

    const fetchUsuarios = async () => {
        try {
            const token = localStorage.getItem("token");
            const data = await traerUsuarios(token);
            setUsuarios(data);
            
        } catch (err) {
            console.error("Error al traer usuarios:", err);
            setError("Error al cargar usuarios");
        } finally {
            setCargando(false);
        }
    };
    useEffect(() => {
        fetchUsuarios();
    }, []);

    return { usuarios, fetchUsuarios, cargando, error };
}
