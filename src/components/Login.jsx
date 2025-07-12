import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { useNavigate, Link } from "react-router-dom";
import sc from "../assets/ger.png"

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    // Agregamos dominio falso
    const fakeEmail = `${username}@gerenciar.com`;

    try {
      await signInWithEmailAndPassword(auth, fakeEmail, password);
      navigate("/dashboard");
    } catch (error) {
      setError("USUARIO O CONTRASEÑA INVÁLIDO");
    }
  };

  return (
    <div className="container mt-5">
       
      <h2 className="text-center mb-3">GESTION DE TAREAS</h2>
      <hr />
      <div className="row">
        <div className="col-lg-4"></div>
        <div className="col-lg-4">
          
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}
          <div className="card shadow-lg">
            <div className="card-body">
              <h2 className="text-center mb-4">Iniciar Sesión</h2>
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Nombre de usuario"
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
                    placeholder="Contraseña"
                  />
                </div>
                <div className="d-grid gap-2 col-12 mx-auto">
                  <button type="submit" className="btn btn-success">
                    Ingresar
                  </button>
                </div>
              </form>
             
            </div>
          </div>
            
          {/* <p className="mt-4">
            ¿No tenés usuario? <Link to="/register">Create uno acá</Link>
          </p> */}
        </div>
      </div>
      
      <div className="text-center">
      <img src={sc} className="img-fluid mt-4" width={250} alt="" />

      </div>
      
    </div>
    
  );
};

export default Login;
