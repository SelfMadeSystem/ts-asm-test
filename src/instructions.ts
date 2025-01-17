import type { Environment } from './environment';

let instructionCounter = 0;

export class InstructionImpl {
  public readonly opcode: number;
  constructor(
    public readonly operands: number,
    public readonly execute: (env: Environment, operands: number[]) => void,
  ) {
    this.opcode = instructionCounter++;
  }
}

const ni = (
  operands: number,
  execute: (env: Environment, operands: number[]) => void,
) => new InstructionImpl(operands, execute);

/*
 * w: register to write to
 * r: read from register
 * v: immediate value
 * p: program counter
 * a: memory address
 */

export const instructions = {
  // Basic instructions
  set: ni(2, (env, [w, v]) => env.setRegister(w, v)),
  move: ni(2, (env, [w, r]) => env.setRegister(w, env.getRegister(r))),
  // Arithmetic instructions
  add: ni(3, (env, [w, r1, r2]) =>
    env.setRegister(w, env.getRegister(r1) + env.getRegister(r2)),
  ),
  addv: ni(3, (env, [w, r, v]) => env.setRegister(w, env.getRegister(r) + v)),
  sub: ni(3, (env, [w, r1, r2]) =>
    env.setRegister(w, env.getRegister(r1) - env.getRegister(r2)),
  ),
  subv: ni(3, (env, [w, r, v]) => env.setRegister(w, env.getRegister(r) - v)),
  mul: ni(3, (env, [w, r1, r2]) =>
    env.setRegister(w, env.getRegister(r1) * env.getRegister(r2)),
  ),
  mulv: ni(3, (env, [w, r, v]) => env.setRegister(w, env.getRegister(r) * v)),
  div: ni(3, (env, [w, r1, r2]) =>
    env.setRegister(w, env.getRegister(r1) / env.getRegister(r2)),
  ),
  divv: ni(3, (env, [w, r, v]) => env.setRegister(w, env.getRegister(r) / v)),
  // Bitwise instructions
  not: ni(2, (env, [w, r]) => env.setRegister(w, ~env.getRegister(r))),
  and: ni(3, (env, [w, r1, r2]) =>
    env.setRegister(w, env.getRegister(r1) & env.getRegister(r2)),
  ),
  andv: ni(3, (env, [w, r, v]) => env.setRegister(w, env.getRegister(r) & v)),
  or: ni(3, (env, [w, r1, r2]) =>
    env.setRegister(w, env.getRegister(r1) | env.getRegister(r2)),
  ),
  orv: ni(3, (env, [w, r, v]) => env.setRegister(w, env.getRegister(r) | v)),
  xor: ni(3, (env, [w, r1, r2]) =>
    env.setRegister(w, env.getRegister(r1) ^ env.getRegister(r2)),
  ),
  xorv: ni(3, (env, [w, r, v]) => env.setRegister(w, env.getRegister(r) ^ v)),
  // Shift instructions
  shl: ni(3, (env, [w, r, v]) => env.setRegister(w, env.getRegister(r) << v)),
  shr: ni(3, (env, [w, r, v]) => env.setRegister(w, env.getRegister(r) >> v)),
  // Logical instructions
  lnot: ni(2, (env, [w, r]) => env.setRegister(w, env.getRegister(r) ? 0 : 1)),
  land: ni(3, (env, [w, r1, r2]) =>
    env.setRegister(w, env.getRegister(r1) && env.getRegister(r2) ? 1 : 0),
  ),
  lor: ni(3, (env, [w, r1, r2]) =>
    env.setRegister(w, env.getRegister(r1) || env.getRegister(r2) ? 1 : 0),
  ),
  // Comparison instructions
  cmp: ni(2, (env, [r1, r2]) =>
    env.flags.setFlags(env.getRegister(r1) - env.getRegister(r2)),
  ),
  cmpv: ni(2, (env, [r, v]) => env.flags.setFlags(env.getRegister(r) - v)),
  seq: ni(3, (env, [w, r1, r2]) =>
    env.setRegister(w, env.getRegister(r1) === env.getRegister(r2) ? 1 : 0),
  ),
  seqv: ni(3, (env, [w, r, v]) =>
    env.setRegister(w, env.getRegister(r) === v ? 1 : 0),
  ),
  // Control flow instructions
  jmp: ni(1, (env, [p]) => env.jump(p)),
  je: ni(1, (env, [p]) => env.flags.zero && env.jump(p)),
  jne: ni(1, (env, [p]) => !env.flags.zero && env.jump(p)),
  jg: ni(1, (env, [p]) => env.flags.negative && env.jump(p)),
  jge: ni(
    1,
    (env, [p]) => (env.flags.negative || env.flags.zero) && env.jump(p),
  ),
  jl: ni(1, (env, [p]) => !env.flags.negative && env.jump(p)),
  jle: ni(
    1,
    (env, [p]) => (!env.flags.negative || env.flags.zero) && env.jump(p),
  ),
  jz: ni(1, (env, [p]) => env.flags.zero && env.jump(p)),
  jnz: ni(1, (env, [p]) => !env.flags.zero && env.jump(p)),
  // Stack instructions
  push: ni(1, (env, [r]) => env.push(env.getRegister(r))),
  pop: ni(1, (env, [w]) => env.setRegister(w, env.pop())),
  read: ni(2, (env, [w, r]) =>
    env.setRegister(w, env.read(env.getRegister(r))),
  ),
  peek: ni(1, (env, [w]) => env.setRegister(w, env.peek())),
  // Memory instructions
  load: ni(2, (env, [w, a]) =>
    env.setRegister(w, env.read(env.getRegister(a))),
  ),
  store: ni(2, (env, [a, r]) =>
    env.memory.write(env.getRegister(a), env.getRegister(r)),
  ),
  // Function instructions
  call: ni(1, (env, [p]) => env.call(p)),
  ret: ni(0, env => env.ret()),
} as const;

export function g(t: keyof typeof instructions) {
  return instructions[t].opcode;
}

export const instructionsByOpcode = Object.fromEntries(
  Object.values(instructions).map(i => [i.opcode, i]),
) as Record<number, InstructionImpl>;
