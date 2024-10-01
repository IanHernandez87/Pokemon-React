import React, { useState, useEffect } from 'react';
import { Col, Card, CardBody, CardImg, Badge, CardFooter } from "reactstrap";
import pokemonService from '../Views/pokemonService'; 
import { Link } from 'react-router-dom';

const PokeTarjeta = ({ pok }) => { 
  const [pokemon, setPokemon] = useState({});
  const [imagen, setImagen] = useState('');
  const [loading, setLoading] = useState(true); // Estado para manejar la carga

  useEffect(() => {
    getPokemon();
  }, []);

  const getPokemon = async () => {
    try {
      const data = await pokemonService.getPokemonDetail(pok.url); 
      setPokemon(data);
      if(data.sprites.other.dream_world.front_default != null){
        setImagen(data.sprites.other.dream_world.front_default); 
      } else{
        setImagen(data.sprites.other['official-network'].front_default); 
      }
    } catch (error) {
      console.error("Error al obtener los detalles del Pokémon:", error);
    } finally {
      setLoading(false); 
    }
  };

  return (
    <Col sm='4' lg='3' className='mb-3'>
      {loading ? ( 
        <Card className='shadow border-4 border-warning'>
          <CardImg src='/img/loading.gif' height='200' className='p-3' />
        </Card>
      ) : ( 
        <Card className='shadow border-4 border-warning'>
          <CardImg src={imagen} height='150' className='p-2' />
          <CardBody className='text-center'>
            <Badge pill color='danger'>#{pokemon.id}</Badge>
            <label className='fs-4 text-capitalize'>{pokemon.name}</label>
          </CardBody>
          <CardFooter className='bg-warning d-flex justify-content-center'>
            <Link className='btn btn-dark'>
              <i className='fa-solid fa-arrow-up-right-from-square'></i> Detalle
            </Link>
          </CardFooter>
        </Card>
      )}
    </Col>
  );
}

export default PokeTarjeta;
