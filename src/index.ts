import { Environment } from './environment';
import { Interpreter } from './interpreter';
import { parse } from './parser';

const env = new Environment();
const itp = new Interpreter(env);

/* prettier-ignore */
const bytecode = parse([
  "set", 0, 10, // Set register 0 to 10 (number of lines)
  "set", 1, 42, // Set register 1 to 42 (ASCII code for '*')
  "[loop", // Label the loop
  "subv", 0, 0, 1, // Subtract 1 from register 0
  "asciir", 1, // Output '*'
  "asciiv", 32, // Output space (ASCII code 32)
  "cmpv", 0, 0, // Compare register 0 to 0
  "]loop:jnz", // Jump to loop if comparison was not zero
  "flush"
]);

itp.run(bytecode);
