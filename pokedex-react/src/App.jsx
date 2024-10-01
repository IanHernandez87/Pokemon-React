import { Routes, Route, BrowserRouter } from 'react-router-dom';
import PokemonList from './Views/PokemonList';
import Detalle from './Views/Detalles';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<PokemonList />} />
        <Route path='/pokemon/:id' element={<Detalle />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
