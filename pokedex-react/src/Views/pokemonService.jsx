import axios from 'axios';

// URL base de la API de Pokémon
const BASE_URL = 'https://pokeapi.co/api/v2/pokemon';

// Función para obtener una lista de Pokémon con límite y desplazamiento
const getPokemones = async (limit, offset) => {
  try {
    // Realiza una solicitud GET a la API de Pokémon
    const response = await axios.get(`${BASE_URL}?limit=${limit}&offset=${offset}`);
    return response.data; // Retorna los datos de la respuesta
  } catch (error) {
    throw error; // Vuelve a lanzar el error para su manejo en otro lugar
  }
};

// Función para obtener todos los Pokémon disponibles en la API
const getAllPokemones = async () => {
  try {
    // Realiza una solicitud GET para obtener todos los Pokémon
    const response = await axios.get(`${BASE_URL}?limit=100000&offset=0`);
    return response.data.results; // Retorna solo los resultados (lista de Pokémon)
  } catch (error) {
    throw error; // Vuelve a lanzar el error para su manejo en otro lugar
  }
};

// Función para obtener los detalles de un Pokémon específico a través de su URL
const getPokemonDetail = async (url) => {
  try {
    // Realiza una solicitud GET a la URL del Pokémon
    const response = await axios.get(url);
    return response.data; // Retorna los datos de la respuesta (detalles del Pokémon)
  } catch (error) {
    throw error; // Vuelve a lanzar el error para su manejo en otro lugar
  }
};

// Exporta las funciones para su uso en otros módulos
export default {
  getPokemones, // Exporta la función para obtener una lista de Pokémon
  getPokemonDetail, // Exporta la función para obtener detalles de un Pokémon específico
  getAllPokemones // Exporta la función para obtener todos los Pokémon
};
