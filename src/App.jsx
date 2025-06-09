import React, { useState, useEffect } from 'react'
import './App.css'

export default function App() {
  const [vista, setVista] = useState('pacientes')
  const [pacientes, setPacientes] = useState(() => {
    const guardados = localStorage.getItem('pacientes')
    return guardados ? JSON.parse(guardados) : []
  })

  const [form, setForm] = useState({
    nombre: '', edad: '', sexo: '', telefono: '', direccion: '',
    motivo: '', notas: '', fechaCita: ''
  })

  const [editando, setEditando] = useState(false)
  const [indiceEditando, setIndiceEditando] = useState(null)
  const [busqueda, setBusqueda] = useState('')
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null)

  // Formulario para agregar nueva visita en ficha
  const [formVisita, setFormVisita] = useState({
    fecha: '',
    motivo: '',
    notas: ''
  })

  useEffect(() => {
    localStorage.setItem('pacientes', JSON.stringify(pacientes))
  }, [pacientes])

  const manejarCambio = e => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const manejarCambioVisita = e => {
    const { name, value } = e.target
    setFormVisita({ ...formVisita, [name]: value })
  }

  const agregarPaciente = e => {
    e.preventDefault()
    if (form.nombre.trim() === '') return

    const nuevaEntrada = {
      fecha: form.fechaCita,
      motivo: form.motivo,
      notas: form.notas
    }

    if (editando) {
      const nuevos = [...pacientes]
      const historialActualizado = [...(nuevos[indiceEditando].historial || []), nuevaEntrada]
      nuevos[indiceEditando] = {
        ...form,
        historial: historialActualizado
      }
      setPacientes(nuevos)
      setEditando(false)
      setIndiceEditando(null)
    } else {
      setPacientes([
        ...pacientes,
        {
          ...form,
          historial: [nuevaEntrada]
        }
      ])
    }

    setForm({
      nombre: '', edad: '', sexo: '', telefono: '', direccion: '',
      motivo: '', notas: '', fechaCita: ''
    })
  }

  const editarPaciente = (index) => {
    const p = pacientes[index]
    setForm({
      nombre: p.nombre,
      edad: p.edad,
      sexo: p.sexo,
      telefono: p.telefono,
      direccion: p.direccion,
      motivo: '',
      notas: '',
      fechaCita: ''
    })
    setEditando(true)
    setIndiceEditando(index)
  }

  const eliminarPaciente = (index) => {
    if (window.confirm("¿Deseas eliminar este paciente?")) {
      const nuevos = pacientes.filter((_, i) => i !== index)
      setPacientes(nuevos)
      if (editando && index === indiceEditando) {
        setEditando(false)
        setIndiceEditando(null)
        setForm({
          nombre: '', edad: '', sexo: '', telefono: '', direccion: '',
          motivo: '', notas: '', fechaCita: ''
        })
      }
      if (pacienteSeleccionado && pacientes[index].nombre === pacienteSeleccionado.nombre) {
        setPacienteSeleccionado(null)
      }
    }
  }

  const pacientesFiltrados = pacientes.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.telefono.toLowerCase().includes(busqueda.toLowerCase())
  )

  // Función para agregar visita nueva en ficha del paciente
  const agregarVisitaPaciente = e => {
    e.preventDefault()
    if (!formVisita.fecha || !formVisita.motivo) {
      alert("La fecha y el motivo son obligatorios.")
      return
    }
    const nuevos = [...pacientes]
    const index = pacientes.findIndex(p => p.nombre === pacienteSeleccionado.nombre && p.telefono === pacienteSeleccionado.telefono)
    if (index === -1) return

    const historialActualizado = [...(nuevos[index].historial || [])]
    historialActualizado.push({
      fecha: formVisita.fecha,
      motivo: formVisita.motivo,
      notas: formVisita.notas
    })

    nuevos[index] = {
      ...nuevos[index],
      historial: historialActualizado
    }
    setPacientes(nuevos)
    setPacienteSeleccionado(nuevos[index])
    setFormVisita({ fecha: '', motivo: '', notas: '' })
  }

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <h2>Consultorio</h2>
        <nav>
          <button
            onClick={() => {
              setVista('pacientes')
              setPacienteSeleccionado(null)
            }}
            className={vista === 'pacientes' ? 'active' : ''}
          >
            Pacientes
          </button>
          <button
            onClick={() => {
              setVista('agenda')
              setPacienteSeleccionado(null)
            }}
            className={vista === 'agenda' ? 'active' : ''}
          >
            Agenda
          </button>
        </nav>
      </aside>

      <main className="contenido">
        <header className="topbar">
          <h1>
            {vista === 'pacientes'
              ? pacienteSeleccionado
                ? 'Ficha del paciente'
                : 'Gestión de pacientes'
              : 'Agenda de citas'}
          </h1>
        </header>

        {vista === 'pacientes' && !pacienteSeleccionado && (
          <>
            <section className="formulario">
              <h2>{editando ? 'Editar paciente' : 'Agregar nuevo paciente'}</h2>
              <form onSubmit={agregarPaciente}>
                <input name="nombre" placeholder="Nombre completo" value={form.nombre} onChange={manejarCambio} required />
                <input name="edad" type="number" placeholder="Edad" value={form.edad} onChange={manejarCambio} />
                <select name="sexo" value={form.sexo} onChange={manejarCambio} required>
                  <option value="">Sexo</option>
                  <option value="F">Femenino</option>
                  <option value="M">Masculino</option>
                  <option value="O">Otro</option>
                </select>
                <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={manejarCambio} />
                <input name="direccion" placeholder="Dirección" value={form.direccion} onChange={manejarCambio} />
                <input name="motivo" placeholder="Motivo de consulta" value={form.motivo} onChange={manejarCambio} />
                <textarea name="notas" placeholder="Notas adicionales" value={form.notas} onChange={manejarCambio} />
                <input name="fechaCita" type="date" value={form.fechaCita} onChange={manejarCambio} />
                <button type="submit">{editando ? 'Guardar cambios' : 'Agregar paciente'}</button>
                {editando && (
                  <button type="button" onClick={() => {
                    setEditando(false)
                    setIndiceEditando(null)
                    setForm({
                      nombre: '', edad: '', sexo: '', telefono: '', direccion: '',
                      motivo: '', notas: '', fechaCita: ''
                    })
                  }} style={{ background: 'gray', color: 'white', marginTop: '8px' }}>
                    Cancelar edición
                  </button>
                )}
              </form>
            </section>

            <section>
  <h2>Pacientes registrados ({pacientes.length})</h2>
  <input
    type="text"
    placeholder="Buscar por nombre o teléfono"
    value={busqueda}
    onChange={(e) => setBusqueda(e.target.value)}
    style={{ marginBottom: '12px', padding: '8px', width: '100%', maxWidth: '300px' }}
  />
  <div className="tarjetas-pacientes">
    {pacientesFiltrados.length === 0 && <p>No hay pacientes que coincidan con la búsqueda.</p>}
    {pacientesFiltrados.map((pac, i) => (
      <div key={i} className="tarjeta-paciente">
        <h3>
          <button
            onClick={() => setPacienteSeleccionado(pac)}
            className="btn-nombre-tarjeta"
          >
            {pac.nombre}
          </button>
        </h3>
        <p><strong>Teléfono:</strong> {pac.telefono || 'No registrado'}</p>
        <p><strong>Edad:</strong> {pac.edad || 'No registrado'}</p>
        <p><strong>Sexo:</strong> {pac.sexo || 'No registrado'}</p>
        <div className="acciones-tarjeta">
          <button onClick={() => editarPaciente(i)} className="btn-editar">Editar</button>
          <button onClick={() => eliminarPaciente(i)} className="btn-eliminar">Eliminar</button>
        </div>
      </div>
    ))}
  </div>
</section>

          </>
        )}

        {pacienteSeleccionado && (
  <section className="ficha-paciente">
    <button
      className="boton-volver"
      onClick={() => {
        setPacienteSeleccionado(null)
        setVista('pacientes')
      }}
    >
      ← Volver
    </button>

    <div className="info-basica">
      <h2>{pacienteSeleccionado.nombre}</h2>
      <div className="detalles-basicos">
        <p><strong>Edad:</strong> {pacienteSeleccionado.edad || 'No registrado'}</p>
        <p><strong>Sexo:</strong> {pacienteSeleccionado.sexo || 'No registrado'}</p>
        <p><strong>Teléfono:</strong> {pacienteSeleccionado.telefono || 'No registrado'}</p>
        <p><strong>Dirección:</strong> {pacienteSeleccionado.direccion || 'No registrado'}</p>
      </div>
    </div>

    <div className="contenedor-ficha-detalle">
  <div className="historial-clinico">
    <h3>Historial clínico</h3>
    {(!pacienteSeleccionado.historial || pacienteSeleccionado.historial.length === 0) && (
      <p>No hay historial registrado.</p>
    )}
    <div className="historial-tarjetas">
      {[...(pacienteSeleccionado.historial || [])]
        .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
        .map((h, i) => (
          <div key={i} className="tarjeta-historial">
            <div className="encabezado-historial">
              <span className="fecha">{h.fecha}</span>
              <span className="motivo">{h.motivo}</span>
            </div>
            {h.notas && <p className="notas">{h.notas}</p>}
          </div>
        ))
      }
    </div>
  </div>

  <div className="nueva-visita">
    <h3>Agregar nueva visita</h3>
    <form onSubmit={agregarVisitaPaciente}>
      <input
        type="date"
        name="fecha"
        value={formVisita.fecha}
        onChange={manejarCambioVisita}
        required
        className="input-visita"
      />
      <input
        type="text"
        name="motivo"
        placeholder="Motivo de la visita"
        value={formVisita.motivo}
        onChange={manejarCambioVisita}
        required
        className="input-visita"
      />
      <textarea
        name="notas"
        placeholder="Notas adicionales o síntomas"
        value={formVisita.notas}
        onChange={manejarCambioVisita}
        className="input-visita"
        rows={4}
      />
      <button type="submit" className="btn-agregar-visita">Agregar visita</button>
    </form>
  </div>
</div>


  </section>
)}



        {vista === 'agenda' && (
          <section>
            <h2>Agenda de Citas</h2>
            <ul className="lista-pacientes">
              {pacientes
                .filter(p => p.fechaCita)
                .sort((a, b) => new Date(a.fechaCita) - new Date(b.fechaCita))
                .map((p, i) => (
                  <li key={i}>
                    <strong>{p.nombre}</strong> — {p.fechaCita} <br />
                    Motivo: {p.motivo}
                  </li>
                ))}
            </ul>
          </section>
        )}
      </main>
    </div>
  )
}
