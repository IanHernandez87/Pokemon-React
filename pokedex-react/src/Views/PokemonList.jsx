import React, { useState, useEffect } from 'react';
import pokemonService from './pokemonService'; 
import { Container, Row, Col, InputGroup, InputGroupText, Input } from "reactstrap";
import PokeTarjeta from '../Components/PokeTarjeta'
import { PaginationControl } from 'react-bootstrap-pagination-control';
import axios from 'axios';

const PokemonList = () => {
  const [pokemones, setPokemones] = useState([]);
  const [allpokemones, setAllPokemones] = useState([]);
  const [listado, setListado] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchPokemones(); 
    fetchAllPokemones();
    goPage();
    buscar();
    getPokemones(offset);
  }, [offset, limit]);

  const getPokemones = async(o) =>{
    const liga = 'https://pokeapi.co/api/v2/pokemon?limit='+ limit + '&offset=' + o;
    axios.get(liga).then(async(response) => {
      const respuesta = response.data;
      setPokemones(respuesta.results);
      setListado(respuesta.results);
      setTotal(respuesta.count);
    })
  }

  const fetchPokemones = async () => {
    try {
      const results = await pokemonService.getPokemones(limit, offset);
      setPokemones(results.results); 
      setListado(results.results); 
      setTotal(results.count); 
      console.log("Total Pokémon: ", results.count); 
    } catch (error) {
      console.error("Error al obtener los Pokémon:", error);
    }
  };
  

  const fetchAllPokemones = async () => {
    try {
      const resultado = await pokemonService.getAllPokemones();
      setTotal(resultado.count);
      setAllPokemones(resultado); 
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

  const goPage = async(p) => {
    setListado([]);
    await getPokemones((p==1) ? 0 : ((p-1)*20) ); 
    setOffset(p);
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
          <PaginationControl last={true} limit={limit} total={total}
          page={offset} changePage={page=> goPage(page)}/>
      </Row>
    </Container>
  );
};

export default PokemonList;