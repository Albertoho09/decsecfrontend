import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Inicio } from './pages/inicio/Inicio';
import { Principal } from './pages/principal/Principal';
import { Perfil } from './pages/perfil/Perfil';

export default function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Inicio />} />
          <Route path='/principal' element={<Principal />} />
          <Route path='/perfil' element={<Perfil />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}