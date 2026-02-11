import { initState } from './state.js';
import { getCommands } from './commands/commands.js';

export function cleanInput(input: string): string[] {
  return input.trim().toLowerCase().replaceAll(/ +/gi, " ").split(" ");
}

export function startRepl() {
  const state = initState();

  state.repl.prompt();
  state.repl.on("line", async (input: string) => {
    if (input.length === 0) {
      state.repl.prompt();
      return;
    }

    const line = cleanInput(input);

    const cmds = getCommands();
    const cmd = cmds[line[0]];

    if (cmd !== undefined) {
      try {
        await cmd.callback(state)
      } catch(err: unknown) {
        console.log((err as Error).message)
      }
    } else {
      console.log("Unknown command");
    }

    state.repl.prompt();
  });
}
