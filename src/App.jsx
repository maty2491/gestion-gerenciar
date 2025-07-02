// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import EmployeeTasksForm from "./pages/EmployeeTasksForm";
import EmployeeTasksHistory from "./pages/EmployeeTasksHistory";
import PrivateRoute from "./components/PrivateRoute";
import AdminTasksForm from "./pages/AdminTasksForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/tasks/new" element={<AdminTasksForm />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/tasks/new"
          element={
            <PrivateRoute>
              <EmployeeTasksForm />
            </PrivateRoute>
          }
        />

        <Route
          path="/tasks/history"
          element={
            <PrivateRoute>
              <EmployeeTasksHistory />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
