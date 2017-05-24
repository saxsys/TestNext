export class TestMethodRegistryEntry {
  private name: string;
  private description: string;
  private execNumber: number;

  constructor(name: string, description: string, execNumber?: number) {
    this.name = name;
    this.description = description;
    this.execNumber = execNumber;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

}
