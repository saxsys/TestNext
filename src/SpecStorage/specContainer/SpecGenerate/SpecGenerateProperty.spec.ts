import {SpecGeneratorOfProperty} from "./SpecGenerate";
import {SpecRegistryError} from "../../spec-registry-error";
import {Injectable, } from "@angular/core";

describe('SpecGeneratorOfProperty.setTypeToGenerate', () => {
  let specDep;

  beforeEach(() => {
    specDep = new SpecGeneratorOfProperty('class', 'prop');
  });

  class TypeToGenerate {
  }


  it('should save the TypeToGenerate', () => {
    specDep.setTypeToGenerate(TypeToGenerate);

    let retType = specDep.getTypeToGenerate();
    expect(retType).toEqual(TypeToGenerate);
  });

  it('should not be allowed to set mulitple TypeToGenerate', () => {
    class OtherType {
    }

    specDep.setTypeToGenerate(TypeToGenerate);

    expect(() => {
      specDep.setTypeToGenerate(OtherType)
    }).toThrowError(SpecRegistryError, 'You Cannot set multiple Generate on one Property: class.prop');
  })
});

describe('SpecGeneratorOfProperty.setDependencies', () => {
  let specDep;

  beforeEach(() => {
    specDep = new SpecGeneratorOfProperty('class', 'prop');
  });

  class DependencyType {
  }


  it('should save the Dependency of the TypeToGenerate', () => {
    let depProv = {
      provide: 'DependencyType',
      dependency: DependencyType,
      mockObject: {}
    };

    specDep.addProviders([depProv]);

    let retType = specDep.getDependencies();
    expect(retType).toEqual([depProv]);
  });


});

describe('SpecGeneratorOfProperty.generateWithMock', () => {

  class TypeToGenerate {
    public val = 1
  }

  @Injectable()
  class NestedDependency{}

  @Injectable()
  class ADependency {

    public depVal;
    public nestDep;
    constructor(nestDep:NestedDependency) {
      this.depVal = 3;
      this.nestDep = nestDep;
    }
  }

  @Injectable()
  class OtherDependency{}

  @Injectable()
  class TypeToGenerateWithDep {
    public dep;
    public otherDep;
    constructor(dep: ADependency, otherDep:OtherDependency) {
      this.dep = dep;
      this.otherDep = otherDep;
    }
  }

  class MockADependency{
    public depVal = 8;
    public mock = true;
    public mockClass = true;
  }

  class MockOtherDependency{
    public mock = true;
    public mockClass = true;
  }

  it('should generate the Type without Dependency', () => {
    let specDep = new SpecGeneratorOfProperty('SpecClass', 'prop');
    specDep.setTypeToGenerate(TypeToGenerate);
    let retObj = specDep.generateWithMock();

    expect(retObj).not.toBeNull();
    expect(retObj).not.toBeUndefined();
    expect(retObj.val).toBe(1);
  });

  it('should generate the Type with real Dependency, when mock does not exist', () => {
    let specDep = new SpecGeneratorOfProperty('SpecClass', 'prop');
    specDep.setTypeToGenerate(TypeToGenerateWithDep);
    specDep.addProviders([{provide: ADependency}, {provide: OtherDependency}, {provide:NestedDependency}]);
    let retObj = specDep.generateWithMock();

    expect(retObj).not.toBeNull();
    expect(retObj).not.toBeUndefined();
    expect(retObj.dep.depVal).toBe(3);
    expect(retObj.dep.nestDep).not.toBeNull();
  });

  it('should generate the Type with real Dependency, with Mock', () => {
    let specDep = new SpecGeneratorOfProperty('SpecClass', 'prop');
    specDep.setTypeToGenerate(TypeToGenerateWithDep);
    specDep.addProviders([
      {provide:ADependency, mockObject:{depVal:8}},
      {provide:OtherDependency, mockObject:{}},
      {provide:NestedDependency, mockObject:{}}
    ]);
    let retObj = specDep.generateWithMock();

    expect(retObj).not.toBeNull();
    expect(retObj).not.toBeUndefined();
    expect(retObj.dep.depVal).toBe(8);
  });

  it('should prefer Mocks over real Implementation', ()=>{
    let specDep = new SpecGeneratorOfProperty('SpecClass', 'prop');
    specDep.setTypeToGenerate(TypeToGenerateWithDep);
    specDep.addProviders([
      {provide:ADependency},
      {provide:OtherDependency, mockObject:{mock:true}},
      {provide:NestedDependency, mockObject:{}}
    ]);
    let retObj = specDep.generateWithMock();

    expect(retObj).not.toBeNull();
    expect(retObj).not.toBeUndefined();
    expect(retObj.dep.depVal).toBe(3);
    expect(retObj.otherDep.mock).toBeTruthy();
  });

  it('should use the Mock Class when given',()=>{
    let specDep = new SpecGeneratorOfProperty('SpecClass', 'prop');
    specDep.setTypeToGenerate(TypeToGenerateWithDep);
    specDep.addProviders([
      {provide:ADependency, mockClass:MockADependency},
      {provide:OtherDependency, mockClass:MockOtherDependency}
      //{provide:NestedDependency, mockClass:}
    ]);
    let retObj = specDep.generateWithMock();

    expect(retObj).not.toBeNull();
    expect(retObj).not.toBeUndefined();
    expect(retObj.dep.depVal).toBe(8);
    expect(retObj.dep.mock).toBeTruthy();
    expect(retObj.dep.mockClass).toBeTruthy();
  });

  it('should prefer the MockClass over MockObject', ()=>{
    let specDep = new SpecGeneratorOfProperty('SpecClass', 'prop');
    specDep.setTypeToGenerate(TypeToGenerateWithDep);
    specDep.addProviders([
      {provide:ADependency, mockClass:MockADependency},
      {provide:OtherDependency, mockClass:MockOtherDependency, mockObject:{mock:true, mockClass:false}}
      //{provide:NestedDependency, mockClass:}
    ]);
    let retObj = specDep.generateWithMock();

    expect(retObj).not.toBeNull();
    expect(retObj).not.toBeUndefined();
    expect(retObj.dep.depVal).toBe(8);
    expect(retObj.dep.mock).toBeTruthy();
    expect(retObj.dep.mockClass).toBeTruthy();
  });
});

