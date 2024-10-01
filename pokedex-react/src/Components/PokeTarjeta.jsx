import React, { useState, useEffect } from 'react';
import { Col, Card, CardBody, CardImg, Badge, CardFooter } from "reactstrap"; 
import pokemonService from '../Views/pokemonService'; 
import { Link } from 'react-router-dom'; 

const PokeTarjeta = ({ pok }) => { 
  const [pokemon, setPokemon] = useState([]); // Almacena los detalles del Pokémon
  const [imagen, setImagen] = useState(''); // Almacena la imagen del Pokémon
  const [loading, setLoading] = useState(true); // Indica si los datos están cargando

  // Efecto que se ejecuta al cargar el componente
  useEffect(() => {
    getPokemon(); // Llama a la función para obtener los detalles del Pokémon
  }, []);

  // Función para obtener los detalles del Pokémon
  const getPokemon = async () => {
    try {
      const data = await pokemonService.getPokemonDetail(pok.url); // Llama al servicio para obtener detalles del Pokémon
      setPokemon(data); // Actualiza el estado con los datos del Pokémon
      // Comprueba si hay una imagen de sueño del Pokémon, si no, toma la imagen oficial
      if (data.sprites.other.dream_world.front_default) {
        setImagen(data.sprites.other.dream_world.front_default); 
      } else {
        setImagen(data.sprites.other['official-artwork'].front_default); 
      }
    } catch (error) {
      console.error("Error al obtener los detalles del Pokémon:", error); // Manejo de errores
    } finally {
      setLoading(false); // Establece el estado de carga en false después de obtener los datos
    }
  };

  return (
    <Col sm='4' lg='3' className='mb-3'> 
      {loading ? ( // Muestra un estado de carga mientras se obtienen los datos
        <Card className='shadow border-4 border-warning'>
          <CardImg src='/img/loading.gif' height='200' className='p-3' /> {/* Imagen de carga */}
        </Card>
      ) : ( // Muestra la tarjeta del Pokémon una vez que los datos están cargados
        <Card className='card-hover shadow border-4 border-warning'>
          <CardImg src={imagen} height='150' className='p-2' /> 
          <CardBody className='text-center'> 
            <Badge pill color='danger'>#{pokemon.id}</Badge>
            <label className='fs-4 text-capitalize'>{pokemon.name}</label> 
          </CardBody>
          <CardFooter className='bg-warning d-flex justify-content-center'> {/* Pie de la tarjeta con un botón para detalles */}
            <Link to={'/pokemon/' + pokemon.name} className='btn btn-dark'> {/* Enlace a la página de detalles del Pokémon */}
              <i className='fa-solid fa-arrow-up-right-from-square'></i> Detalle 
            </Link>
          </CardFooter>
        </Card>
      )}
    </Col>
  );
}

export default PokeTarjeta; // Exporta el componente principal
