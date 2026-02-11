import type { CLICommand } from "./commands.js";

export function commandExit(_: Record<string, CLICommand>) {
  console.log("Closing the Pokedex... Goodbye!");
  process.exit(0);
}

export function commandHelp(args: Record<string, CLICommand>) {
  console.log("Welcome to the Pokedex!\nUsage:");
  for (const cmd in args) {
    if (args[cmd] satisfies CLICommand) {
      console.log(`${cmd}: ${args[cmd].description}`);
    }
  }
}

