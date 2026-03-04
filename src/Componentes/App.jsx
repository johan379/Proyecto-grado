import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegistroPage from '../Paginas/RegistroPage';
const App = () => (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RegistroPage />} />
      </Routes>
    </BrowserRouter>
);
    export default App;