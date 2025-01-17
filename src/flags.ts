export class Flags {
  public zero: boolean = false;
  public carry: boolean = false;
  public negative: boolean = false;
  public overflow: boolean = false;

  public setFlags(value: number): void {
    this.zero = value === 0;
    this.negative = value < 0;
    this.overflow = value > 0x7fffffff || value < -0x80000000;
    this.carry = value > 0xffffffff || value < 0;
  }
}
