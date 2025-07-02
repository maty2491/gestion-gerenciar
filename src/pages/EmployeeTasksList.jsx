// src/pages/EmployeeTasksList.jsx
import React, { useEffect, useState } from "react";
import { db, auth } from "../services/firebase";
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore";
import { Link } from "react-router-dom";

const todayStart = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return Timestamp.fromDate(d);
};

const todayEnd = () => {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return Timestamp.fromDate(d);
};

const EmployeeTasksList = () => {
  const user = auth.currentUser;
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (!user) return;
    const fetchTasks = async () => {
      const q = query(
        collection(db, "tareas"),
        where("userId", "==", user.uid),
        where("timestamp", ">=", todayStart()),
        where("timestamp", "<=", todayEnd())
      );
      const querySnapshot = await getDocs(q);
      const list = [];
      querySnapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setTasks(list);
    };
    fetchTasks();
  }, [user]);

  return (
    <div className="container mt-4">
      <h3>Tareas cargadas hoy</h3>
      {tasks.length === 0 ? (
        <p>No hay tareas cargadas hoy.</p>
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
            {tasks.map(({ id, tarea, gestion, cantidad, observaciones, timestamp }) => (
              <tr key={id}>
                <td>{tarea}</td>
                <td>{gestion}</td>
                <td>{cantidad}</td>
                <td>{observaciones}</td>
                <td>{timestamp.toDate().toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Link to="/tasks/new" className="btn btn-success mt-3">
        Agregar tarea
      </Link>
      <Link to="/dashboard" className="btn btn-primary mt-3 ms-5"> Volver </Link>
    </div>
  );
};

export default EmployeeTasksList;
