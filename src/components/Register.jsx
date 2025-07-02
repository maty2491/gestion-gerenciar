// src/components/Register.jsx
import React, { useState } from "react";
import { auth, db } from "../services/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const navigate = useNavigate();

  const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const handleRegister = async (e) => {
  e.preventDefault();
  setError(null);

  if (!validateEmail(email)) {
    setError("Por favor ingrese un email válido");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await setDoc(doc(db, "usuarios", user.uid), {
      nombre,
      email,
      role: "empleado",
      createdAt: new Date()
    });

    navigate("/dashboard");
  } catch (error) {
    setError("Error al registrar usuario");
  }
};

const [error, setError] = useState(null);

  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col-lg-4"></div>
        <div className="col-lg-4">
          <h2 className="mb-4 text-center">Registro de Usuario</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="card shadow-lg mb-4">
          <div className="card-body">
           <h4 className="text-center mb-4">Ingrese sus datos</h4>          
          <form onSubmit={handleRegister}>
            <div className="mb-4">              
              <input
                type="text"
                className="form-control"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre de usuario"
                required
              />
            </div>
            <div className="mb-4">
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
            </div>
            <div className="mb-4">              
              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña"
                required
              />
            </div>
            <div class="d-grid gap-2 col-12 mx-auto">
            <button type="submit" className="btn btn-success">
              Registrarse
            </button>
            <button type="/" className="btn btn-secondary">
              Volver
            </button>
            </div>
          </form>
          </div>
          </div>
        </div>
        <div className="col-lg-4"></div>
      </div>
    </div>
  );
};

export default Register;
