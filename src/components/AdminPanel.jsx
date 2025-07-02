// src/components/AdminPanel.jsx
import React, { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { Link } from "react-router-dom";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "usuarios"));
      const usersList = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        usersList.push({ id: doc.id, ...data });
      });
      setUsers(usersList);
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!selectedUserId) return;
      const q = query(
        collection(db, "tareas"),
        where("userId", "==", selectedUserId),
        orderBy("timestamp", "desc")
      );
      const snapshot = await getDocs(q);
      const tasksList = [];
      snapshot.forEach((doc) => {
        tasksList.push({ id: doc.id, ...doc.data() });
      });
      setTasks(tasksList);
    };
    fetchTasks();
  }, [selectedUserId]);

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Panel de Administración</h3>
      <Link to="/admin/tasks/new" className="btn btn-primary mb-3">
        Agregar Tareas
      </Link>
      <div className="row">
        <div className="col-md-3">
          <div className="card">
            <div className="card-header bg-primary text-white">
              Empleados
            </div>
            <ul className="list-group list-group-flush">
              {users.map((user) => (
                <li
                  key={user.id}
                  className={`list-group-item ${
                    selectedUserId === user.id ? "active text-white bg-secondary" : ""
                  }`}
                  style={{ cursor: "pointer" }}
                  onClick={() => setSelectedUserId(user.id)}
                >
                  {user.nombre}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="col-md-9">
          <div className="card">
            <div className="card-header bg-success text-white">
              Tareas del Empleado
            </div>
            <div className="card-body">
              {tasks.length === 0 ? (
                <p>Selecciona un empleado para ver sus tareas.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th>Tarea</th>
                        <th>Gestión</th>
                        <th>Cantidad</th>
                        <th>Observaciones</th>
                        <th>Fecha / Hora</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tasks.map((task) => (
                        <tr key={task.id}>
                          <td>{task.tarea}</td>
                          <td>{task.gestion}</td>
                          <td>{task.cantidad}</td>
                          <td>{task.observaciones}</td>
                          <td>{task.timestamp.toDate().toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

