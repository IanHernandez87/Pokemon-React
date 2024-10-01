import axios from 'axios';

const BASE_URL = 'https://pokeapi.co/api/v2/pokemon';

// Función para obtener la lista de Pokémon
const getPokemones = async (limit, offset) => {
  try {
    const response = await axios.get(`${BASE_URL}?limit=${limit}&offset=${offset}`);
    return response.data.results; 
  } catch (error) {
    console.error("Error al obtener los Pokémon:", error);
    throw error; 
  }
};

const getPokemonDetail = async (url) => {
  try {
    const response = await axios.get(url);
    return response.data; 
  } catch (error) {
    console.error("Error al obtener los detalles del Pokémon:", error);
    throw error;
  }
};

export default {
  getPokemones,
  getPokemonDetail, // Añadimos esta función para obtener detalles individuales
};
