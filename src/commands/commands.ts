import { commandExit, commandHelp } from "./utility.js";

export type CLICommand = {
  description: string;
  callback: (args: Record<string, CLICommand>) => void;
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
  };
}
