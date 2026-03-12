import { useState, useMemo } from "react";
import AdminDocumentos from "../Componentes/AdminDocumentos";
import Footer from "../Componentes/Footer";

// ── Datos de ejemplo ─────────────────────────────────────
const DOCUMENTOS_INICIALES = [
  { id: 1, nombre: "Factura Proveedor TechCorp Enero",  tipo: "Factura",  fecha: "2025-01-10", size: "245 KB", descripcion: "Compra de insumos de oficina" },
  { id: 2, nombre: "Recibo Arriendo Febrero",            tipo: "Recibo",   fecha: "2025-02-01", size: "89 KB",  descripcion: "" },
  { id: 3, nombre: "Contrato Servicios Asesoría Legal",  tipo: "Contrato", fecha: "2025-01-20", size: "1.2 MB", descripcion: "Contrato anual 2025" },
  { id: 4, nombre: "Factura Venta Cliente ABC",          tipo: "Factura",  fecha: "2025-02-14", size: "178 KB", descripcion: "Venta productos marzo" },
  { id: 5, nombre: "Factura Servicios Internet",         tipo: "Factura",  fecha: "2025-03-01", size: "95 KB",  descripcion: "" },
];

const FORM_VACIO = { nombre: "", tipo: "", fecha: "", descripcion: "" };

let nextId = DOCUMENTOS_INICIALES.length + 1;

// ── Utilidad tamaño simulado ─────────────────────────────
function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminDocumentosPage() {
  // ── Estado ─────────────────────────────────────────────
  const [documentos, setDocumentos] = useState(DOCUMENTOS_INICIALES);
  const [busqueda, setBusqueda]     = useState("");
  const [filtroTipo, setFiltroTipo] = useState("Todos");

  // Modal subir
  const [modalAbierto, setModalAbierto] = useState(false);
  const [formDoc, setFormDoc]           = useState(FORM_VACIO);
  const [archivo, setArchivo]           = useState(null);
  const [archivoNombre, setArchivoNombre] = useState("");
  const [errorForm, setErrorForm]       = useState("");

  // ── Derivados ──────────────────────────────────────────
  const documentosFiltrados = useMemo(() => {
    return documentos.filter((d) => {
      const matchTipo = filtroTipo === "Todos" || d.tipo === filtroTipo;
      const q = busqueda.toLowerCase();
      const matchQ = !q || d.nombre.toLowerCase().includes(q) || d.tipo.toLowerCase().includes(q);
      return matchTipo && matchQ;
    });
  }, [documentos, filtroTipo, busqueda]);

  const totalFacturas = useMemo(() => documentos.filter((d) => d.tipo === "Factura").length, [documentos]);

  // Tamaño total simulado (en producción vendría del backend)
  const totalSize = `${documentos.length * 0.3 + 0.5} MB`;

  // ── Handlers: modal ────────────────────────────────────
  const handleAbrirModal = () => {
    setFormDoc({ ...FORM_VACIO, fecha: new Date().toISOString().split("T")[0] });
    setArchivo(null);
    setArchivoNombre("");
    setErrorForm("");
    setModalAbierto(true);
  };

  const handleCerrarModal = () => {
    setModalAbierto(false);
    setFormDoc(FORM_VACIO);
    setArchivo(null);
    setArchivoNombre("");
    setErrorForm("");
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormDoc((prev) => ({ ...prev, [name]: value }));
    if (errorForm) setErrorForm("");
  };

  const handleArchivoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setArchivo(file);
    setArchivoNombre(file.name);
    // Auto-rellenar nombre si está vacío
    if (!formDoc.nombre) {
      setFormDoc((prev) => ({ ...prev, nombre: file.name.replace(/\.[^/.]+$/, "") }));
    }
    if (errorForm) setErrorForm("");
  };

  const handleSubir = () => {
    const { nombre, tipo, fecha } = formDoc;

    // Validaciones
    if (!nombre.trim()) return setErrorForm("El nombre del documento es obligatorio.");
    if (!tipo)          return setErrorForm("Selecciona el tipo de documento.");
    if (!archivo)       return setErrorForm("Selecciona un archivo para subir.");

    const nuevoDoc = {
      id: nextId++,
      nombre: nombre.trim(),
      tipo,
      fecha: fecha || new Date().toISOString().split("T")[0],
      size: formatSize(archivo.size),
      descripcion: formDoc.descripcion?.trim() || "",
      // En producción aquí guardarías la URL retornada por tu backend/storage
      archivoUrl: URL.createObjectURL(archivo),
    };

    setDocumentos((prev) => [nuevoDoc, ...prev]);
    handleCerrarModal();
  };

  // ── Handlers: descargar / eliminar ─────────────────────
  const handleDescargar = (doc) => {
    // En producción usa doc.archivoUrl del backend
    if (doc.archivoUrl) {
      const a = document.createElement("a");
      a.href = doc.archivoUrl;
      a.download = doc.nombre;
      a.click();
    } else {
      alert(`Descarga simulada: ${doc.nombre}`);
    }
  };

  const handleEliminar = (id) => {
    if (!window.confirm("¿Eliminar este documento?")) return;
    setDocumentos((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div>
      <AdminDocumentos
        // Datos
        documentos={documentosFiltrados}
        busqueda={busqueda}
        filtroTipo={filtroTipo}
        totalDocs={documentos.length}
        totalFacturas={totalFacturas}
        totalSize={totalSize}
        // Modal
        modalAbierto={modalAbierto}
        formDoc={formDoc}
        errorForm={errorForm}
        archivoNombre={archivoNombre}
        // Handlers
        onBuscar={setBusqueda}
        onFiltroTipoChange={setFiltroTipo}
        onAbrirModal={handleAbrirModal}
        onCerrarModal={handleCerrarModal}
        onFormChange={handleFormChange}
        onArchivoChange={handleArchivoChange}
        onSubir={handleSubir}
        onDescargar={handleDescargar}
        onEliminar={handleEliminar}
      />
      <Footer />
    </div>
  );
}