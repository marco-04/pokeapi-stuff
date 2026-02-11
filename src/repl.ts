import { createInterface } from 'node:readline';

import type { CLICommand } from './commands/commands.js';
import { getCommands } from './commands/commands.js';

export function cleanInput(input: string): string[] {
  return input.trim().toLowerCase().replaceAll(/ +/gi, " ").split(" ");
}

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: "pokeapi > "
})

export function startRepl() {
  rl.prompt();
  rl.on("line", (input: string) => {
    if (input.length === 0) {
      rl.prompt();
      return;
    }

    const line = cleanInput(input);

    const cmds = getCommands();
    const cmd = cmds[line[0]];

    if (cmd !== undefined) {
      if (line[0] === "help") {
        cmd.callback(cmds)
      } else {
        cmd.callback({});
      }
    } else {
      console.log("Unknown command");
    }

    rl.prompt();
  });
}
