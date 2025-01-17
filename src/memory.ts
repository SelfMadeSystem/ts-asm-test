export class Memory {
  public readonly memory: Uint8Array;

  constructor(public readonly size: number) {
    this.memory = new Uint8Array(size);
  }

  public read(address: number): number {
    return this.memory[address];
  }

  public write(address: number, value: number): void {
    this.memory[address] = value;
  }
}
