import React, { useState, useEffect } from 'react'; 
import { Link, useParams } from 'react-router-dom'; 
import { Container, Row, Col, Card, CardBody, CardText, Badge, Progress } from 'reactstrap'; 
import axios from 'axios'; 

const Detalles = () => {
  // Extrae el ID del Pokémon de los parámetros de la URL
  const { id } = useParams();
  
  // Define los estados para almacenar la información del Pokémon y otros datos
  const [pokemon, setPokemon] = useState(null);
  const [descripcion, setDescripcion] = useState('');
  const [especie, setEspecie] = useState('');
  const [habitat, setHabitat] = useState('Desconocido');
  const [tipos, setTipos] = useState([]);
  const [estadisticas, setEstadisticas] = useState([]);
  const [listaEvoluciones, setListaEvoluciones] = useState([]);
  const [habilidades, setHabilidades] = useState([]);
  const [imagen, setImagen] = useState('');
  const [cardClass, setCardClass] = useState('d-none'); // Estado para controlar la visibilidad de la tarjeta
  const [loadClass, setLoading] = useState(''); // Estado para controlar la visibilidad de la animación de carga

  // Efecto para obtener la información del Pokémon cuando el ID cambia
  useEffect(() => {
    getPokemon();
  }, [id]);

  // Función para obtener los detalles del Pokémon desde la API
  const getPokemon = async () => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`); // Llama a la API con el ID del Pokémon
      const data = response.data;

      // Actualiza el estado con la información del Pokémon
      setPokemon(data);

      // Establece la imagen del Pokémon, priorizando la imagen de 'dream_world'
      if (data.sprites.other.dream_world.front_default) {
        setImagen(data.sprites.other.dream_world.front_default);
      } else {
        setImagen(data.sprites.other['official-artwork'].front_default);
      }

      // Controla la visibilidad de la tarjeta y la animación de carga
      setCardClass('');
      setLoading('d-none');
      
      // Llama a funciones adicionales para obtener más información
      await getEspecie(data.species.url);
      await getTipo(data.types);
      await getEstadisticas(data.stats);
      await getHabilidades(data.abilities);
    } catch (error) {
      console.error("Error al obtener los detalles del Pokémon:", error);
    }
  };

  // Función para traducir nombres de estadísticas de inglés a español
  const traducirEstadistica = (nombreIngles) => {
    const traducciones = {
      'hp': 'PS',
      'attack': 'Ataque',
      'defense': 'Defensa',
      'special-attack': 'Ataque Especial',
      'special-defense': 'Defensa Especial',
      'speed': 'Velocidad'
    };
    return traducciones[nombreIngles] || nombreIngles; // Retorna la traducción o el nombre original
  };

  // Función para obtener y establecer estadísticas del Pokémon
  const getEstadisticas = (stats) => {
    try {
      const listaEstadisticas = stats.map(stat => ({
        nombre: traducirEstadistica(stat.stat.name), // Traduce el nombre de la estadística
        valor: stat.base_stat // Almacena el valor de la estadística
      }));
      setEstadisticas(listaEstadisticas); // Actualiza el estado con la lista de estadísticas
    } catch (error) {
      console.error("Error al obtener las estadisticas del Pokémon:", error);
    }
  };

  // Función para obtener y establecer habilidades del Pokémon
  const getHabilidades = async (abilities) => {
    try {
      const listaHabilidades = await Promise.all(
        abilities.map(async (h) => {
          const response = await axios.get(h.ability.url); // Llama a la API de habilidades
          return response.data.names.find(name => name.language.name === 'es').name; // Obtiene el nombre en español
        })
      );
      setHabilidades(listaHabilidades); // Actualiza el estado con la lista de habilidades
    } catch (error) {
      console.error("Error al obtener las habilidades del Pokémon:", error);
    }
  };

  // Función para obtener y establecer tipos del Pokémon
  const getTipo = async (tipos) => {
    try {
      const listaTipos = await Promise.all(
        tipos.map(async (t) => {
          const response = await axios.get(t.type.url); // Llama a la API de tipos
          return response.data.names.find(name => name.language.name === 'es').name; // Obtiene el nombre en español
        })
      );
      setTipos(listaTipos); // Actualiza el estado con la lista de tipos
    } catch (error) {
      console.error("Error al obtener los tipos del Pokémon:", error);
    }
  };

  // Función para obtener la especie del Pokémon
  const getEspecie = async (url) => {
    try {
      const response = await axios.get(url); // Llama a la API de especie
      const data = response.data;

      setEspecie(data.name); // Establece el nombre de la especie
      if (data.habitat) {
        await getHabitat(data.habitat.url); // Obtiene el hábitat si está disponible
      }
      await getDescripcion(data.flavor_text_entries); // Obtiene la descripción
      await getEvoluciones(data.evolution_chain.url); // Obtiene la cadena de evoluciones
    } catch (error) {
      console.error("Error al obtener la especie del Pokémon:", error);
    }
  };

  // Función para obtener las evoluciones del Pokémon
  const getEvoluciones = async (ev) => {
    try {
      const response = await axios.get(ev); // Llama a la API de evolución
      const evolChain = response.data.chain;

      let lista = []; // Inicializa la lista de evoluciones
      procesaEvoluciones(evolChain, lista); // Procesa la cadena de evoluciones

      // Obtiene los detalles de cada Pokémon en la lista de evoluciones
      const listaPokemon = await Promise.all(lista.map(async (url) => {
        const response = await axios.get(url);
        return {
          nombre: response.data.name,
          imagen: response.data.sprites.other['official-artwork'].front_default
        };
      }));

      setListaEvoluciones(listaPokemon); // Actualiza el estado con la lista de evoluciones
    } catch (error) {
      console.error("Error al obtener las evoluciones del Pokémon:", error);
    }
  };

  // Función recursiva para procesar la cadena de evoluciones
  const procesaEvoluciones = (evolChain, lista) => {
    if (!evolChain) return;

    lista.push(evolChain.species.url.replace('-species', '')); // Añade el Pokémon actual a la lista

    // Procesa las evoluciones
    evolChain.evolves_to.forEach(evolucion => {
      procesaEvoluciones(evolucion, lista); // Llama a la función de forma recursiva para cada evolución
    });
  };

  // Función para obtener el hábitat del Pokémon
  const getHabitat = async (url) => {
    try {
      const response = await axios.get(url); // Llama a la API de hábitat
      setHabitat(response.data.names.find(name => name.language.name === 'es').name); // Establece el nombre en español
    } catch (error) {
      console.error("Error al obtener el hábitat del Pokémon:", error);
    }
  };

  // Función para obtener la descripción del Pokémon
  const getDescripcion = async (descripciones) => {
    let texto = '';
    descripciones.forEach((d) => {
      if (d.language.name === 'es') {
        texto = d.flavor_text; // Establece la descripción en español
      }
      // Si no hay descripción en español, usa la primera descripción disponible
      if (texto === '' && descripciones.length > 0) {
        texto = descripciones[0].flavor_text;
      }
    });
    setDescripcion(texto); // Actualiza el estado con la descripción
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
              <Row className={loadClass}> {/* Fila para mostrar la animación de carga */}
                <Col md='12'>
                  <img src='/img/loading-pokemon.gif' className='w-100' alt="Cargando..." />
                </Col>
              </Row>
              <Row className={cardClass}> {/* Fila para mostrar los detalles del Pokémon */}
                {pokemon && ( // Comprueba si la información del Pokémon está disponible
                  <>
                    <Col md='6'>
                      <CardText className='h1 text-capitalize'>{pokemon.name}</CardText> {/* Nombre del Pokémon */}
                      <CardText className='fs-3'>{descripcion || 'Descripción no disponible'}</CardText> {/* Descripción del Pokémon */}
                      <CardText className='fs-5'>
                        Altura: <b>{pokemon.height / 10} m</b>, {/* Altura del Pokémon */}
                        Peso: <b>{pokemon.weight / 10} kg</b> {/* Peso del Pokémon */}
                      </CardText>
                      <CardText className='fs-5'>
                        Tipo: {/* Tipos del Pokémon */}
                        {tipos.map((tip, i) => (
                          <Badge pill className='me-1' color='danger' key={i}>
                            {tip}
                          </Badge>
                        ))}
                      </CardText>
                      <CardText className='fs-5'>
                        Habilidades: {/* Habilidades del Pokémon */}
                        {habilidades.map((hab, i) => (
                          <Badge pill className='me-1' color='dark' key={i}>
                            {hab}
                          </Badge>
                        ))}
                      </CardText>
                      <CardText className='fs-5 text-capitalize'>
                        Hábitat: <b>{habitat}</b> {/* Hábitat del Pokémon */}
                      </CardText>
                    </Col>
                    <Col md='6'>
                      <img src={imagen}  className='img-fluid' alt={pokemon.name} /> 
                    </Col>
                    <Col md='12 mt-3'>
                      <CardText className='fs-4 text-center'><b>Estadísticas</b></CardText> 
                    </Col>
                    {estadisticas.map((es, i) => ( // Mapea y muestra las estadísticas
                      <Row key={i}>
                        <Col xs='6' md='3'><b>{es.nombre}</b></Col>
                        <Col xs='6' md='9'>
                          <Progress className='my-2' value={es.valor}>{es.valor}</Progress> {/* Barra de progreso para la estadística */}
                        </Col>
                      </Row>
                    ))}
                    <Col md='12 mt-3'>
                      <CardText className='fs-4 text-center'><b>Evoluciones del Pokémon</b></CardText> 
                    </Col>
                    {listaEvoluciones.map((pok, i) => ( // Mapea y muestra la lista de evoluciones
                      <Col md='4' key={i}>
                        <PokeTarjeta nombre={pok.nombre} imagen={pok.imagen} /> {/* Componente para mostrar información del Pokémon evolutivo */}
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

// Componente para mostrar cada Pokémon evolutivo
const PokeTarjeta = ({ nombre, imagen }) => (
  <Card className='shadow mt-3'>
    <CardBody className='text-center'>
      <img src={imagen} alt={nombre} className='w-50' /> 
      <CardText className='fs-5 text-capitalize'><b>{nombre}</b></CardText> 
    </CardBody>
  </Card>
);

export default Detalles; 
