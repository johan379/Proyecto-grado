import { useState } from "react";
import Registro from "../Componentes/Registro";
import Footer from "../Componentes/Footer";

export default function RegistroPage() {
  const [Nombre, setNombre] = useState('');
  const [Telefono, setTelefono] = useState('');
  const [Correo, setCorreo] = useState('');
  const [Codigo, setCodigo] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = { Nom: Nombre, Tel: Telefono, Cor: Correo, Codi: Codigo };

    try {
      const res = await fetch('http://localhost:8000/crear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      if (res.ok) {
        const resData = await res.json();
        alert(resData.message);
        setCorreo('');
        setNombre('');
        setTelefono('');
        setCodigo('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page-container">
      <Registro
        handleSubmit={handleSubmit}
        setNombre={setNombre}
        setTelefono={setTelefono}
        setCorreo={setCorreo}
        setCodigo={setCodigo}
      />
    <Footer />
    </div>
    
  );
}