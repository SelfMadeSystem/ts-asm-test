import type { InstructionName, JumpInstructionName } from './instructions';
import { getOpcodeFromName, instructions } from './instructions';

type Instruction = InstructionName | number | `[${string}` | `]${string}:${JumpInstructionName}`;

export function parse(stuff: Instruction[]): Uint8Array {
  const result: number[] = [];
  const jumpTable: Record<string, number> = {};

  for (let i = 0; i < stuff.length; i++) {
    const item = stuff[i];
    if (typeof item === 'string') {
      if (item.startsWith('[')) {
        const label = item.slice(1);
        jumpTable[label] = result.length;
      } else if (item.startsWith(']')) {
        // All jump instructions have a single operand (the label)
        const [label, jmp] = item.slice(1).split(':');
        result.push(getOpcodeFromName(jmp as JumpInstructionName));
        result.push(jumpTable[label]);
      } else {
        if (!(item in instructions)) {
          throw new Error(`Unknown instruction: ${item}`);
        }
        result.push(getOpcodeFromName(item as InstructionName));
      }
    } else {
      result.push(item);
    }
  }

  return new Uint8Array(result);
}