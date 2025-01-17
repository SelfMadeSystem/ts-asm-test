import { Flags } from './flags';
import { Memory } from './memory';
import { Pointers } from './pointers';
import { Registers } from './registers';

export class Environment {
  public registers: Registers = new Registers();
  public pointers: Pointers = new Pointers();
  public flags: Flags = new Flags();
  public memory: Memory = new Memory(1024);
  public stdoutBuffer: number[] = [];

  public get pc(): number {
    return this.pointers.instruction;
  }

  public incrPc(): void {
    this.pointers.instruction++;
  }

  public setRegister(register: number, value: number): void {
    this.registers.setRegister(register, value);
  }

  public getRegister(register: number): number {
    return this.registers.getRegister(register);
  }

  public push(value: number): void {
    const stack = this.pointers.stack;
    this.memory.write(stack, value);
    this.pointers.stack ++;
  }

  public pop(): number {
    this.pointers.stack --;
    return this.memory.read(this.pointers.stack);
  }

  public read(address: number): number {
    return this.memory.read(address);
  }

  public peek(): number {
    return this.memory.read(this.pointers.stack - 1);
  }

  public jump(address: number): void {
    this.pointers.instruction = address;
  }

  public call(address: number): void {
    this.pointers.ret.push(this.pointers.instruction);
    this.pointers.instruction = address;
  }

  public ret(): void {
    if (this.pointers.ret.length === 0) {
      process.emitWarning('Returning from empty stack');
    }
    this.pointers.instruction = this.pointers.ret.pop() ?? 0;
  }

  public log(v: number): void {
    this.stdoutBuffer.push(v);
  }

  public flush(): void {
    console.log(this.stdoutBuffer.map(v => String.fromCharCode(v)).join(''));
    this.stdoutBuffer = [];
  }
}
