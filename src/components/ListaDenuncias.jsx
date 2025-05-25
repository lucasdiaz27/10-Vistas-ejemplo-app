import { useEffect,useState } from "react";
import axios from "axios";

const ListaDenuncias = () => {
    const [denuncias, setDenuncias] = useState([]);

    useEffect(() => {
        axios
            .get("http://127.0.0.1:8080/denuncia/traerDenuncia")

            .then((response) => {
                setDenuncias(response.data);
            })
            .catch((error) => {
                console.error("Error al traer denuncias:", error);
            });
    }, []);

    return (
    <div>
      <h2>Lista de Denuncias</h2>
      <ul>
        {denuncias.map((denuncia, index) => (
          <li key={index}>
            {JSON.stringify(denuncia)}
          </li>
        ))}
      </ul>
    </div>
  );
}
export default ListaDenuncias;
