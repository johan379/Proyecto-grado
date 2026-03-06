import React from "react";
import "../style/Registro.css";

export default function Finicio({ handleSubmit, form, handleChange }) {
  return (
    <div className="registro-container">
      <h1 className="registro-titulo">Inicio de Sesión</h1>
      <form onSubmit={handleSubmit} className="registro-form">

        <div className="campo">
          <label htmlFor="Cor" className="registro-label">Correo</label>
          <input
            type="email"
            name="correo"
            id="Cor"
            className="registro-input"
            placeholder="Ingresa tu correo"
            value={form.correo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="Con" className="registro-label">Contraseña</label>
          <input
            type="password"
            name="contrasena"
            id="Con"
            className="registro-input"
            placeholder="Ingresa tu contraseña"
            value={form.contrasena}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="registro-btn">Iniciar Sesión</button>
      </form>
    </div>
  );
}