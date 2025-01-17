import { parse } from './src/parser';
import * as fs from 'fs';

const file = 'output.bin';

/* prettier-ignore */
const bytecode: Uint8Array = parse([
  "set", 0, 10, // Set register 0 to 10 (number of lines)
  "set", 1, 42, // Set register 1 to 42 (ASCII code for '*')
  "[loop", // Label the loop
  "subv", 0, 0, 1, // Subtract 1 from register 0
  ")print", // Call the print function
  "cmpv", 0, 0, // Compare register 0 to 0
  "]loop:jnz", // Jump to loop if comparison was not zero
  "flush", // Flush the output buffer
  "halt", // Halt the program
  "(print", // Label the print function
  "asciiv", 32, // Output ' '
  "asciir", 1, // Output the value of register 1 as an ASCII character
  "ret", // Return from the function
]);

fs.writeFileSync(file, bytecode);
