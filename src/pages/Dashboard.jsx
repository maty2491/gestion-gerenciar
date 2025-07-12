import { useEffect, useState } from "react";
import { auth, db } from "../services/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import sc from "../assets/sc.png"
import { FaUserTie, FaHouse  } from "react-icons/fa6";
import { GiGreekTemple } from "react-icons/gi";
import { MdOutlineAddTask  } from "react-icons/md";
import { BiTask } from "react-icons/bi";
import { TiWarning } from "react-icons/ti";

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
          const data = docSnap.data();
          setUserData(data);

          if (
            data.puedeCargar === false &&
            data.vacacionesDesde &&
            data.vacacionesHasta
          ) {
            Swal.fire({
              icon: "info",
              title: "Vacaciones activas",
              html: `Estás de vacaciones desde <strong>${data.vacacionesDesde}</strong> hasta <strong>${data.vacacionesHasta}</strong>.`,
              confirmButtonText: "Cerrar sesión",
              allowOutsideClick: false,
            }).then(() => {
              signOut(auth).then(() => navigate("/"));
            });
          }
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
      const destino =
        userData.role === "admin" ? "/dashboard/admin" : "/dashboard/stats";
      navigate(destino);
    }
  }, [location.pathname, userData, navigate]);

  const handleLogout = () => {
    signOut(auth).then(() => navigate("/"));
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <div className="p-3 " style={{ width: "250px" }}>
        <h4 className="text-white">Panel de usuario</h4>
        <hr />
        {user && userData && (
          <>          
            <p className="text-white m-3">
              <FaUserTie size={20} className="me-3"/> <strong>{userData.nombre}</strong>
            </p>
           
            <p className="m-3">
             <GiGreekTemple size={20} className="me-3"/> <span className="badge bg-dark ">{userData.role}</span>
              </p>
            <hr />
            <ul className="nav flex-column mt-4">
              <li className="nav-item">
                <Link to="/dashboard" className="nav-link text-white">
                  <FaHouse size={20} className="mb-1 me-4"/>Inicio
                </Link>
              </li>

              {userData.role !== "admin" && (
                <>
                  <li className="nav-item">
                    <Link
                      to="/dashboard/tasks/new"
                      className="nav-link text-white"
                    ><MdOutlineAddTask  size={20} className="mb-1 me-4"/>
                      Agregar tarea
                    </Link>
                  </li>
                  <li className="nav-item">
                    
                    <Link
                      to="/dashboard/tasks/history"
                      className="nav-link text-white"
                    >
                      <BiTask size={20} className="mb-1 me-4"/>
                      Mis tareas
                    </Link>
                  </li>
                </>
              )}

              {userData.role === "admin" && (
                <>
                  <li className="nav-item">
                    <Link
                      to="/dashboard/admin/tasks/new"
                      className="nav-link text-white"
                    >
                      <MdOutlineAddTask  size={20} className="mb-1 me-4"/>
                      Agregar tarea
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      to="/dashboard/otras-operaciones"
                      className="nav-link text-white"
                    >
                      <TiWarning size={20} className="mb-1 me-4"/>
                      Otras operaciones
                    </Link>
                  </li>
                </>
              )}

              <li className="nav-item mt-3">
                <button
                  className="btn btn-success w-100"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </button>
              </li>
            </ul>
            <img src={sc} className="img-fluid d-block mx-auto" alt="" />
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
