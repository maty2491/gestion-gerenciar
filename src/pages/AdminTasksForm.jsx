// src/pages/AdminTasksForm.jsx
import { useState } from "react";
import { db, auth } from "../services/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const tareasOpciones = ["Whatsapp", "Llamada", "Email", "Reunión"];
const gestionOpciones = {
  Whatsapp: [
    "Alta de plan de pagos",
    "Contacto demandado",
    "Contacto empleador",
  ],
  Llamada: ["Consulta", "Seguimiento", "Cierre"],
  Email: ["Respuesta", "Envio info", "Confirmación"],
  Reunión: ["Inicial", "Seguimiento", "Cierre"],
};

const AdminTasksForm = () => {
  const user = auth.currentUser;
  const navigate = useNavigate();

  const [form, setForm] = useState({
    tarea: "",
    gestion: "",
    cantidad: 1,
    observaciones: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));

    if (name === "tarea") setForm((f) => ({ ...f, gestion: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("No estás autenticado");
    if (!form.tarea || !form.gestion) return alert("Completa tarea y gestión");

    try {
      await addDoc(collection(db, "tareas"), {
        userId: user.uid,
        userName: user.displayName || user.email,
        tarea: form.tarea,
        gestion: form.gestion,
        cantidad: Number(form.cantidad),
        observaciones: form.observaciones,
        timestamp: Timestamp.fromDate(new Date()),
      });

      alert("Tarea cargada!");
      navigate("/dashboard");
    } catch (error) {
      alert("Error cargando tarea: " + error.message);
    }
  };

  return (
    <div className="container mt-4">
      <h3>Agregar tarea (Admin)</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Tarea</label>
          <select
            className="form-select"
            name="tarea"
            value={form.tarea}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona una tarea</option>
            {tareasOpciones.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label>Gestión</label>
          <select
            className="form-select"
            name="gestion"
            value={form.gestion}
            onChange={handleChange}
            required
            disabled={!form.tarea}
          >
            <option value="">Selecciona gestión</option>
            {form.tarea &&
              gestionOpciones[form.tarea].map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
          </select>
        </div>

        <div className="mb-3">
          <label>Cantidad</label>
          <input
            type="number"
            name="cantidad"
            className="form-control"
            min="1"
            value={form.cantidad}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label>Observaciones</label>
          <textarea
            name="observaciones"
            className="form-control"
            rows="2"
            value={form.observaciones}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Agregar tarea
        </button>
      </form>

      <Link to="/dashboard" className="btn btn-secondary mt-3">
        Volver al dashboard
      </Link>
    </div>
  );
};

export default AdminTasksForm;

