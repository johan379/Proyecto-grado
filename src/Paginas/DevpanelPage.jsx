// Paginas/DevPanelPage.jsx
// Toda la lógica y estados van aquí.

import { useState, useMemo } from "react";
import DevPanel from "../Componentes/Devpanel";
import Footer from "../Componentes/Footer";

// ── TODO: conectar con base de datos ─────────────────────
// empresas, solicitudes y usuariosPorEmpresa vendrán del backend

const FORM_VACIO = {
  nombre: "", nit: "", sector: "", correo: "",
  telefono: "", ciudad: "", estado: "Activa", notas: "",
};

let nextId = 1;

export default function DevPanelPage() {
  // ── Estado ─────────────────────────────────────────────
  const [empresas, setEmpresas]       = useState([]);
  const [solicitudes, setSolicitudes] = useState([]);
  const [vistaActiva, setVistaActiva] = useState("empresas");

  // Búsquedas
  const [busquedaEmpresa, setBusquedaEmpresa]     = useState("");
  const [busquedaSolicitud, setBusquedaSolicitud] = useState("");

  // Empresa seleccionada (submódulo usuarios)
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);
  const [usuariosEmpresa, setUsuariosEmpresa]         = useState([]);

  // Contraseñas visibles
  const [passwordsVisibles, setPasswordsVisibles] = useState({});

  // Modal empresa
  const [modalAbierto, setModalAbierto]       = useState(false);
  const [empresaEditando, setEmpresaEditando] = useState(null);
  const [formEmpresa, setFormEmpresa]         = useState(FORM_VACIO);
  const [errorForm, setErrorForm]             = useState("");

  // ── Derivados ──────────────────────────────────────────
  const empresasFiltradas = useMemo(() => {
    const q = busquedaEmpresa.toLowerCase();
    if (!q) return empresas;
    return empresas.filter(
      (e) => e.nombre.toLowerCase().includes(q) || e.nit.toLowerCase().includes(q)
    );
  }, [empresas, busquedaEmpresa]);

  const solicitudesFiltradas = useMemo(() => {
    const q = busquedaSolicitud.toLowerCase();
    if (!q) return solicitudes;
    return solicitudes.filter(
      (s) => s.empresa.toLowerCase().includes(q) || s.correo.toLowerCase().includes(q)
    );
  }, [solicitudes, busquedaSolicitud]);

  const totalActivas     = useMemo(() => empresas.filter((e) => e.estado === "Activa").length, [empresas]);
  const totalSolicitudes = solicitudes.length;

  // ── Handlers: vista ───────────────────────────────────
  const handleCambiarVista = (vista) => {
    setVistaActiva(vista);
    if (vista !== "usuarios") {
      setEmpresaSeleccionada(null);
      setPasswordsVisibles({});
    }
  };

  // ── Handlers: ver usuarios de empresa ─────────────────
  const handleVerUsuarios = (empresa) => {
    setEmpresaSeleccionada(empresa);
    // TODO: cargar usuarios del backend por empresa.id
    setUsuariosEmpresa([]);
    setPasswordsVisibles({});
    setVistaActiva("usuarios");
  };

  const handleVolverEmpresas = () => {
    setVistaActiva("empresas");
    setEmpresaSeleccionada(null);
    setPasswordsVisibles({});
  };

  const handleTogglePassword = (userId) => {
    setPasswordsVisibles((prev) => ({ ...prev, [userId]: !prev[userId] }));
  };

  // ── Handlers: modal empresa ────────────────────────────
  const handleAbrirModalEmpresa = () => {
    setEmpresaEditando(null);
    setFormEmpresa(FORM_VACIO);
    setErrorForm("");
    setModalAbierto(true);
  };

  const handleEditarEmpresa = (empresa) => {
    setEmpresaEditando(empresa);
    setFormEmpresa({ ...empresa });
    setErrorForm("");
    setModalAbierto(true);
  };

  const handleCerrarModal = () => {
    setModalAbierto(false);
    setEmpresaEditando(null);
    setFormEmpresa(FORM_VACIO);
    setErrorForm("");
  };

  const handleFormEmpresaChange = (e) => {
    const { name, value } = e.target;
    setFormEmpresa((prev) => ({ ...prev, [name]: value }));
    if (errorForm) setErrorForm("");
  };

  const handleGuardarEmpresa = () => {
    const { nombre, nit, correo } = formEmpresa;
    if (!nombre.trim()) return setErrorForm("El nombre de la empresa es obligatorio.");
    if (!nit.trim())    return setErrorForm("El NIT es obligatorio.");
    if (!correo.trim()) return setErrorForm("El correo de contacto es obligatorio.");
    if (!/\S+@\S+\.\S+/.test(correo)) return setErrorForm("Ingresa un correo válido.");

    if (!empresaEditando) {
      const existe = empresas.find((e) => e.nit.replace(/\D/g, "") === nit.replace(/\D/g, ""));
      if (existe) return setErrorForm("Ya existe una empresa con ese NIT.");
    }

    const hoy = new Date().toISOString().split("T")[0];
    const nuevaEmpresa = {
      id: empresaEditando ? empresaEditando.id : nextId++,
      ...formEmpresa,
      nombre: formEmpresa.nombre.trim(),
      nit: formEmpresa.nit.trim(),
      correo: formEmpresa.correo.trim().toLowerCase(),
      cantidadUsuarios: empresaEditando ? empresaEditando.cantidadUsuarios : 0,
      fechaRegistro: empresaEditando ? empresaEditando.fechaRegistro : hoy,
    };

    if (empresaEditando) {
      setEmpresas((prev) => prev.map((e) => e.id === empresaEditando.id ? nuevaEmpresa : e));
    } else {
      setEmpresas((prev) => [...prev, nuevaEmpresa]);
    }
    handleCerrarModal();
  };

  const handleEliminarEmpresa = (id) => {
    if (!window.confirm("¿Eliminar esta empresa y todos sus datos?")) return;
    setEmpresas((prev) => prev.filter((e) => e.id !== id));
  };

  // ── Handlers: solicitudes ──────────────────────────────
  const handleAprobarSolicitud = (solicitud) => {
    setEmpresaEditando(null);
    setFormEmpresa({
      nombre: solicitud.empresa,
      nit: solicitud.nit || "",
      sector: "",
      correo: solicitud.correo,
      telefono: solicitud.telefono,
      ciudad: "",
      estado: "Activa",
      notas: solicitud.mensaje || "",
    });
    setErrorForm("");
    setModalAbierto(true);
    setSolicitudes((prev) => prev.filter((s) => s.id !== solicitud.id));
    setVistaActiva("empresas");
  };

  const handleRechazarSolicitud = (id) => {
    if (!window.confirm("¿Rechazar y eliminar esta solicitud?")) return;
    setSolicitudes((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div>
      <DevPanel
        // Vista
        vistaActiva={vistaActiva}
        onCambiarVista={handleCambiarVista}
        // Empresas
        empresas={empresasFiltradas}
        busquedaEmpresa={busquedaEmpresa}
        onBuscarEmpresa={setBusquedaEmpresa}
        onVerUsuarios={handleVerUsuarios}
        onAbrirModalEmpresa={handleAbrirModalEmpresa}
        onEditarEmpresa={handleEditarEmpresa}
        onEliminarEmpresa={handleEliminarEmpresa}
        // Solicitudes
        solicitudes={solicitudesFiltradas}
        busquedaSolicitud={busquedaSolicitud}
        onBuscarSolicitud={setBusquedaSolicitud}
        onAprobarSolicitud={handleAprobarSolicitud}
        onRechazarSolicitud={handleRechazarSolicitud}
        // Usuarios de empresa
        empresaSeleccionada={empresaSeleccionada}
        usuariosEmpresa={usuariosEmpresa}
        onVolverEmpresas={handleVolverEmpresas}
        passwordsVisibles={passwordsVisibles}
        onTogglePassword={handleTogglePassword}
        // Stats
        totalEmpresas={empresas.length}
        totalActivas={totalActivas}
        totalSolicitudes={totalSolicitudes}
        // Modal empresa
        modalAbierto={modalAbierto}
        empresaEditando={empresaEditando}
        formEmpresa={formEmpresa}
        errorForm={errorForm}
        onCerrarModal={handleCerrarModal}
        onFormEmpresaChange={handleFormEmpresaChange}
        onGuardarEmpresa={handleGuardarEmpresa}
      />
      <Footer />
    </div>
  );
}