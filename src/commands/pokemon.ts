import { type State } from "../state.js";

async function sleep(ms: number) {
  await new Promise((resolve, _) => { setTimeout(() => { resolve({}); }, ms) });
}

export async function commandCatch(state: State, ...args: string[]) {
  const MAX_BASE_EXPERIENCE = 500;

  if (args.length == 0) {
    throw new Error("Missing pokemon name");
  }
  if (args.length > 1) {
    throw new Error("Wrong number of argument");
  }

  const pokemonName = args[0];
  const pokemon = await state.pokeapi.fetchPokemon(pokemonName);

  console.log(`Throwing a Pokeball at ${pokemonName}...`);
  const caught = (Math.random() * MAX_BASE_EXPERIENCE) % MAX_BASE_EXPERIENCE >= pokemon.base_experience;

  await sleep(1000);
  for (let i = 0; i < 3; i++) {
    if (caught || Math.floor(Math.random() * MAX_BASE_EXPERIENCE) % 2 == 0) {
      console.log("...");
    } else {
      break;
    }
    await sleep(1000);
  }
  if (caught) {
    console.log(`${pokemonName} was caught!`);
    state.pokeapi.registerPokemon(pokemon);
  } else {
    console.log(`${pokemonName} escaped!`);
  }
}

export async function commandInspect(state: State, ...args: string[]) {
  if (args.length == 0) {
    throw new Error("Missing pokemon name");
  }
  if (args.length > 1) {
    throw new Error("Wrong number of argument");
  }

  const pokemonName = args[0];
  const pokemon = await state.pokeapi.fetchPokemon(pokemonName);

  if (!state.pokeapi.getRegisteredPokemons().includes(pokemon.name)) {
    console.log(`You haven't caught ${pokemon.name} yet`);
    return;
  }

  console.log(`Name: ${pokemon.name}
Height: ${pokemon.height}
Weight: ${pokemon.weight}
Stats:`);
  for (const stat of pokemon.stats) {
    console.log(` - ${stat.stat.name}: ${stat.base_stat}`);
  }
  console.log("Types:");
  for (const typ of pokemon.types) {
    console.log(` - ${typ.type.name}`);
  }
}

export async function commandPokedex(state: State) {
  console.log("Your Pokédex:");
  for (const pokemon of state.pokeapi.getRegisteredPokemons()) {
    console.log(` - ${pokemon}`);
  }
}

