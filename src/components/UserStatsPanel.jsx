import { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db, auth } from "../services/firebase";
import { FaWhatsapp, FaArrowUp, FaRegThumbsUp, FaFileAlt } from "react-icons/fa";

const gestionIconos = {
  "Alta de plan de pagos": <FaArrowUp size={32} color="green" />,
  "Contacto demandado": <FaRegThumbsUp size={32} color="orange" />,
  "Contacto empleador": <FaFileAlt size={32} color="blue" />,
};

const tareaIconos = {
  Whatsapp: <FaWhatsapp size={32} color="#25D366" />,
};

const UserStatsPanel = () => {
  const [resumen, setResumen] = useState([]);

  useEffect(() => {
    const cargarTareas = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const q = query(collection(db, "tareas"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);

      const conteo = {};

      querySnapshot.forEach((doc) => {
        const { tarea, gestion, cantidad } = doc.data();
        const key = `${tarea}-${gestion}`;

        if (!conteo[key]) {
          conteo[key] = {
            tarea,
            gestion,
            cantidad: 0,
          };
        }

        conteo[key].cantidad += cantidad;
      });

      setResumen(Object.values(conteo));
    };

    cargarTareas();
  }, []);

  return (
    <div>
      <h4 className="mb-4">Resumen de tareas</h4>
      <div className="row">
        {resumen.map((item, idx) => (
          <div className="col-md-4 mb-3" key={idx}>
            <div className="card shadow-sm">
              <div className="card-body text-center">
                <div className="mb-2">
                  {tareaIconos[item.tarea] || <span>🔧</span>}
                </div>
                <div className="card-title">{item.tarea}</div>
                <div className="mb-2">
                  {gestionIconos[item.gestion] || <span>📋</span>}
                </div>
                <div className="card-subtitlemb-2 text-muted">
                  {item.gestion}
                </div>
                <h3>{item.cantidad}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserStatsPanel;
