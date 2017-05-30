import {TestMethodRegistryEntry} from "../testMethodRegistryEntry/testMethod-registry-entry";
export class SpecRegistryEntry {
  private specClass: any;
  private specName: string;

  private given = new Map<number, TestMethodRegistryEntry>(); // exec-Number, MethodName
  private when: TestMethodRegistryEntry;
  private then = new Map<number, TestMethodRegistryEntry>(); // exec-Number, MethodName

  constructor(specClass: any) {
    this.specClass = specClass;
  }

  setSpecName(specName: string){
    this.specName = specName
  }

  addGiven(functionName: string, description: string, execNumber?: number) {
    if (execNumber == null) execNumber = 0;
    if (this.given == null) this.given = new Map<number, TestMethodRegistryEntry>();
    if (this.given.get(execNumber) != null)
      throw new Error('Multiple @given, without ExecNumber, or it (' + execNumber + ') already exists on ' + this.getClassName() + '.' + functionName);
    this.given.set(execNumber, new TestMethodRegistryEntry(functionName, description, execNumber));
  }

  addThen(functionName: string, description: string, execNumber: number) {
    if (execNumber == null) execNumber = 0;
    if (this.then == null) this.then = new Map<number, TestMethodRegistryEntry>();
    if (this.then.get(execNumber) != null)
      throw new Error('Multiple @then, without ExecNumber, or it (' + execNumber + ') already exists on ' + this.getClassName() + '.' + functionName);
    this.then.set(execNumber, new TestMethodRegistryEntry(functionName, description, execNumber));
  }

  addWhen(functionName: string, description: string) {
    if (this.when != null)
      {

        throw new Error('Only one @When allowed on ' + this.getClassName() + 'cannot add ' + functionName + ', ' + this.when.getName() + ' is already @When');
      }
    this.when = new TestMethodRegistryEntry(functionName, description);
  }

  getSpecName() {
    return this.specName;
  }

  getClassName() {

    return this.specClass.constructor.name;
  }

  getClass() {
    return this.specClass;
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
