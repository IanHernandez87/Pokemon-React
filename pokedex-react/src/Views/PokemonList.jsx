import React, { useState, useEffect } from 'react'; 
import pokemonService from './pokemonService'; 
import { Container, Row, Col, InputGroup, InputGroupText, Input } from "reactstrap"; 
import PokeTarjeta from '../Components/PokeTarjeta'; 
import { PaginationControl } from 'react-bootstrap-pagination-control'; 
import axios from 'axios'; 

const PokemonList = () => {
  // Define los estados necesarios para el componente
  const [pokemones, setPokemones] = useState([]); // Almacena los Pokémon actuales
  const [allpokemones, setAllPokemones] = useState([]); // Almacena todos los Pokémon
  const [listado, setListado] = useState([]); // Almacena el listado filtrado
  const [filtro, setFiltro] = useState(''); // Almacena el texto de búsqueda
  const [offset, setOffset] = useState(0); // Almacena el desplazamiento actual para la paginación
  const [limit, setLimit] = useState(20); // Almacena el número máximo de Pokémon a mostrar por página
  const [total, setTotal] = useState(0); // Almacena el total de Pokémon disponibles

  // Efecto que se ejecuta al cargar el componente o cambiar el offset y el límite
  useEffect(() => {
    fetchPokemones(); // Obtiene Pokémon según el límite y el desplazamiento
    fetchAllPokemones(); // Obtiene todos los Pokémon para permitir la búsqueda
    goPage(); // Configura la paginación
    buscar(); // Ejecuta la búsqueda
    getPokemones(offset); // Obtiene los Pokémon en función del desplazamiento
  }, [offset, limit]); // Dependencias del efecto

  // Función para obtener Pokémon desde la API para la paginacion de la web
  const getPokemones = async (o) => {
    const liga = 'https://pokeapi.co/api/v2/pokemon?limit=' + limit + '&offset=' + o; 
    axios.get(liga).then(async (response) => { 
      const respuesta = response.data; 
      setPokemones(respuesta.results); 
      setListado(respuesta.results); 
      setTotal(respuesta.count); 
    });
  }

  // Función para obtener Pokémon utilizando el servicio
  const fetchPokemones = async () => {
    try {
      const results = await pokemonService.getPokemones(limit, offset); // Obtiene Pokémon desde el servicio
      setPokemones(results.results); // Actualiza el estado con los Pokémon obtenidos
      setListado(results.results); // Actualiza el listado con los Pokémon obtenidos
      setTotal(results.count); // Actualiza el total de Pokémon
    } catch (error) {
      console.error("Error al obtener los Pokémon:", error); // Manejo de errores
    }
  };

  // Función para obtener todos los Pokémon
  const fetchAllPokemones = async () => {
    try {
      const resultado = await pokemonService.getAllPokemones(); // Llama al servicio para obtener todos los Pokémon
      setTotal(resultado.count); // Actualiza el total de Pokémon
      setAllPokemones(resultado); // Almacena todos los Pokémon
    } catch (error) {
      console.error("Error al obtener los Pokémon:", error); // Manejo de errores
    }
  };

  // Función para buscar Pokémon según el texto de filtro
  const buscar = async (e) => {
    if (e.keyCode === 13) { // Si se presiona la tecla "Enter"
      if (filtro.trim() !== '') { // Si el filtro no está vacío
        setListado([]); // Limpia el listado actual
        setTimeout(() => {
          // Filtra los Pokémon según el texto de búsqueda
          setListado(allpokemones.filter(p => p.name.includes(filtro)));
        }, 100);
      }
    } else if (filtro.trim() === '') { // Si el filtro está vacío
      setListado([]); // Limpia el listado actual
      setTimeout(() => {
        setListado(pokemones); // Restaura el listado de Pokémon
      }, 100);
    }
  }

  // Función para gestionar la paginación
  const goPage = async (p) => {
    setListado([]); // Limpia el listado actual
    await getPokemones((p === 1) ? 0 : ((p - 1) * 20)); // Obtiene los Pokémon según la página seleccionada
    setOffset(p); // Actualiza el desplazamiento
  }

  return (
    <Container className="shadow bg-danger mt-3">
      <Row>
        <Col>
          <InputGroup className="mt-3 mb-3 shadow"> 
            <InputGroupText><i className="fa-solid fa-search"></i></InputGroupText> 
            <Input
              value={filtro} // Valor del campo de búsqueda
              onChange={(e) => { setFiltro(e.target.value) }} // Actualiza el filtro al cambiar el texto
              onKeyUpCapture={buscar} // Ejecuta la búsqueda al presionar una tecla
              placeholder="Buscar pokemon" // Placeholder del campo de búsqueda
            />
          </InputGroup>
        </Col>
      </Row>
      <Row className='mt-3'>
        {listado.map((pok, i) => ( // Mapea el listado y muestra cada Pokémon
          <PokeTarjeta pok={pok} key={i} /> // Componente que muestra información del Pokémon
        ))}
        <PaginationControl last={true} limit={limit} total={total} // Componente de paginación
          page={offset} changePage={page => goPage(page)} /> {/* Cambia la página al hacer clic */}
      </Row>
    </Container>
  );
};

export default PokemonList; 
