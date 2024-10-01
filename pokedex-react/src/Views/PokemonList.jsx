import React, { useState, useEffect } from 'react';
import pokemonService from './pokemonService'; 
import { Container, Row, Col, InputGroup, InputGroupText, Input } from "reactstrap";
import PokeTarjeta from '../Components/PokeTarjeta'

const PokemonList = () => {
  const [pokemones, setPokemones] = useState([]);
  const [allpokemones, setAllPokemones] = useState([]);
  const [listado, setListado] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(20);

  useEffect(() => {
    fetchPokemones(); 
    fetchAllPokemones();
  }, [offset, limit]);

  const fetchPokemones = async () => {
    try {
      const results = await pokemonService.getPokemones(limit, offset);
      setPokemones(results); 
      setListado(results); 
    } catch (error) {
      console.error("Error al obtener los Pokémon:", error);
    }
  };

  const fetchAllPokemones = async () => {
    try {
      const results = await pokemonService.getAllPokemones();
      setAllPokemones(results); 
    } catch (error) {
      console.error("Error al obtener los Pokémon:", error);
    }
  };

  const buscar = async(e) => {
      if (e.keyCode == 13) {
        if(filtro.trim() != ''){
          setListado([]);
          setTimeout( () => {
            setListado(allpokemones.filter(p => p.name.includes(filtro)))
          },100) 
        }
      } else if (filtro.trim() == ''){
        setListado([]);
        setTimeout( () => {
          setListado(pokemones);
        },100) 
      }
  }

  return (
    <Container className="shadow bg-danger mt-3">
      <Row>
        <Col>
          <InputGroup className="mt-3 mb-3 shadow">
            <InputGroupText><i className="fa-solid fa-search"></i></InputGroupText>
            <Input  value={filtro} onChange={(e) => {setFiltro(e.target.value)}}
             onKeyUpCapture={buscar} placeholder="Buscar pokemon"></Input>
          </InputGroup>
        </Col>
      </Row>
      <Row className='mt-3'>
          { listado.map((pok,i)=> (
            <PokeTarjeta pok={pok} key={i}/>
          ))}
      </Row>
    </Container>
  );
};

export default PokemonList;
