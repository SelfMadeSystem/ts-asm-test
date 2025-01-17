import type { InstructionName, JumpInstructionName } from './instructions';
import { getOpcodeFromName, instructions } from './instructions';

type Instruction =
  | InstructionName
  | number
  | `[${string}` // label
  | `]${string}:${JumpInstructionName}` // jump
  | `(${string}` // function
  | `)${string}`; // call

export function parse(stuff: Instruction[]): Uint8Array {
  const result: (number | string)[] = [];
  const jumpTable: Record<string, number> = {};

  for (let i = 0; i < stuff.length; i++) {
    const item = stuff[i];
    if (typeof item === 'string') {
      switch (item[0]) {
        case '[':
        case '(': { // the two are equivalent
          const label = item.slice(1);
          jumpTable[label] = result.length;
          break;
        }
        case ']': {
          // All jump instructions have a single operand (the label)
          const [label, jmp] = item.slice(1).split(':');
          result.push(getOpcodeFromName(jmp as JumpInstructionName));
          result.push(label);
          break;
        }
        case ')': {
          const label = item.slice(1);
          result.push(getOpcodeFromName('call'));
          result.push(label);
          break;
        }
        default: {
          if (!(item in instructions)) {
            throw new Error(`Unknown instruction: ${item}`);
          }
          result.push(getOpcodeFromName(item as InstructionName));
        }
      }
    } else {
      result.push(item);
    }
  }

  return new Uint8Array(
    result.map(item => (typeof item === 'string' ? jumpTable[item] : item)),
  );
}
