import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import EmployeeTasksForm from "./pages/EmployeeTasksForm";
import EmployeeTasksHistory from "./pages/EmployeeTasksHistory";
import PrivateRoute from "./components/PrivateRoute";
import AdminTasksForm from "./pages/AdminTasksForm";
import TaskControlPanel from "./pages/TaskControlPanel";
import UserStatsPanel from "./components/UserStatsPanel";
import AdminPanel from "./components/AdminPanel";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas protegidas que comparten Sidebar */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        >
          {/* Vista principal del dashboard, la lógica la maneja Dashboard.jsx */}
          <Route index element={<div />} />

          {/* Rutas del empleado */}
          <Route
            path="tasks/new"
            element={
              <PrivateRoute>
                <EmployeeTasksForm />
              </PrivateRoute>
            }
          />
          <Route
            path="tasks/history"
            element={
              <PrivateRoute>
                <EmployeeTasksHistory />
              </PrivateRoute>
            }
          />

          {/* Rutas del admin */}
          <Route
            path="admin"
            element={
              <PrivateRoute>
                <AdminPanel />
              </PrivateRoute>
            }
          />
          <Route
            path="admin/tasks/new"
            element={
              <PrivateRoute>
                <AdminTasksForm />
              </PrivateRoute>
            }
          />
          <Route
            path="otras-operaciones"
            element={
              <PrivateRoute>
                <TaskControlPanel />
              </PrivateRoute>
            }
          />
          <Route
            path="stats"
            element={
              <PrivateRoute>
                <UserStatsPanel />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
