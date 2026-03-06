import { useState } from "react";
import Finicio from "../Componentes/Finicio";
import Footer from "../Componentes/Footer";

export default function InicioSesionPage() {
  const [form, setForm] = useState({
    correo: "",
    contrasena: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { Cor: form.correo, Con: form.contrasena };

    try {
      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        const resData = await res.json();
        alert(resData.message);
        setForm({ correo: "", contrasena: "" });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-container">
      <Finicio
        handleSubmit={handleSubmit}
        form={form}
        handleChange={handleChange}
      />
      <Footer />
    </div>
  );
}