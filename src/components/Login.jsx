import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    // Expresión simple para email válido
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async (e) => {
  e.preventDefault();
  setError(null);

  if (!validateEmail(email)) {
    setError("Por favor ingrese un email válido");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);
    navigate("/dashboard");
  } catch (error) {
    setError("USUARIO O CONTRASEÑA INVÁLIDO");
  }
};

  return (
    <div className="container mt-5">
          <h2 className="text-center mb-5">Sistema de control y productividad</h2>
      <div className="row">
        <div className="col-lg-4"></div>
        <div className="col-lg-4">
      
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <div className="card">
        <div className="card-body">
          <h2 className="text-center mb-4">Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingresá tu Email"
            required
          />
        </div>
        <div className="mb-4">
          
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Ingresá tu contraseña"
          />
        </div>
        <div class="d-grid gap-2 col-12 mx-auto">
        <button type="submit" className="btn btn-success">
          Ingresar
        </button>
        </div>
      </form>
      </div>
      </div>
      <p className="mt-4">
        ¿No tenés usuario? <Link to="/register">Create uno acá</Link>
      </p>
    </div>
    </div>
    </div>
  );
};

export default Login;
