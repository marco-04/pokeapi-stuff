import { commandExit, commandHelp } from "./utility.js";
import { mapCallback } from "./map.js";
import { type State } from "../state.js";

export type CLICommand = {
  description: string;
  callback: (state: State) => Promise<void>;
}

export function getCommands(): Record<string, CLICommand> {
  return {
    exit: {
      description: "Exits the pokedex",
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
  };
}
