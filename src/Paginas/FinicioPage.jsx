// Paginas/FinicioPage.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Finicio from "../Componentes/Finicio";
import Footer from "../Componentes/Footer";

export default function InicioSesionPage({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ correo: "", contrasena: "", rol: "Administrador" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // ── SIMULACIÓN TEMPORAL ──────────────────────────────
    // Quitar el select de rol en Finicio.jsx y este bloque
    // cuando el backend esté listo
    onLogin({
      nombre: "Usuario Prueba",
      correo: form.correo,
      rol: form.rol,
    });
    navigate("/Inventario");

    // ── BACKEND REAL (descomentar cuando esté listo) ─────
    // const res = await fetch("http://localhost:8000/login", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({ Cor: form.correo, Con: form.contrasena }),
    // });
    // if (res.ok) {
    //   const data = await res.json();
    //   onLogin({ nombre: data.nombre, correo: data.correo, rol: data.rol });
    //   navigate("/Inventario");
    // }
  };

  return (
    <div className="page-container">
      <div className="content-wrapper">
        <Finicio
          handleSubmit={handleSubmit}
          form={form}
          handleChange={handleChange}
          // TODO: quitar esta prop cuando el backend esté listo
          mostrarSelectRol={true}
        />
      </div>
    </div>
  );
}