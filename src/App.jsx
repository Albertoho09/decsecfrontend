import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Inicio } from './pages/inicio/Inicio';
import { Principal } from './pages/principal/Principal';


export default function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Inicio />} />
          <Route path='/principal' element={<Principal />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}