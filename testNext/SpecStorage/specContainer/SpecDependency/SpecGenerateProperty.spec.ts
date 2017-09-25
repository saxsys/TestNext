import {SpecGeneratorOfProperty} from "./SpecDependency";
import {SpecRegistryError} from "../../spec-registry-error";
import {Inject, Injectable, ReflectiveInjector} from "@angular/core";
import {Car} from "../../../../src/playGround/injectionTestfied/car";
import {Engine} from "../../../../src/playGround/injectionTestfied/engine";

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
      mock: {}
    };

    specDep.addDependencies([depProv]);

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
    specDep.addDependencies([{provide: ADependency}, {provide: OtherDependency}, {provide:NestedDependency}]);
    let retObj = specDep.generateWithMock();

    expect(retObj).not.toBeNull();
    expect(retObj).not.toBeUndefined();
    expect(retObj.dep.depVal).toBe(3);
    expect(retObj.dep.nestDep).not.toBeNull();
  });

  it('should generate the Type with real Dependency, with Mock', () => {
    let specDep = new SpecGeneratorOfProperty('SpecClass', 'prop');
    specDep.setTypeToGenerate(TypeToGenerateWithDep);
    specDep.addDependencies([
      {provide:ADependency, mock:{depVal:8}},
      {provide:OtherDependency, mock:{}},
      {provide:NestedDependency, mock:{}}
    ]);
    let retObj = specDep.generateWithMock();

    expect(retObj).not.toBeNull();
    expect(retObj).not.toBeUndefined();
    expect(retObj.dep.depVal).toBe(8);
  });

  it('should prefer Mocks over real Implementation', ()=>{
    let specDep = new SpecGeneratorOfProperty('SpecClass', 'prop');
    specDep.setTypeToGenerate(TypeToGenerateWithDep);
    specDep.addDependencies([
      {provide:ADependency},
      {provide:OtherDependency, mock:{mock:true}},
      {provide:NestedDependency, mock:{}}
    ]);
    let retObj = specDep.generateWithMock();

    expect(retObj).not.toBeNull();
    expect(retObj).not.toBeUndefined();
    expect(retObj.dep.depVal).toBe(3);
    expect(retObj.otherDep.mock).toBeTruthy();
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
    specDep.addDependencies([{provide: ADependency}, {provide: OtherDependency}, {provide:NestedDependency}]);
    let retObj = specDep.generateReal();

    expect(retObj).not.toBeNull();
    expect(retObj).not.toBeUndefined();
    expect(retObj.dep.depVal).toBe(3);
  });

});
