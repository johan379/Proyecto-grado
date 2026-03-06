import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegistroPage from '../Paginas/RegistroPage';
import InicioSesionPage from '../Paginas/FinicioPage';
import InicioPage from '../Paginas/InicioPage';
const App = () => (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<InicioPage />} />
        <Route path="/Registro" element={<RegistroPage />} />
        <Route path="/Inicio" element={<InicioSesionPage />} />
      </Routes>
    </BrowserRouter>
);
    export default App;