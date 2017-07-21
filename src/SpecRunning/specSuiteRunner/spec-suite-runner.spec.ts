import {ISpecContainer} from "../../SpecStorage/specContainer/iSpec-Container";
import {ExampleSpecFiller} from "../../utils/testData/example-spec-filler";
import {SpecSuiteRunner} from "./spec-suite-runner";

describe('SpecSuiteRunner', () => {
  it('should init with Spec Array', ()=>{
    let specs = new Array<ISpecContainer>();
    specs.push(ExampleSpecFiller.getStandardSpec());

    let suiteRunner = new SpecSuiteRunner(specs);

    expect(suiteRunner).not.toBeNull();
  });
});
