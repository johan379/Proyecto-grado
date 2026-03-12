// Pages/AdminUsuariosPage.jsx
// Toda la lógica y estados van aquí.

import { useState, useMemo } from "react";
import AdminUsuarios from "../Componentes/AdminUsuarios";
import Footer from "../Componentes/Footer";

// ── Datos de ejemplo ─────────────────────────────────────
// Reemplaza con tu API/backend
const USUARIOS_INICIALES = [
  { id: 1, nombre: "Carlos Mendoza",  correo: "carlos@lukysystem.com",  rol: "Administrador", activo: true,  fechaRegistro: "2024-01-15" },
  { id: 2, nombre: "Laura Gómez",     correo: "laura@lukysystem.com",   rol: "Vendedor",      activo: true,  fechaRegistro: "2024-03-02" },
  { id: 3, nombre: "Andrés Pérez",    correo: "andres@lukysystem.com",  rol: "Vendedor",      activo: false, fechaRegistro: "2024-05-20" },
  { id: 4, nombre: "María Torres",    correo: "maria@lukysystem.com",   rol: "Vendedor",      activo: true,  fechaRegistro: "2024-07-11" },
];

const FORM_VACIO = {
  nombre: "", correo: "", rol: "",
  contrasena: "", confirmarContrasena: "", activo: "true",
};

let nextId = USUARIOS_INICIALES.length + 1;

export default function AdminUsuariosPage() {
  // ── Estado ─────────────────────────────────────────────
  const [usuarios, setUsuarios]         = useState(USUARIOS_INICIALES);
  const [busqueda, setBusqueda]         = useState("");
  const [filtroRol, setFiltroRol]       = useState("Todos");

  // Modal crear / editar
  const [modalAbierto, setModalAbierto]           = useState(false);
  const [usuarioEditando, setUsuarioEditando]     = useState(null);
  const [formUsuario, setFormUsuario]             = useState(FORM_VACIO);
  const [errorForm, setErrorForm]                 = useState("");

  // Modal confirmar eliminar
  const [modalEliminarAbierto, setModalEliminarAbierto] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar]         = useState(null);

  // ── Derivados ──────────────────────────────────────────
  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter((u) => {
      const matchRol = filtroRol === "Todos" || u.rol === filtroRol;
      const q = busqueda.toLowerCase();
      const matchQ = !q || u.nombre.toLowerCase().includes(q) || u.correo.toLowerCase().includes(q);
      return matchRol && matchQ;
    });
  }, [usuarios, filtroRol, busqueda]);

  const totalAdmins    = useMemo(() => usuarios.filter((u) => u.rol === "Administrador").length, [usuarios]);
  const totalVendedores = useMemo(() => usuarios.filter((u) => u.rol === "Vendedor").length, [usuarios]);

  // ── Handlers: modal crear / editar ────────────────────
  const handleAbrirModalAgregar = () => {
    setUsuarioEditando(null);
    setFormUsuario(FORM_VACIO);
    setErrorForm("");
    setModalAbierto(true);
  };

  const handleAbrirModalEditar = (usuario) => {
    setUsuarioEditando(usuario);
    setFormUsuario({
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol,
      activo: String(usuario.activo),
      contrasena: "",
      confirmarContrasena: "",
    });
    setErrorForm("");
    setModalAbierto(true);
  };

  const handleCerrarModal = () => {
    setModalAbierto(false);
    setUsuarioEditando(null);
    setFormUsuario(FORM_VACIO);
    setErrorForm("");
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormUsuario((prev) => ({ ...prev, [name]: value }));
    if (errorForm) setErrorForm("");
  };

  const handleGuardar = () => {
    const { nombre, correo, rol, contrasena, confirmarContrasena, activo } = formUsuario;

    // Validaciones
    if (!nombre.trim())  return setErrorForm("El nombre es obligatorio.");
    if (!correo.trim())  return setErrorForm("El correo es obligatorio.");
    if (!/\S+@\S+\.\S+/.test(correo)) return setErrorForm("Ingresa un correo válido.");
    if (!rol)            return setErrorForm("Selecciona un rol.");

    // Solo al crear se valida contraseña
    if (!usuarioEditando) {
      if (!contrasena) return setErrorForm("La contraseña es obligatoria.");
      if (contrasena.length < 8) return setErrorForm("La contraseña debe tener al menos 8 caracteres.");
      if (contrasena !== confirmarContrasena) return setErrorForm("Las contraseñas no coinciden.");

      // Verificar correo duplicado
      const existe = usuarios.find((u) => u.correo.toLowerCase() === correo.toLowerCase());
      if (existe) return setErrorForm("Ya existe un usuario con ese correo.");
    }

    const hoy = new Date().toISOString().split("T")[0];

    const usuarioNuevo = {
      id: usuarioEditando ? usuarioEditando.id : nextId++,
      nombre: nombre.trim(),
      correo: correo.trim().toLowerCase(),
      rol,
      activo: activo === "true",
      fechaRegistro: usuarioEditando ? usuarioEditando.fechaRegistro : hoy,
    };

    if (usuarioEditando) {
      setUsuarios((prev) => prev.map((u) => u.id === usuarioEditando.id ? usuarioNuevo : u));
    } else {
      setUsuarios((prev) => [...prev, usuarioNuevo]);
    }

    handleCerrarModal();
  };

  // ── Handlers: eliminar ─────────────────────────────────
  const handleAbrirConfirmarEliminar = (usuario) => {
    setUsuarioAEliminar(usuario);
    setModalEliminarAbierto(true);
  };

  const handleCerrarConfirmarEliminar = () => {
    setModalEliminarAbierto(false);
    setUsuarioAEliminar(null);
  };

  const handleConfirmarEliminar = () => {
    setUsuarios((prev) => prev.filter((u) => u.id !== usuarioAEliminar.id));
    handleCerrarConfirmarEliminar();
  };

  return (
    <div>
      <AdminUsuarios
        // Datos
        usuarios={usuariosFiltrados}
        busqueda={busqueda}
        filtroRol={filtroRol}
        totalUsuarios={usuarios.length}
        totalAdmins={totalAdmins}
        totalVendedores={totalVendedores}
        // Modal crear/editar
        modalAbierto={modalAbierto}
        usuarioEditando={usuarioEditando}
        formUsuario={formUsuario}
        errorForm={errorForm}
        // Modal eliminar
        modalEliminarAbierto={modalEliminarAbierto}
        usuarioAEliminar={usuarioAEliminar}
        // Handlers
        onBuscar={setBusqueda}
        onFiltroRolChange={setFiltroRol}
        onAbrirModalAgregar={handleAbrirModalAgregar}
        onAbrirModalEditar={handleAbrirModalEditar}
        onCerrarModal={handleCerrarModal}
        onFormChange={handleFormChange}
        onGuardar={handleGuardar}
        onAbrirConfirmarEliminar={handleAbrirConfirmarEliminar}
        onCerrarConfirmarEliminar={handleCerrarConfirmarEliminar}
        onConfirmarEliminar={handleConfirmarEliminar}
      />
      <Footer />
    </div>
  );
}