describe('SpecGeneratorOfProperty.generateReal', () => {

  class TypeToGenerate {
    public val = 1
  }

  @Injectable()
  class NestedDependency{}

  @Injectable()
  class ADependency {

    public depVal;
    public nestDep;
    constructor(nestDep:NestedDependency) {
      this.depVal = 3;
      this.nestDep = nestDep;
    }
  }

  @Injectable()
  class OtherDependency{}

  @Injectable()
  class TypeToGenerateWithDep {
    public dep;
    public otherDep;
    constructor(dep: ADependency, otherDep:OtherDependency) {
      this.dep = dep;
      this.otherDep = otherDep;
    }
  }

  it('should generate the Type without Dependency', () => {
    let specDep = new SpecGeneratorOfProperty('SpecClass', 'prop');
    specDep.setTypeToGenerate(TypeToGenerate);
    let retObj = specDep.generateReal();

    expect(retObj).not.toBeNull();
    expect(retObj).not.toBeUndefined();
    expect(retObj.val).toBe(1);
  });

  it('should generate the Type with real Dependency', () => {
    let specDep = new SpecGeneratorOfProperty('SpecClass', 'prop');
    specDep.setTypeToGenerate(TypeToGenerateWithDep);
    specDep.addProviders([{provide: ADependency}, {provide: OtherDependency}, {provide:NestedDependency}]);
    let retObj = specDep.generateReal();

    expect(retObj).not.toBeNull();
    expect(retObj).not.toBeUndefined();
    expect(retObj.dep.depVal).toBe(3);
  });

  it('should accept Real Objects of the Class', ()=>{
    let specDep = new SpecGeneratorOfProperty('SpecClass', 'prop');
    specDep.setTypeToGenerate(TypeToGenerateWithDep);

    let objOfOtherDep = new OtherDependency();
    let objOfADep = new ADependency(new NestedDependency);
    objOfADep["isObj"] = true;
    objOfOtherDep["isObj"];

    specDep.addProviders([{provide: ADependency, useObject:objOfADep}, {provide: OtherDependency, useObject:objOfOtherDep}]);
    let retObj = specDep.generateReal();

    expect(retObj).not.toBeNull();
    expect(retObj).not.toBeUndefined();
    expect(retObj.dep.depVal).toBe(3);
    expect(retObj.dep.isObj).toBeTruthy();
    expect(retObj.otherDep).not.toBeUndefined();
  });

  it('should accept Other Classes as Provider', ()=>{
    let specDep = new SpecGeneratorOfProperty('SpecClass', 'prop');
    specDep.setTypeToGenerate(TypeToGenerateWithDep);

    class SecOtherDependency {
      public isAlternative = true;
    }
    class SecADependency{
      depVal = 3;
      public isAlternative = true;
    }


    specDep.addProviders([{provide: ADependency, useClass:SecADependency}, {provide: OtherDependency, useClass:SecOtherDependency}]);
    let retObj = specDep.generateReal();

    expect(retObj).not.toBeNull();
    expect(retObj).not.toBeUndefined();
    expect(retObj.dep.depVal).toBe(3);
    expect(retObj.dep.isAlternative).toBeTruthy('Not Used Class for ADependency');
    expect(retObj.otherDep.isAlternative).toBeTruthy('Not Used Class for OtherDependency');

  });

  it('should prefer useClass over useObject', ()=>{
    let specDep = new SpecGeneratorOfProperty('SpecClass', 'prop');
    specDep.setTypeToGenerate(TypeToGenerateWithDep);

    class SecOtherDependency {
      public isAlternative = true;
    }
    class SecADependency{
      depVal = 3;
      public isAlternative = true;
    }

    let objOfOtherDep = new OtherDependency();
    let objOfADep = new ADependency(new NestedDependency);
    objOfADep["isObj"] = true;
    objOfOtherDep["isObj"];

    specDep.addProviders([{provide: ADependency, useObject:objOfADep, useClass:SecADependency}, {provide: OtherDependency, useObject:objOfOtherDep, useClass:SecOtherDependency}]);
    let retObj = specDep.generateReal();

    expect(retObj).not.toBeNull();
    expect(retObj).not.toBeUndefined();
    expect(retObj.dep.depVal).toBe(3);
    expect(retObj.dep.isAlternative).toBeTruthy('Not Used Class for ADependency');
    expect(retObj.otherDep.isAlternative).toBeTruthy('Not Used Class for OtherDependency');
    expect(retObj.dep.isObj).toBeUndefined();
    expect(retObj.otherDep.isObj).toBeUndefined();

  });
});
