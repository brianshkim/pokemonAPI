const GET_POKEMON = "pokemon/GET_POKEMON";
const GET_ALL_POKEMON = "pokemon/GET_ALL_POKEMON";

const getpokemon = (pokemon) => ({
  type: GET_POKEMON,
  pokemon,
});

const getAllPokemon = (pokemon) => ({
  type: GET_ALL_POKEMON,
  pokemon,
});

export const get_pokemon = (name) => async (dispatch) => {
  if(name.length < 1) return { error: "Pokemon not found" };
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name} `);

  if (response.ok) {
    const data = await response.json();
    dispatch(getpokemon(data));
    return data;
  } else if (response.status < 500) {
    return { error: "Pokemon not found" };
  } else {
    return { error: "An error occurred. Please try again." };
  }
};

export const get_all_pokemon = () => async (dispatch) => {
  const response = await fetch(
    "https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0"
  );

  if (response.ok) {
    const data = await response.json();
    dispatch(getAllPokemon(data.results));
    return data.results;
  } else if (response.status < 500) {
    return { error: "Pokemon not found" };
  } else {
    return { error: "An error occurred. Please try again." };
  }
};

let initialState = { pokemon: {}, list: [], fullList: [] };
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_POKEMON:
      let newList = [...state.list];
      newList.push(action.pokemon);
      return { ...state, pokemon: action.pokemon, list: newList };
    case GET_ALL_POKEMON:
      return { ...state, fullList: action.pokemon };

    default:
      return state;
  }
}
