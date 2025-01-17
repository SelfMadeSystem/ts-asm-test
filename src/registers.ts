export class Registers {
  public registers: number[] = new Array(16).fill(0);

  public getRegister(register: number): number {
    return this.registers[register];
  }

  public setRegister(register: number, value: number): void {
    this.registers[register] = value;
  }
}