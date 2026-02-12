import { State } from "../state.js";

export function mapCallback(page: "next" | "prev") {
  return async (state: State) => {
    const locations = await state.pokeapi.fetchPage(page);

    for (const location of locations) {
      console.log(location.name);
    }
  };
}

export async function commandExplore(state: State, ...args: string[]) {
  if (args.length == 0) {
    throw new Error("Missing location");
  }
  if (args.length > 1) {
    throw new Error("Wrong number of argument");
  }

  const locationName = args[0];
  const location = await state.pokeapi.fetchLocation(locationName);

  console.log(`Exploring ${locationName}...\nFound Pokémons:`);
  for (const encounter of location.pokemon_encounters) {
    console.log(` - ${encounter.pokemon.name}`);
  }
}
