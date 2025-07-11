import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import Swal from "sweetalert2";

const TaskControlPanel = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [formState, setFormState] = useState({}); // para manejar los inputs sin actualizar Firestore cada vez

  useEffect(() => {
    const cargarUsuarios = async () => {
      const q = await getDocs(collection(db, "usuarios"));
      const lista = q.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsuarios(lista);

      // Inicializar estado local
      const estadoInicial = {};
      lista.forEach(u => {
        estadoInicial[u.id] = {
          puedeCargar: u.puedeCargar !== false,
          vacacionesDesde: u.vacacionesDesde || "",
          vacacionesHasta: u.vacacionesHasta || ""
        };
      });
      setFormState(estadoInicial);
    };

    cargarUsuarios();
  }, []);

  const handleChange = (id, campo, valor) => {
    setFormState((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [campo]: valor,
      },
    }));
  };

  const handleUpdate = async (id) => {
    const { puedeCargar, vacacionesDesde, vacacionesHasta } = formState[id];

    const confirm = await Swal.fire({
      title: '¿Confirmar cambios?',
      text: "¿Querés actualizar los datos de vacaciones del usuario?",
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, actualizar',
      cancelButtonText: 'Cancelar'
    });

    if (!confirm.isConfirmed) return;

    try {
      await updateDoc(doc(db, "usuarios", id), {
        puedeCargar,
        vacacionesDesde,
        vacacionesHasta,
      });

      Swal.fire({
        title: 'Actualizado',
        text: 'Los datos se guardaron correctamente.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: 'No se pudo actualizar el usuario.',
        icon: 'error',
      });
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="text-white">Restricción de carga de tareas</h3>
      {usuarios.map((u) => (
        <div key={u.id} className="border p-3 my-3 bg-secondary rounded">
          <h5>{u.nombre}</h5>
          <div className="form-check mb-2">
            <input
              type="checkbox"
              className="form-check-input"
              checked={formState[u.id]?.puedeCargar || false}
              onChange={(e) => handleChange(u.id, "puedeCargar", e.target.checked)}
              id={`check-${u.id}`}
            />
            <label className="form-check-label" htmlFor={`check-${u.id}`}>
              ¿Puede cargar tareas?
            </label>
          </div>

          <div className="d-flex gap-3 mb-2">
            <div>
              <label>Desde</label>
              <input
                type="date"
                className="form-control"
                value={formState[u.id]?.vacacionesDesde || ""}
                onChange={(e) => handleChange(u.id, "vacacionesDesde", e.target.value)}
              />
            </div>
            <div>
              <label>Hasta</label>
              <input
                type="date"
                className="form-control"
                value={formState[u.id]?.vacacionesHasta || ""}
                onChange={(e) => handleChange(u.id, "vacacionesHasta", e.target.value)}
              />
            </div>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => handleUpdate(u.id)}
          >
            Guardar cambios
          </button>
        </div>
      ))}
    </div>
  );
};

export default TaskControlPanel;
