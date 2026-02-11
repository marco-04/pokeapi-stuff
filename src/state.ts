import { createInterface, type Interface } from "node:readline";
import { styleText } from "node:util";
import { PokeAPI } from "./pokeapi.js";

export type State = {
  repl: Interface,
  pokeapi: PokeAPI
}

export function initState() {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: styleText("bold", "pokeapi > ")
  });

  return {
    repl: rl,
    pokeapi: new PokeAPI()
  };
}
