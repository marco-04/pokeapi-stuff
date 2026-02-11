import { State } from "../state.js";

export function mapCallback(page: "next" | "prev") {
  return async (state: State) => {
    const locations = await state.pokeapi.fetchPage(page);

    for (const location of locations) {
      console.log(location.name);
    }
  };
}
