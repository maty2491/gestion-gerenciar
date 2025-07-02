// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { auth, db } from "../services/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import UserPanel from "../components/UserPanel";
import AdminPanel from "../components/AdminPanel"; // Importá este componente o crealo

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
    <div className="container mt-5">
      <h2>Dashboard</h2>
      {user && userData && (
        <div>
          <p>Bienvenido, {userData.nombre}</p>
          <p>Email: {user.email}</p>
          <p>Rol: {userData.role}</p>

          {userData.role === "admin" ? <AdminPanel /> : <UserPanel />}

          <button className="btn btn-danger mt-3" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
