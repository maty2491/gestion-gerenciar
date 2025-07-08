import { useState } from "react";
import { db, auth } from "../services/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";

const tareasOpciones = [
  { value: "Whatsapp", label: "Whatsapp" },
  { value: "Llamados", label: "Llamados" },
  { value: "Control_Oficios", label: "Control Oficios" },
  { value: "Consulta_Laboral", label: "Consulta Laboral" },
  { value: "Orden", label: "Orden" },
  { value: "Busqueda_de_domicilio", label: "Búsqueda de domicilio" },
];

const gestionOpciones = {
  Whatsapp: [
    "Alta de plan de pagos",
    "Contacto demandado",
    "Contacto empleador",
  ],
  Llamados: [
    "Contacto demandado",
    "Alta plan de pagos",
    "Contacto empleador",
    "Consulta juzgado",
  ],
  Control_Oficios: ["Sin trabajo", "Embargo en cola", "Tiene Plata", "Reenvio oficio"],
  Consulta_Laboral: ["Sin trabajo"],
  Orden: [
    "Orden Legajos",
    "Armado Paquetes",
    "Orden cedulas procesadas/sin procesar",
    "Consulta ordenes de pago",
    "Carga número de expedientes",
    "Analisis Expediente",
  ],
  Busqueda_de_domicilio: ["Búsqueda de domicilio"],
};

const EmployeeTasksForm = () => {
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
    if (name === "tarea") {
      setForm((f) => ({ ...f, gestion: "" }));
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!user) return Swal.fire("Error", "No estás autenticado", "error");
  if (!form.tarea || !form.gestion)
    return Swal.fire("Atención", "Completa tarea y gestión", "warning");

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

    // Mostrar alerta de éxito
    Swal.fire({
      title: "¡Tarea cargada!",
      text: "La tarea fue registrada correctamente.",
      icon: "success",
      confirmButtonText: "OK",
    });

    // Limpiar formulario
    setForm({
      tarea: "",
      gestion: "",
      cantidad: 1,
      observaciones: "",
    });

    // Scroll al top (opcional)
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) {
    Swal.fire("Error", "No se pudo guardar la tarea: " + error.message, "error");
  }
};

  return (
    <div className="container mt-4">
      <h3>Agregar tarea</h3>
      <form onSubmit={handleSubmit}>
        {/* Tarea */}
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
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Gestión */}
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
              (gestionOpciones[form.tarea] || []).map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
          </select>
        </div>

        {/* Cantidad */}
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

        {/* Observaciones */}
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
        Volver a lista de tareas
      </Link>
    </div>
  );
};

export default EmployeeTasksForm;
