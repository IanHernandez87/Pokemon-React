import axios from 'axios';

const BASE_URL = 'https://pokeapi.co/api/v2/pokemon';

const getPokemones = async (limit, offset) => {
  try {
    const response = await axios.get(`${BASE_URL}?limit=${limit}&offset=${offset}`);
    return response.data.results; 
  } catch (error) {
    console.error("Error al obtener los Pokémon::", error);
    throw error; 
  }
};

export default {
  getPokemones, 
};
