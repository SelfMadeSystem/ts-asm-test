import type { Environment } from './environment';
import { instructionsByOpcode, nameFromOpcode } from './instructions';

export class Interpreter {
  constructor(private env: Environment) {}

  run(bytecode: Uint8Array) {
    while (this.env.pc < bytecode.length) {
      const opcode = bytecode[this.env.pc];
      this.env.incrPc();
      const instruction = instructionsByOpcode[opcode];
      if (!instruction) {
        throw new Error(`Unknown opcode: ${opcode}`);
      }

      const operands = [];
      for (let i = 0; i < instruction.operands; i++) {
        operands.push(bytecode[this.env.pc]);
        this.env.incrPc();
      }

      instruction.execute(this.env, operands);
    }
  }
}
