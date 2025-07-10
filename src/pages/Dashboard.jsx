import { useEffect, useState } from "react";
import { auth, db } from "../services/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import AdminPanel from "../components/AdminPanel";
import UserStatsPanel from "../components/UserStatsPanel";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const docRef = doc(db, "usuarios", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      } else {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = () => {
    signOut(auth).then(() => navigate("/"));
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <div className="p-3" style={{ width: "250px" }}>
        <h4>Panel de usuario</h4>
        <hr />
        {user && userData && (
          <>           
            <p>Usuario: <strong>{userData.nombre}</strong></p>
            <p style={{ fontSize: "0.9rem" }}>Email: {user.email}</p>
            <p className="badge bg-secondary">{userData.role}</p>
            <hr />
            <ul className="nav flex-column mt-4">
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link text-white">Inicio</Link>
              </li>
              {userData.role !== "admin" && (
                <>
                  <li className="nav-item">
                    <Link to="/tasks/new" className="nav-link text-white">Agregar tarea</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/tasks/history" className="nav-link text-white">Mis tareas</Link>
                  </li>
                </>
              )}

              {userData.role === "admin" && (
                <>
                  <li className="nav-item">
                    <Link to="/admin/tasks/new" className="nav-link text-white">Agregar tarea (Admin)</Link>
                  </li>
                </>
              )}

              <li className="nav-item mt-3">
                <button className="btn btn-success w-100" onClick={handleLogout}>
                  Cerrar sesión
                </button>
              </li>
            </ul>
          </>
        )}
      </div>

      {/* Contenido principal */}
      <div className="flex-grow-1 p-4 bg-dark">
        <h2>Dashboard</h2>
        <hr />
        {userData?.role === "admin" ? <AdminPanel /> : <UserStatsPanel />}
      </div>
    </div>
  );
};

export default Dashboard;

