import { useState, useEffect } from "react";
import { get_pokemon } from "./store/getpokemon";
import { useDispatch, useSelector } from "react-redux";
import "./styles.css";
import { get_all_pokemon } from "./store/getpokemon";

export default function App() {
  const dispatch = useDispatch();

  const [pokemon, setPokemon] = useState({});

  const [name, setName] = useState("");
  const [error, setError] = useState([]);
  const cache = useSelector((state) => state.getpokemon.list);
  const search = useSelector((state) => state.getpokemon.fullList);

  useEffect(() => {
    dispatch(get_all_pokemon());
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const cachePokemon = cache.find((p) => p.name === name);

    if (cachePokemon?.name) {
      setError([]);
      setName(cachePokemon.name);
      setPokemon({ ...cachePokemon });
      return;
    }
    let newPokemon = await dispatch(get_pokemon(name));

    if (newPokemon.error) {
      setName("");
      setError(["Pokemon not found"]);
      setPokemon({});
    } else {
      setError([]);
      setPokemon(newPokemon);
    }
  };

  const handlePokemon = async (e, type) => {
    e.preventDefault();
    e.stopPropagation();

    if (type === "previous") {
      const cachePokemon = cache.find((p) => p.id === pokemon.id - 1);
      if (cachePokemon) {
        setName(cachePokemon.name);
        setPokemon(cachePokemon);
        return;
      }
      let newPokemon = await dispatch(get_pokemon(String(pokemon.id - 1)));

      if (newPokemon.error) {
        setError(["Pokemon not found"]);
        setPokemon({});
        setName("");
      } else {
        setError([]);
        setName(newPokemon.name);
        setPokemon(newPokemon);
      }
    } else if (type === "next") {
      const cachePokemon = cache.find((p) => p.id === pokemon.id + 1);
      if (cachePokemon) {
        setName(cachePokemon.name);
        setPokemon(cachePokemon);
        return;
      }
      let newPokemon = await dispatch(get_pokemon(String(pokemon.id + 1)));
      if (newPokemon.error) {
        setPokemon({});
        setError(["Pokemon not found"]);
        setName("");
      } else {
        setError([]);
        setName(newPokemon.name);
        setPokemon(newPokemon);
      }
    }
  };

  return (
    <div>
      <div>
        <h2>Get Pokemon</h2>
        <form onSubmit={onSubmit}>
          <label>Name</label>
          <datalist id="suggestions">
            {search?.map((p) => (
              <option key={p.name} value={p.name}></option>
            ))}
          </datalist>
          <input
            autoComplete="on"
            list="suggestions"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
        <div className="card">
          <div>Pokemon Name: {error.length > 0 ? error[0] : pokemon?.name}</div>
          <div>
            Pokemon Number:{" "}
            {error.length > 0 ? "no data available" : pokemon?.id}
          </div>
          <div>
            Pokemon Sprites:{" "}
            {error.length > 0 ? (
              "no data available"
            ) : (
              <span>
                <img src={pokemon?.sprites?.front_default} />
                <img src={pokemon?.sprites?.front_female} />
                <img src={pokemon?.sprites?.front_shiny} />
                <img src={pokemon?.sprites?.front_shiny_female} />
                <img src={pokemon?.sprites?.back_default} />
                <img src={pokemon?.sprites?.back_female} />
              </span>
            )}
          </div>
        </div>
        <div>
          <button onClick={(e) => handlePokemon(e, "previous")}>
            Previous
          </button>
          <button onClick={(e) => handlePokemon(e, "next")}>Next</button>
        </div>
      </div>
    </div>
  );
}
