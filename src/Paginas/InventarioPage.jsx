// Pages/InventarioPage.jsx
// Toda la lógica, estados y handlers van aquí.

import { useState, useMemo } from "react";
import Inventario from "../Componentes/Inventario";
import Footer from "../Componentes/Footer";

// ── Datos iniciales de ejemplo ──────────────────────────
// Reemplaza esto con llamadas a tu API/backend
const DATOS_INICIALES = [
 
];

// ── Formulario vacío ────────────────────────────────────
const FORM_VACIO = {
  codigo: "", nombre: "", categoria: "",
  stock: "", stockMinimo: "", precio: "", descripcion: "",
};

const FORM_VENTA_VACIO = { cantidad: "", precioVenta: "", cliente: "" };

// ── Utilidades ──────────────────────────────────────────
let nextId = DATOS_INICIALES.length + 1;

export default function InventarioPage({ usuarioActual }) {
  // ── Permisos ──────────────────────────────────────────
  const esAdmin = usuarioActual?.rol === "Administrador";

  // ── Estado principal ──────────────────────────────────
  const [productos, setProductos]         = useState(DATOS_INICIALES);
  const [categoriaActiva, setCategoria]   = useState("Todos");
  const [busqueda, setBusqueda]           = useState("");

  // ── Modal producto ────────────────────────────────────
  const [modalAbierto, setModalAbierto]         = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [formProducto, setFormProducto]         = useState(FORM_VACIO);
  const [errorForm, setErrorForm]               = useState("");

  // ── Modal venta ───────────────────────────────────────
  const [modalVentaAbierto, setModalVentaAbierto] = useState(false);
  const [productoVenta, setProductoVenta]         = useState(null);
  const [formVenta, setFormVenta]                 = useState(FORM_VENTA_VACIO);
  const [errorVenta, setErrorVenta]               = useState("");

  // ── Panel alertas ─────────────────────────────────────
  const [alertasVisible, setAlertasVisible] = useState(false);

  // ── Derivados ─────────────────────────────────────────
  const categorias = useMemo(() => {
    const set = new Set(productos.map((p) => p.categoria));
    return [...set].sort();
  }, [productos]);

  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
      const matchCat = categoriaActiva === "Todos" || p.categoria === categoriaActiva;
      const q = busqueda.toLowerCase();
      const matchQ = !q || p.nombre.toLowerCase().includes(q) || p.codigo.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [productos, categoriaActiva, busqueda]);

  const stockBajoCount  = useMemo(() => productos.filter((p) => p.stock <= p.stockMinimo).length, [productos]);
  const alertasStockBajo = useMemo(() => productos.filter((p) => p.stock <= p.stockMinimo), [productos]);
  const valorTotal       = useMemo(() => productos.reduce((acc, p) => acc + p.precio * p.stock, 0), [productos]);

  // ── Handlers: modal producto ──────────────────────────
  const handleAbrirModalAgregar = () => {
    setProductoEditando(null);
    setFormProducto(FORM_VACIO);
    setErrorForm("");
    setModalAbierto(true);
  };

  const handleAbrirModalEditar = (producto) => {
    setProductoEditando(producto);
    setFormProducto({ ...producto });
    setErrorForm("");
    setModalAbierto(true);
  };

  const handleCerrarModal = () => {
    setModalAbierto(false);
    setProductoEditando(null);
    setFormProducto(FORM_VACIO);
    setErrorForm("");
  };

  const handleFormProductoChange = (e) => {
    const { name, value } = e.target;
    setFormProducto((prev) => ({ ...prev, [name]: value }));
    if (errorForm) setErrorForm("");
  };

  const handleGuardarProducto = () => {
    const { codigo, nombre, categoria, stock, stockMinimo, precio } = formProducto;

    // Validaciones
    if (!codigo.trim())    return setErrorForm("El código es obligatorio.");
    if (!nombre.trim())    return setErrorForm("El nombre es obligatorio.");
    if (!categoria.trim()) return setErrorForm("La categoría es obligatoria.");
    if (stock === "" || isNaN(Number(stock)))         return setErrorForm("Ingresa un stock válido.");
    if (stockMinimo === "" || isNaN(Number(stockMinimo))) return setErrorForm("Ingresa un stock mínimo válido.");
    if (precio === "" || isNaN(Number(precio)))       return setErrorForm("Ingresa un precio válido.");

    // Verificar código duplicado (solo al crear)
    if (!productoEditando) {
      const existe = productos.find((p) => p.codigo.toLowerCase() === codigo.toLowerCase());
      if (existe) return setErrorForm("Ya existe un producto con ese código.");
    }

    const productoNuevo = {
      id: productoEditando ? productoEditando.id : nextId++,
      codigo:      codigo.trim(),
      nombre:      nombre.trim(),
      categoria:   categoria.trim(),
      stock:       Number(stock),
      stockMinimo: Number(stockMinimo),
      precio:      Number(precio),
      descripcion: formProducto.descripcion?.trim() || "",
    };

    if (productoEditando) {
      setProductos((prev) => prev.map((p) => p.id === productoEditando.id ? productoNuevo : p));
    } else {
      setProductos((prev) => [...prev, productoNuevo]);
    }

    handleCerrarModal();
  };

  const handleEliminarProducto = (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
    setProductos((prev) => prev.filter((p) => p.id !== id));
  };

  // ── Handlers: modal venta ─────────────────────────────
  const handleAbrirModalVenta = (producto) => {
    setProductoVenta(producto);
    setFormVenta({ ...FORM_VENTA_VACIO, precioVenta: producto.precio });
    setErrorVenta("");
    setModalVentaAbierto(true);
  };

  const handleCerrarModalVenta = () => {
    setModalVentaAbierto(false);
    setProductoVenta(null);
    setFormVenta(FORM_VENTA_VACIO);
    setErrorVenta("");
  };

  const handleFormVentaChange = (e) => {
    const { name, value } = e.target;
    setFormVenta((prev) => ({ ...prev, [name]: value }));
    if (errorVenta) setErrorVenta("");
  };

  const handleRegistrarVenta = () => {
    const cantidad = Number(formVenta.cantidad);

    if (!cantidad || isNaN(cantidad) || cantidad <= 0)
      return setErrorVenta("Ingresa una cantidad válida.");

    if (cantidad > productoVenta.stock)
      return setErrorVenta(`Stock insuficiente. Disponible: ${productoVenta.stock}`);

    // Actualiza el stock automáticamente al registrar la venta
    setProductos((prev) =>
      prev.map((p) =>
        p.id === productoVenta.id ? { ...p, stock: p.stock - cantidad } : p
      )
    );

    // TODO: aquí podrías también registrar la venta en el módulo de Gestión de Ventas
    // Ejemplo: registrarVenta({ productoId: productoVenta.id, cantidad, precioVenta, cliente })

    handleCerrarModalVenta();
  };

  return (
    <div>
      <Inventario
        // Datos
        productos={productosFiltrados}
        categorias={categorias}
        categoriaActiva={categoriaActiva}
        busqueda={busqueda}
        totalProductos={productos.length}
        stockBajoCount={stockBajoCount}
        valorTotal={valorTotal}
        // Modal producto
        modalAbierto={modalAbierto}
        productoEditando={productoEditando}
        formProducto={formProducto}
        errorForm={errorForm}
        // Modal venta
        modalVentaAbierto={modalVentaAbierto}
        formVenta={formVenta}
        productoVenta={productoVenta}
        errorVenta={errorVenta}
        // Rol
        esAdmin={esAdmin}
        // Alertas
        alertasStockBajo={alertasStockBajo}
        alertasVisible={alertasVisible}
        // Handlers generales
        onBuscar={setBusqueda}
        onCategoriaChange={setCategoria}
        onToggleAlertas={() => setAlertasVisible((v) => !v)}
        // Handlers producto
        onAbrirModalAgregar={handleAbrirModalAgregar}
        onAbrirModalEditar={handleAbrirModalEditar}
        onCerrarModal={handleCerrarModal}
        onFormProductoChange={handleFormProductoChange}
        onGuardarProducto={handleGuardarProducto}
        onEliminarProducto={handleEliminarProducto}
        // Handlers venta
        onAbrirModalVenta={handleAbrirModalVenta}
        onCerrarModalVenta={handleCerrarModalVenta}
        onFormVentaChange={handleFormVentaChange}
        onRegistrarVenta={handleRegistrarVenta}
      />
      <Footer />
    </div>
  );
}