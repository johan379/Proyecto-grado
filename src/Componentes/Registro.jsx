import React from "react";
import "../style/Registro.css"; 



export default function Registro({ handleSubmit, setNombre, setTelefono, setCorreo, setC }) {
  return (
    
    <div className="registro-container">
      <h1 className="registro-titulo">Registro</h1>
      <form onSubmit={handleSubmit} className="registro-form">
        
        <label htmlFor="Nom" className="registro-label">Nombre</label>
        <input
          type="text"
          name="Nom"
          id="Nom"
          className="registro-input"
          placeholder="Ingresa tu nombre"
          onChange={(e) => setNombre(e.target.value)}
          required
        />

        <label htmlFor="Tel" className="registro-label">Telefono</label>
        <input
          type="text"
          name="Tel"
          id="Tel"
          className="registro-input"
          placeholder="Ingresa tu teléfono"
          onChange={(e) => setTelefono(e.target.value)}
          required
        />

        <label htmlFor="Cor" className="registro-label">Correo</label>
        <input
          type="email"
          name="Cor"
          id="Cor"
          className="registro-input"
          placeholder="Ingresa tu correo"
          onChange={(e) => setCorreo(e.target.value)}
          required
        />

        <label htmlFor="Codi" className="registro-label">Codigo de empresa</label>
        <input
            type="text"
            name="Codi"
            id="Codi"
            className="registro-input"
            placeholder="Ingresa el codigo de empresa"
            onChange={(e) => setCodigo(e.target.value)}
            required
          />

        <button type="submit" className="botton">Enviar</button>
      </form>
    </div>
    
  );
}