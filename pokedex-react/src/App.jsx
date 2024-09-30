import { Routes, Route, BrowserRouter } from "react-router-dom"
import Index from './Views/Index'
import Detalle from './Views/Detalles'


function App() {

  return (
    <BrowserRouter>
      <Routes>
       <Route path='/' element={<Index />} />
       <Route path='/pokemon/:id' element={<Detalle />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
