import { useEffect, useState } from "react";
import { auth, db } from "../services/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

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

  // 👉 Redirección automática al cargar /dashboard
  useEffect(() => {
  if (userData && location.pathname === "/dashboard") {
    const destino = userData.role === "admin" ? "/dashboard/admin" : "/dashboard/stats";
    navigate(destino);
  }
}, [location.pathname, userData, navigate]);

  const handleLogout = () => {
    signOut(auth).then(() => navigate("/"));
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <div className="p-3" style={{ width: "250px" }}>
        <h4 className="text-white">Panel de usuario</h4>
        <hr />
        {user && userData && (
          <>
            <p className="text-white">
              Usuario: <strong>{userData.nombre}</strong>
            </p>
            <p style={{ fontSize: "0.9rem" }} className="text-white">
              Email: {user.email}
            </p>
            <p className="badge bg-dark">{userData.role}</p>
            <hr />
            <ul className="nav flex-column mt-4">
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link text-white">
                  Inicio
                </Link>
              </li>

              {userData.role !== "admin" && (
                <>
                  <li className="nav-item">
                    <Link to="/dashboard/tasks/new" className="nav-link text-white">
                      Agregar tarea
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/dashboard/tasks/history" className="nav-link text-white">
                      Mis tareas
                    </Link>
                  </li>
                </>
              )}

              {userData.role === "admin" && (
                <>
                  <li className="nav-item">
                    <Link to="/dashboard/admin/tasks/new" className="nav-link text-white">
                      Agregar tarea (Admin)
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/dashboard/otras-operaciones" className="nav-link text-white">
                      Otras operaciones
                    </Link>
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
      <div className="flex-grow-1 p-4 bg-dark text-white">
        <h2>Dashboard</h2>
        <hr />
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;

