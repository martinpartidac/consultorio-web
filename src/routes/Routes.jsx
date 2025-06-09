// src/routes/Routes.jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Home from '../pages/Home'
import Pacientes from '../pages/Pacientes'
import Agenda from '../pages/Agenda'
import Expediente from '../pages/Expediente'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <nav className="p-4 bg-blue-600 text-white flex gap-4">
        <Link to="/">Inicio</Link>
        <Link to="/pacientes">Pacientes</Link>
        <Link to="/agenda">Agenda</Link>
      </nav>

      <div className="p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pacientes" element={<Pacientes />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/expediente/:id" element={<Expediente />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
