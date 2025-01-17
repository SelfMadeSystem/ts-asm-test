import { Environment } from './src/environment';
import { Interpreter } from './src/interpreter';
import * as fs from 'fs';

const file = 'output.bin';

const bytecodeBuffer = fs.readFileSync(file);
const bytecode = new Uint8Array(bytecodeBuffer);

const env = new Environment();
const itp = new Interpreter(env);

itp.run(bytecode);
