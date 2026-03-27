// Paginas/RegistroPage.jsx

import { useState } from "react";
import Registro from "../Componentes/Registro";
import Footer from "../Componentes/Footer";

export default function RegistroPage() {
  const [form, setForm] = useState({
    nombreNegocio: "",
    nombre: "",
    telefono: "",
    correo: "",
    ciudad: "",
    codigo: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      NomNegocio: form.nombreNegocio,
      Nom:        form.nombre,
      Tel:        form.telefono,
      Cor:        form.correo,
      Ciudad:     form.ciudad,
      Codi:       form.codigo,
    };

    try {
      const res = await fetch("http://localhost:8000/crear", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        const resData = await res.json();
        alert(resData.message);
        setForm({ nombreNegocio: "", nombre: "", telefono: "", correo: "", ciudad: "", codigo: "" });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-container">
      <div className="content-wrapper">
        <Registro
          handleSubmit={handleSubmit}
          form={form}
          handleChange={handleChange}
        />
      </div>
    </div>
  );
}