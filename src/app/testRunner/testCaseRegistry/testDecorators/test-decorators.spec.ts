

import {Spec} from "./test-decorators";
import {SpecRegistry} from "../specRegistry";
describe('TestDecorators.Spec', () => {


  it('should register a Class with Spec-Decorator', () => {
    let specName = 'to Test Spec'
    @Spec(specName)class SpecClass{

    }

    let specRegEntry = SpecRegistry.getSpecByName(specName);
    expect(specRegEntry.getClassName()).toEqual('SpecClass');
    expect(specRegEntry.getSpecName()).toEqual(specName);
  });

  it('should refuse Spec with existing spec-name', () => {

    let specNameDouble = 'doubleSpecName';
    @Spec(specNameDouble) class SpecDoubleClass1{}
    expect(() => {
      @Spec(specNameDouble) class SpecDoubleClass2{}
    }).toThrow(
      new Error('SpecRegistry with same name already exists doubleSpecName (Class: SpecDoubleClass2)')
    )
  });

  it('should refuse Spec with existing class-name', () => {
    @Spec('ClassDouble1') class SpecClassDoubleDecoratorSpec{};
    expect(() => {
      @Spec('ClassDouble2') class SpecClassDoubleDecoratorSpec{};
    }).toThrow(new Error('SpecClassDoubleDecoratorSpec is already registered for Spec:ClassDouble1, can only be registered once, cannot register for Spec:ClassDouble2'));
  });
  it('should refuse one SpecClass with two Spec Decorators', () => {
    expect(() => {
      @Spec('SpecClassWith2SpecDecorator1')
      @Spec('SpecClassWith2SpecDecorator2')
      class SpecClassWith2SpecDecorator {}
    }).toThrow(new Error('SpecClassWith2SpecDecorator is already registered for Spec:SpecClassWith2SpecDecorator2, can only be registered once, cannot register for Spec:SpecClassWith2SpecDecorator1'))

  });

});

describe('TestDecorators.Given', () => {
// TODO tests for Given
});

describe('TestDecorators.When', () => {
// TODO tests for When
});

describe('TestDecorators.Then', () => {
  // TODO tests for Then
});
