import { commandExit, commandHelp } from "./utility.js";
import { mapCallback, commandExplore } from "./map.js";
import { commandCatch, commandInspect } from "./pokemon.js";
import { type State } from "../state.js";

export type CLICommand = {
  description: string;
  callback: (state: State, ...args: string[]) => Promise<void>;
}

export function getCommands(): Record<string, CLICommand> {
  return {
    exit: {
      description: "Exits the Pokédex",
      callback: commandExit,
    },
    help: {
      description: "Print the help text",
      callback: commandHelp,
    },
    map: {
      description: "Fetch next page of locations",
      callback: mapCallback("next"),
    },
    mapb: {
      description: "Fetch previous page of locations",
      callback: mapCallback("prev"),
    },
    explore: {
      description: "List Pokémon encounters in an area",
      callback: commandExplore,
    },
    catch: {
      description: "Try to catch a Pokémon!",
      callback: commandCatch,
    },
    inspect: {
      description: "Inspect information of a caught Pokémon",
      callback: commandInspect,
    },
  };
}
