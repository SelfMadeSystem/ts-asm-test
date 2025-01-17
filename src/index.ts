import { Environment } from './environment';
import { g } from './instructions';
import { Interpreter } from './interpreter';

const env = new Environment();
const parser = new Interpreter(env);

// Example bytecode: [opcode, operand1, operand2, ...]
/* prettier-ignore */
const bytecode = new Uint8Array([
  g('set'), 1, 42, // set r1 to 42
  g('set'), 2, 100, // set r2 to 100
  g('add'), 3, 1, 2, // add r1 and r2, store in r3
]);

console.log(bytecode);

parser.run(bytecode);

console.log(env.getRegister(3)); // 142
