// src/components/UserPanel.jsx
import { Link } from "react-router-dom";

const UserPanel = () => {
  return (
    <div>
      <h4>Panel de usuario</h4>
      <Link to="/tasks/new" className="btn btn-success me-2">
        Agregar tarea
      </Link>
      <Link to="/tasks/history" className="btn btn-primary">
        Mis tareas
      </Link>
    </div>
  );
};

export default UserPanel;

