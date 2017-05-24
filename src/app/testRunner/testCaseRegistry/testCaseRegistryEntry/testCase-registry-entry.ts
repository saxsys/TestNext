import {TestMethodRegistryEntry} from "../testMethodRegistryEntry/testMethod-registry-entry";
export class TestCaseRegistryEntry {
  private testClass: any;
  private description: string;

  private given = new Map<number, TestMethodRegistryEntry>(); // exec-Number, MethodName
  private when: TestMethodRegistryEntry;
  private then = new Map<number, TestMethodRegistryEntry>(); // exec-Number, MethodName

  constructor(testClass: any, description: string) {
    this.testClass = testClass;
    this.description = description;
  }

  addGiven(name: string, description: string, execNumber?: number) {
    if (execNumber == null) execNumber = 0;
    if (this.given == null) this.given = new Map<number, TestMethodRegistryEntry>();
    if (this.given.get(execNumber) != null)
      throw new Error('Multiple @given, without ExecNumber, or it (' + execNumber + ') already exists on ' + this.testClass.name + '.' + name);
    this.given.set(execNumber, new TestMethodRegistryEntry(name, description, execNumber));
  }

  addThen(name: string, description: string, execNumber: number) {
    if (execNumber == null) execNumber = 0;
    if (this.then == null) this.then = new Map<number, TestMethodRegistryEntry>();
    if (this.then.get(execNumber) != null)
      throw new Error('Multiple @then, without ExecNumber, or it (' + execNumber + ') already exists on ' + this.testClass.name + '.' + name);
    this.then.set(execNumber, new TestMethodRegistryEntry(name, description, execNumber));
  }

  addWhen(name: string, description: string) {
    if (this.when != null)
      throw new Error('@When (' + name + ') already exists on ' + this.testClass.name);
    this.when = new TestMethodRegistryEntry(name, description);
  }

  getDescription() {
    return this.description;
  }

  getClassName() {
    return this.testClass.name;
  }

  getClass() {
    return this.testClass;
  }

  getGivenArray(): Array<TestMethodRegistryEntry> {
    return Array.from(this.given.values());
  }

  getThenArray(): Array<TestMethodRegistryEntry> {
    return Array.from(this.then.values());
  }

  getWhen(): TestMethodRegistryEntry {
    return this.when;
  }
}
