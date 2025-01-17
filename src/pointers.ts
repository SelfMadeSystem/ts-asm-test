/**
 * Only reason this isn't part of the registers is because I'm lazy
 */
export class Pointers {
  public stack: number = 0;
  public base: number = 0;
  public instruction: number = 0;
  public ret: number[] = [];
}
