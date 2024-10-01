import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Container, Row, Col, Card, CardBody, CardText, Badge, Progress } from 'reactstrap';
import axios from 'axios';

const Detalles = () => {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [descripcion, setDescripcion] = useState('');
  const [especie, setEspecie] = useState('');
  const [habitat, setHabitat] = useState('Desconocido');
  const [tipos, setTipos] = useState([]);
  const [estadisticas, setEstadisticas] = useState([]);
  const [listaEvoluciones, setListaEvoluciones] = useState([]);
  const [habilidades, setHabilidades] = useState([]);
  const [imagen, setImagen] = useState('');
  const [cardClass, setCardClass] = useState('d-none');
  const [loadClass, setLoading] = useState('');

  useEffect(() => {
    getPokemon();
  }, [id]);

  const getPokemon = async () => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const data = response.data;

      setPokemon(data);

      if (data.sprites.other.dream_world.front_default) {
        setImagen(data.sprites.other.dream_world.front_default);
      } else {
        setImagen(data.sprites.other['official-artwork'].front_default);
      }

      setCardClass('');
      setLoading('d-none');
      await getEspecie(data.species.url);
      await getTipo(data.types);
      await getEstadisticas(data.stats);
      await getHabilidades(data.abilities);
    } catch (error) {
      console.error("Error al obtener los detalles del Pokémon:", error);
    }
  };

  const traducirEstadistica = (nombreIngles) => {
    const traducciones = {
      'hp': 'PS',
      'attack': 'Ataque',
      'defense': 'Defensa',
      'special-attack': 'Ataque Especial',
      'special-defense': 'Defensa Especial',
      'speed': 'Velocidad'
    };
    return traducciones[nombreIngles] || nombreIngles;
  };

  const getEstadisticas = (stats) => {
    try {
      const listaEstadisticas = stats.map(stat => ({
        nombre: traducirEstadistica(stat.stat.name),
        valor: stat.base_stat
      }));
      setEstadisticas(listaEstadisticas);
    } catch (error) {
      console.error("Error al obtener las estadisticas del Pokémon:", error);
    }
  };

  const getHabilidades = async (abilities) => {
    try {
      const listaHabilidades = await Promise.all(
        abilities.map(async (h) => {
          const response = await axios.get(h.ability.url);
          return response.data.names.find(name => name.language.name === 'es').name;
        })
      );
      setHabilidades(listaHabilidades);
    } catch (error) {
      console.error("Error al obtener las habilidades del Pokémon:", error);
    }
  };

  const getTipo = async (tipos) => {
    try {
      const listaTipos = await Promise.all(
        tipos.map(async (t) => {
          const response = await axios.get(t.type.url);
          return response.data.names.find(name => name.language.name === 'es').name;
        })
      );
      setTipos(listaTipos);
    } catch (error) {
      console.error("Error al obtener los tipos del Pokémon:", error);
    }
  };

  const getEspecie = async (url) => {
    try {
      const response = await axios.get(url);
      const data = response.data;

      setEspecie(data.name);
      if (data.habitat) {
        await getHabitat(data.habitat.url);
      }
      await getDescripcion(data.flavor_text_entries);
      await getEvoluciones(data.evolution_chain.url);
    } catch (error) {
      console.error("Error al obtener la especie del Pokémon:", error);
    }
  };

  const getEvoluciones = async (ev) => {
    try {
      const response = await axios.get(ev);
      const evolChain = response.data.chain;

      let lista = [];
      procesaEvoluciones(evolChain, lista);

      const listaPokemon = await Promise.all(lista.map(async (url) => {
        const response = await axios.get(url);
        return {
          nombre: response.data.name,
          imagen: response.data.sprites.other['official-artwork'].front_default
        };
      }));

      setListaEvoluciones(listaPokemon);
    } catch (error) {
      console.error("Error al obtener las evoluciones del Pokémon:", error);
    }
  };

  const procesaEvoluciones = (evolChain, lista) => {
    if (!evolChain) return;

    lista.push(evolChain.species.url.replace('-species', ''));

    evolChain.evolves_to.forEach(evolucion => {
      procesaEvoluciones(evolucion, lista);
    });
  };

  const getHabitat = async (url) => {
    try {
      const response = await axios.get(url);
      setHabitat(response.data.names.find(name => name.language.name === 'es').name);
    } catch (error) {
      console.error("Error al obtener el hábitat del Pokémon:", error);
    }
  };

  const getDescripcion = async (descripciones) => {
    let texto = '';
    descripciones.forEach((d) => {
      if (d.language.name === 'es') {
        texto = d.flavor_text;
      }
      if (texto === '' && descripciones.length > 0) {
        texto = descripciones[0].flavor_text;
      }
    });
    setDescripcion(texto);
  };

  return (
    <Container className='bg-danger mt-3'>
      <Row>
        <Col>
          <Card className='shadow mt-3 mb-3'>
            <CardBody className='mt-3'>
              <Row>
                <Col className='text-end'>
                  <Link to='/' className='btn btn-warning'>
                    <i className='fa-solid fa-home'></i>Inicio
                  </Link>
                </Col>
              </Row>
              <Row className={loadClass}>
                <Col md='12'>
                  <img src='/img/loading-pokemon.gif' className='w-100' alt="Cargando..." />
                </Col>
              </Row>
              <Row className={cardClass}>
                {pokemon && (
                  <>
                    <Col md='6'>
                      <CardText className='h1 text-capitalize'>{pokemon.name}</CardText>
                      <CardText className='fs-3'>{descripcion || 'Descripción no disponible'}</CardText>
                      <CardText className='fs-5'>
                        Altura: <b>{pokemon.height / 10} m</b>,
                        Peso: <b>{pokemon.weight / 10} kg</b>
                      </CardText>
                      <CardText className='fs-5'>
                        Tipo:
                        {tipos.map((tip, i) => (
                          <Badge pill className='me-1' color='danger' key={i}>
                            {tip}
                          </Badge>
                        ))}
                      </CardText>
                      <CardText className='fs-5'>
                        Habilidades:
                        {habilidades.map((hab, i) => (
                          <Badge pill className='me-1' color='dark' key={i}>
                            {hab}
                          </Badge>
                        ))}
                      </CardText>
                      <CardText className='fs-5 text-capitalize'>
                        Hábitat: <b>{habitat}</b>
                      </CardText>
                    </Col>
                    <Col md='6'>
                      <img src={imagen}  className='img-fluid' />
                    </Col>
                    <Col md='12 mt-3'>
                      <CardText className='fs-4 text-center'><b>Estadísticas</b></CardText>
                    </Col>
                    {estadisticas.map((es, i) => (
                      <Row key={i}>
                        <Col xs='6' md='3'><b>{es.nombre}</b></Col>
                        <Col xs='6' md='9'>
                          <Progress className='my-2' value={es.valor}>{es.valor}</Progress>
                        </Col>
                      </Row>
                    ))}
                    <Col md='12 mt-3'>
                      <CardText className='fs-4 text-center'><b>Evoluciones del Pokémon</b></CardText>
                    </Col>
                    {listaEvoluciones.map((pok, i) => (
                      <Col md='4' key={i}>
                        <PokeTarjeta nombre={pok.nombre} imagen={pok.imagen} />
                      </Col>
                    ))}
                  </>
                )}
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

const PokeTarjeta = ({ nombre, imagen }) => (
  <Card className='shadow mt-3'>
    <CardBody className='text-center'>
      <img src={imagen} alt={nombre} className='w-50' />
      <CardText className='fs-5 text-capitalize'><b>{nombre}</b></CardText>
    </CardBody>
  </Card>
);

export default Detalles;
