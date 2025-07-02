// src/pages/EmployeeTasksHistory.jsx
import React, { useEffect, useState } from "react";
import { db, auth } from "../services/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { Link } from "react-router-dom";

const EmployeeTasksHistory = () => {
  const user = auth.currentUser;
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user) return;
      const q = query(
        collection(db, "tareas"),
        where("userId", "==", user.uid),
        orderBy("timestamp", "desc")
      );
      const querySnapshot = await getDocs(q);
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      setTasks(data);
    };

    fetchTasks();
  }, [user]);

  return (
    <div className="container mt-4">
      <h3>Historial de tareas</h3>
      {tasks.length === 0 ? (
        <p>No hay tareas registradas.</p>
      ) : (
        <table className="table table-striped">
          <thead>
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
      )}
      <Link to="/dashboard" className="btn btn-secondary mt-3">
        Volver al Dashboard
      </Link>
    </div>
  );
};

export default EmployeeTasksHistory;
