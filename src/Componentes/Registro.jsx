// Componentes/Registro.jsx
// Solo JSX. Sin lógica ni estados.

import React from "react";
import "../style/Registro.css";
import { Link } from "react-router-dom";

export default function Registro({ handleSubmit, form, handleChange }) {
  return (
    <div className="registro-container">
      <h1 className="registro-titulo">Registro</h1>
      <form onSubmit={handleSubmit} className="registro-form">

        <div className="campo">
          <label htmlFor="NomNegocio" className="registro-label">Nombre del negocio</label>
          <input
            type="text"
            name="nombreNegocio"
            id="NomNegocio"
            className="registro-input"
            placeholder="Ingresa el nombre del negocio"
            value={form.nombreNegocio || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="Nom" className="registro-label">Nombre usuario</label>
          <input
            type="text"
            name="nombre"
            id="Nom"
            className="registro-input"
            placeholder="Ingresa tu nombre"
            value={form.nombre || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="Codi" className="registro-label">Código de empresa</label>
          <input
            type="text"
            name="codigo"
            id="Codi"
            className="registro-input"
            placeholder="Ingresa el código de empresa"
            value={form.codigo || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="Tel" className="registro-label">Teléfono</label>
          <input
            type="text"
            name="telefono"
            id="Tel"
            className="registro-input"
            placeholder="Ingresa tu teléfono"
            value={form.telefono || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="Cor" className="registro-label">Correo</label>
          <input
            type="email"
            name="correo"
            id="Cor"
            className="registro-input"
            placeholder="Ingresa tu correo"
            value={form.correo || ""}
            onChange={handleChange}
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="ciudad" className="registro-label">Ciudad</label>
          <select
            id="ciudad"
            name="ciudad"
            className="registro-input"
            value={form.ciudad || ""}
            onChange={handleChange}
            required
          >
            <option value="">Seleccione una ciudad</option>
            <option value="Bogotá">Bogotá</option>
            <option value="Medellín">Medellín</option>
            <option value="Cali">Cali</option>
            <option value="Barranquilla">Barranquilla</option>
            <option value="Cartagena">Cartagena</option>
            <option value="Bucaramanga">Bucaramanga</option>
            <option value="Pereira">Pereira</option>
            <option value="Santa Marta">Santa Marta</option>
            <option value="Cúcuta">Cúcuta</option>
            <option value="Manizales">Manizales</option>
          </select>
        </div>

        

        <button type="submit" className="registro-btn">Enviar</button>
      </form>

      <p className="registro-footer">
        ¿Ya tienes una cuenta?{" "}
        <Link to="/Inicio" className="registro-link">Inicia sesión</Link>
      </p>
    </div>
  );
}