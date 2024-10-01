import React, { useState, useEffect } from 'react';
import pokemonService from './pokemonService'; 
import { Container, Row, Col, InputGroup, InputGroupText, Input } from "reactstrap";
import PokeTarjeta from '../Components/PokeTarjeta'

const PokemonList = () => {
  const [pokemones, setPokemones] = useState([]);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(20);

  useEffect(() => {
    fetchPokemones(); 
  }, [offset, limit]);

  const fetchPokemones = async () => {
    try {
      const results = await pokemonService.getPokemones(limit, offset);
      setPokemones(results); 
    } catch (error) {
      console.error("Error al obtener los Pokémon:", error);
    }
  };

  return (
    <Container className="shadow bg-danger mt-3">
      <Row>
        <Col>
          <InputGroup className="mt-3 mb-3 shadow">
            <InputGroupText><i className="fa-solid fa-search"></i></InputGroupText>
            <Input placeholder="Buscar pokemon"></Input>
          </InputGroup>
        </Col>
      </Row>
      <Row className='mt-3'>
          { pokemones.map((pok,i)=> (
            <PokeTarjeta pok={pok} key={i}/>
          ))}
      </Row>
    </Container>
  );
};

export default PokemonList;
