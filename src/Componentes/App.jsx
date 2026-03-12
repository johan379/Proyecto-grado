import { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegistroPage from '../Paginas/RegistroPage';
import InicioSesionPage from '../Paginas/FinicioPage';
import InicioPage from '../Paginas/InicioPage';
import InventarioPage from '../Paginas/InventarioPage';
import AdminUsuariosPage from '../Paginas/AdminUsuarioPage';
import AdminDocumentosPage from '../Paginas/AdminDocuentosPage';

const App = () => {
  // ── Usuario logueado ──────────────────────────────────
  // null = no ha iniciado sesión
  // { nombre, correo, rol } = sesión activa
  const [usuarioActual, setUsuarioActual] = useState(null);

  // Llama esto cuando el login sea exitoso, pasándole el usuario
  const handleLogin = (usuario) => {
    setUsuarioActual(usuario);
  };

  // Llama esto al cerrar sesión
  const handleLogout = () => {
    setUsuarioActual(null);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"               element={<InicioPage />} />
        <Route path="/Registro"       element={<RegistroPage />} />
        <Route path="/Inicio"         element={<InicioSesionPage onLogin={handleLogin} />} />
        <Route path="/Inventario"     element={<InventarioPage usuarioActual={usuarioActual} />} />
        <Route path="/AdminUsuario"   element={<AdminUsuariosPage usuarioActual={usuarioActual} />} />
        <Route path="/AdminDocumentos" element={<AdminDocumentosPage usuarioActual={usuarioActual} />} />
        
      </Routes>
    </BrowserRouter>
  );
};

export default App;