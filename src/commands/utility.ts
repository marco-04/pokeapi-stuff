import { getCommands, type CLICommand } from "./commands.js";
import { State } from "../state.js";

export async function commandExit(state: State) {
  console.log("Closing the Pokedex... Goodbye!");
  state.repl.close()
  process.exit(0);
}

export async function commandHelp(_: State) {
  const cmds = getCommands();
  console.log("Welcome to the Pokedex!\nUsage:");
  for (const cmd in cmds) {
    if (cmds[cmd] satisfies CLICommand) {
      console.log(`${cmd}: ${cmds[cmd].description}`);
    }
  }
}

