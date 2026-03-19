import { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegistroPage from '../Paginas/RegistroPage';
import InicioSesionPage from '../Paginas/FinicioPage';
import InicioPage from '../Paginas/InicioPage';
import InventarioPage from '../Paginas/InventarioPage';
import AdminUsuariosPage from '../Paginas/AdminUsuarioPage';
import AdminDocumentosPage from '../Paginas/AdminDocuentosPage';
import Recuperarcontra from '../Paginas/Pagerecuperarcontra';
import DevPanelPage from '../Paginas/DevpanelPage';

const App = () => {
  
  const [usuarioActual, setUsuarioActual] = useState(null);


  const handleLogin = (usuario) => {
    setUsuarioActual(usuario);
  };

  
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
        <Route path="/Recuperar" element={<Recuperarcontra usuarioActual={usuarioActual} />} />
        <Route path="/dev" element={<DevPanelPage />} />

      </Routes>
    </BrowserRouter>
  );
};

export default App;