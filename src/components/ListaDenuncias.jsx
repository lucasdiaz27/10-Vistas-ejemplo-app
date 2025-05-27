import { useEffect,useState } from "react";
import axios from "axios";
import { traerDenuncias } from "../apis/apiDenuncia";

const ListaDenuncias = () => {
    const [denuncias, setDenuncias] = useState([]);

    useEffect(() => {
        traerDenuncias()
        .then(data => setDenuncias(data))
        .catch(err => console.error(err));
    }, []);

    return (
    <div>
      <h2>Lista de Denuncias</h2>
      <ul>
        {denuncias.map((denuncia, index) => (
          <li key={index}>
            Nombre:
            {denuncia.personas?.find(p => p.rol === "denunciante")?.nombre}
            <br />
            
            Apellido:
            {denuncia.personas?.find(p => p.rol === "denunciante")?.apellido}
          </li>
        ))}
      </ul>
    </div>
  );
}
export default ListaDenuncias;
