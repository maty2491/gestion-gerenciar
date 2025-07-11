// src/components/AdminPanel.jsx
import React, { useEffect, useState } from "react";
import { db } from "../services/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import * as XLSX from "xlsx";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "usuarios"));
      const usersList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
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
      const tasksList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasksList);
    };
    fetchTasks();
  }, [selectedUserId]);

  const exportToExcel = () => {
    if (!tasks.length) return alert("No hay tareas para exportar.");

    const data = tasks.map((task) => ({
      Tarea: task.tarea,
      Gestión: task.gestion,
      Cantidad: task.cantidad,
      Observaciones: task.observaciones,
      Fecha: task.timestamp.toDate().toLocaleDateString(),
      Hora: task.timestamp.toDate().toLocaleTimeString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tareas");

    const empleado = users.find((u) => u.id === selectedUserId);
    const nombreArchivo = `Tareas_${empleado?.nombre || "Empleado"}.xlsx`;

    XLSX.writeFile(workbook, nombreArchivo);
  };

  const deleteAllTasks = async () => {
    if (!selectedUserId) return alert("Seleccioná un empleado primero.");

    const confirm = window.confirm("¿Estás seguro de que querés eliminar TODAS las tareas del empleado?");
    if (!confirm) return;

    try {
      const q = query(collection(db, "tareas"), where("userId", "==", selectedUserId));
      const snapshot = await getDocs(q);

      const deletePromises = snapshot.docs.map((docItem) =>
        deleteDoc(doc(db, "tareas", docItem.id))
      );

      await Promise.all(deletePromises);
      alert("Tareas eliminadas.");
      setTasks([]); // Limpia la vista
    } catch (err) {
      alert("Error eliminando tareas: " + err.message);
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Panel de Administración</h3>
      <div className="row">
        {/* Empleados */}
        <div className="col-md-3">
          <div className="card">
            <div className="card-header bg-primary text-white">Empleados</div>
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

        {/* Tareas */}
        <div className="col-md-9">
          <div className="card mb-3">
            <div className="card-header bg-success text-white">
              Tareas del Empleado
            </div>
            <div className="card-body">
              {selectedUserId && (
                <div className="mb-3">
                  <button
                    className="btn btn-outline-success me-2"
                    onClick={exportToExcel}
                  >
                    Exportar a Excel
                  </button>
                  <button
                    className="btn btn-outline-danger"
                    onClick={deleteAllTasks}
                  >
                    Reiniciar tareas
                  </button>
                </div>
              )}

              {tasks.length === 0 ? (
                <p>Seleccioná un empleado para ver sus tareas.</p>
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

