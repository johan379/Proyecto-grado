import React from "react";
import "../style/Registro.css";

export default function Registro({ handleSubmit, form, handleChange }) {
  return (
    <div className="registro-container">
      <h1 className="registro-titulo">Registro</h1>
      <form onSubmit={handleSubmit} className="registro-form">

        <div className="campo">
          <label htmlFor="Nom" className="registro-label">Nombre</label>
          <input
            type="text"
            name="nombre"
            id="Nom"
            className="registro-input"
            placeholder="Ingresa tu nombre"
            value={form.nombre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="Tel" className="registro-label">Telefono</label>
          <input
            type="text"
            name="telefono"
            id="Tel"
            className="registro-input"
            placeholder="Ingresa tu teléfono"
            value={form.telefono}
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
            value={form.correo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="Codi" className="registro-label">Codigo de empresa</label>
          <input
            type="text"
            name="codigo"
            id="Codi"
            className="registro-input"
            placeholder="Ingresa el codigo de empresa"
            value={form.codigo}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="registro-btn">Enviar</button>
      </form>
    </div>
  );
}