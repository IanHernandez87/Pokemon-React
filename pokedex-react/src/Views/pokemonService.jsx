import axios from 'axios';

const BASE_URL = 'https://pokeapi.co/api/v2/pokemon';

const getPokemones = async (limit, offset) => {
  try {
    const response = await axios.get(`${BASE_URL}?limit=${limit}&offset=${offset}`);
    return response.data.results; 
  } catch (error) {
    console.error("Error al obtener los Pokémon:", error);
    throw error; 
  }
};

const getAllPokemones = async () => {
  try {
    const response = await axios.get(`${BASE_URL}?limit=100000&offset=0`);
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
  getPokemonDetail, 
  getAllPokemones
};
