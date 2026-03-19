// Componentes/AdminUsuarios.jsx
// Solo JSX. Sin lógica ni estados.

import "../style/AdminUsuarios.css";

const ROL_BADGE = {
  Administrador: "admin",
  Vendedor: "vendedor",
};

export default function AdminUsuarios({
  // Datos
  usuarios = [],
  busqueda = "",
  filtroRol = "Todos",
  totalUsuarios = 0,
  totalAdmins = 0,
  totalVendedores = 0,
  // Modal usuario
  modalAbierto = false,
  usuarioEditando = null,
  formUsuario = {},
  errorForm = "",
  // Modal confirmar eliminar
  modalEliminarAbierto = false,
  usuarioAEliminar = null,
  // Handlers
  onBuscar,
  onFiltroRolChange,
  onAbrirModalAgregar,
  onAbrirModalEditar,
  onCerrarModal,
  onFormChange,
  onGuardar,
  onAbrirConfirmarEliminar,
  onCerrarConfirmarEliminar,
  onConfirmarEliminar,
}) {
  return (
    <main className="au">

      {/* ── HEADER ── */}
      <header className="au__header">
        <div>
          <h1 className="au__titulo">Gestión de <span>Usuarios</span></h1>
          <p className="au__subtitulo">Administra cuentas, roles y permisos del sistema.</p>
        </div>
        <button className="au__btn-primary" onClick={onAbrirModalAgregar}>
          ＋ Nuevo Usuario
        </button>
      </header>

      {}
      <section className="au__stats">
        <div className="au__stat">
          <span className="au__stat-icon">👥</span>
          <div>
            <span className="au__stat-num">{totalUsuarios}</span>
            <span className="au__stat-lbl">Total Usuarios</span>
          </div>
        </div>
        <div className="au__stat au__stat--admin">
          <span className="au__stat-icon">🔐</span>
          <div>
            <span className="au__stat-num">{totalAdmins}</span>
            <span className="au__stat-lbl">Administradores</span>
          </div>
        </div>
        <div className="au__stat au__stat--vendedor">
          <span className="au__stat-icon">🛒</span>
          <div>
            <span className="au__stat-num">{totalVendedores}</span>
            <span className="au__stat-lbl">Vendedores</span>
          </div>
        </div>
      </section>

      {/* ── FILTROS ── */}
      <section className="au__filtros">
        <div className="au__search-box">
          <span className="au__search-ico">🔍</span>
          <input
            className="au__search"
            type="text"
            placeholder="Buscar por nombre o correo..."
            value={busqueda}
            onChange={(e) => onBuscar(e.target.value)}
          />
          {busqueda && (
            <button className="au__search-clear" onClick={() => onBuscar("")}>✕</button>
          )}
        </div>
        <div className="au__roles-filter">
          {["Todos", "Administrador", "Vendedor"].map((rol) => (
            <button
              key={rol}
              className={`au__rol-btn ${filtroRol === rol ? "au__rol-btn--on" : ""}`}
              onClick={() => onFiltroRolChange(rol)}
            >
              {rol}
            </button>
          ))}
        </div>
      </section>

      {/* ── TABLA ── */}
      <section className="au__table-section">
        {usuarios.length === 0 ? (
          <div className="au__empty">
            <span>👤</span>
            <p>{busqueda ? "No se encontraron usuarios." : "No hay usuarios registrados."}</p>
            {!busqueda && (
              <button className="au__btn-primary" onClick={onAbrirModalAgregar}>
                Registrar primer usuario
              </button>
            )}
          </div>
        ) : (
          <div className="au__scroll">
            <table className="au__table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Estado</th>
                  <th>Fecha Registro</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuarios.map((u) => (
                  <tr key={u.id} className="au__row">
                    <td>
                      <div className="au__user-cell">
                        <div className="au__avatar">
                          {u.nombre.charAt(0).toUpperCase()}
                        </div>
                        <span className="au__user-nombre">{u.nombre}</span>
                      </div>
                    </td>
                    <td className="au__email">{u.correo}</td>
                    <td>
                      <span className={`au__badge au__badge--${ROL_BADGE[u.rol] || "default"}`}>
                        {u.rol}
                      </span>
                    </td>
                    <td>
                      <span className={`au__estado ${u.activo ? "au__estado--on" : "au__estado--off"}`}>
                        {u.activo ? "● Activo" : "● Inactivo"}
                      </span>
                    </td>
                    <td className="au__fecha">{u.fechaRegistro}</td>
                    <td>
                      <div className="au__actions">
                        <button
                          className="au__act au__act--edit"
                          onClick={() => onAbrirModalEditar(u)}
                          title="Editar usuario"
                        >
                          ✏️
                        </button>
                        <button
                          className="au__act au__act--del"
                          onClick={() => onAbrirConfirmarEliminar(u)}
                          title="Eliminar usuario"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── MODAL CREAR / EDITAR USUARIO ── */}
      {modalAbierto && (
        <div className="au__overlay" onClick={onCerrarModal}>
          <div className="au__modal" onClick={(e) => e.stopPropagation()}>
            <div className="au__modal-head">
              <h2>{usuarioEditando ? "✏️ Editar Usuario" : "＋ Registrar Usuario"}</h2>
              <button className="au__modal-x" onClick={onCerrarModal}>✕</button>
            </div>
            <div className="au__modal-body">
              {errorForm && <div className="au__error">{errorForm}</div>}
              <div className="au__grid">
                <div className="au__field au__field--full">
                  <label>Nombre completo *</label>
                  <input
                    type="text"
                    name="nombre"
                    value={formUsuario.nombre || ""}
                    onChange={onFormChange}
                    placeholder="Nombre y apellido"
                  />
                </div>
                <div className="au__field au__field--full">
                  <label>Correo electrónico *</label>
                  <input
                    type="email"
                    name="correo"
                    value={formUsuario.correo || ""}
                    onChange={onFormChange}
                    placeholder="correo@empresa.com"
                  />
                </div>
                {!usuarioEditando && (
                  <>
                    <div className="au__field">
                      <label>Contraseña *</label>
                      <input
                        type="password"
                        name="contrasena"
                        value={formUsuario.contrasena || ""}
                        onChange={onFormChange}
                        placeholder="Mínimo 8 caracteres"
                      />
                    </div>
                    <div className="au__field">
                      <label>Confirmar contraseña *</label>
                      <input
                        type="password"
                        name="confirmarContrasena"
                        value={formUsuario.confirmarContrasena || ""}
                        onChange={onFormChange}
                        placeholder="Repite la contraseña"
                      />
                    </div>
                  </>
                )}
                <div className="au__field">
                  <label>Rol *</label>
                  <select
                    name="rol"
                    value={formUsuario.rol || ""}
                    onChange={onFormChange}
                    className="au__select"
                  >
                    <option value="">Seleccionar rol...</option>
                    <option value="Administrador">Administrador</option>
                    <option value="Vendedor">Vendedor</option>
                  </select>
                </div>
                <div className="au__field">
                  <label>Estado</label>
                  <select
                    name="activo"
                    value={formUsuario.activo !== undefined ? String(formUsuario.activo) : "true"}
                    onChange={onFormChange}
                    className="au__select"
                  >
                    <option value="true">Activo</option>
                    <option value="false">Inactivo</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="au__modal-foot">
              <button className="au__btn-secondary" onClick={onCerrarModal}>Cancelar</button>
              <button className="au__btn-primary" onClick={onGuardar}>
                {usuarioEditando ? "Guardar Cambios" : "Registrar Usuario"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL CONFIRMAR ELIMINAR ── */}
      {modalEliminarAbierto && usuarioAEliminar && (
        <div className="au__overlay" onClick={onCerrarConfirmarEliminar}>
          <div className="au__modal au__modal--sm" onClick={(e) => e.stopPropagation()}>
            <div className="au__modal-head">
              <h2>🗑️ Eliminar Usuario</h2>
              <button className="au__modal-x" onClick={onCerrarConfirmarEliminar}>✕</button>
            </div>
            <div className="au__modal-body">
              <div className="au__confirm-info">
                <div className="au__avatar au__avatar--lg">
                  {usuarioAEliminar.nombre.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="au__confirm-nombre">{usuarioAEliminar.nombre}</p>
                  <p className="au__confirm-correo">{usuarioAEliminar.correo}</p>
                </div>
              </div>
              <p className="au__confirm-msg">
                ¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="au__modal-foot">
              <button className="au__btn-secondary" onClick={onCerrarConfirmarEliminar}>Cancelar</button>
              <button className="au__btn-danger" onClick={onConfirmarEliminar}>
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}