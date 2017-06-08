import {SpecRunLogger} from "../spec-run-logger/spec-logger";
import {MultiSpecRunner} from "../multiSpecRunner/multi-spec-runner";
import {SuccessLogBeautyfier} from "../spec-run-logger/spec-log-beautyfier";
import {SpecRegistry} from "../specRegistry/spec-registry";
import {SingleSpecRunner} from "../multiSpecRunner/singleSpecRunner/single-spec-runner";

export class SpecExecChooser{
  static execAllSpecs(){

    let specReg = SpecRegistry.getRegistryEntries();
    let specLogger = new SpecRunLogger();
    let specRunner = new MultiSpecRunner(specReg, specLogger);
    specRunner.buildSingleSpecRunners();

    console.log(specReg.length + ' specs to run');

    //Print Building Errors
    let buildingErrors = specRunner.getBuildingErrors();
    if(buildingErrors.size >0) {
      console.log(' ____________________________________\n' +
        '| BUILDING-ERRORS: ' + buildingErrors.size + '                 |\n');
      buildingErrors.forEach((error)=>{
        console.log('| ' + error.message);
      });
      console.log('\n|____________________________________|\n');
    }

    specRunner.runSpecs();

    //Print
    console.log(specLogger.getLogs().length + ' logs');
    specLogger.getLogs().forEach((specLog) => {
      console.log(SuccessLogBeautyfier.SpecLogToString(specLog));
    });
  }

  static execBySubjects() {
    let subjects = SpecRegistry.getSubjects();

    subjects.forEach((subject) => {
      SpecExecChooser.execSubject(subject);
    });
  }

  static execSubject(subject: string){
    console.log('---------------------------------------');
    console.log(subject);
    let specs = SpecRegistry.getSpecsForSubject(subject);
    let specLogger = new SpecRunLogger();
    let specRunner = new MultiSpecRunner(specs, specLogger);
    specRunner.buildSingleSpecRunners();

    let buildingErrors = specRunner.getBuildingErrors();
    if(buildingErrors.size >0) {
      console.log('    ____________________________________\n' +
        '   | BUILDING-ERRORS: ' + buildingErrors.size + '                 |\n');
      buildingErrors.forEach((error)=>{
        console.log('   | ' + error.message);
      });
      console.log('\n   |____________________________________|\n');
    }

    specRunner.runSpecs();
    specLogger.getLogs().forEach((specLog) => {
      console.log(SuccessLogBeautyfier.SpecLogToString(specLog, 3));
    });
  }

  static execSpec(className:string){
    let spec = SpecRegistry.getSpecByClassName(className);
    if(spec == null ){
      console.log('no SpecClasses with Name "' + className + '" found \n' +
      'we got: ' + SpecRegistry.getSpecClassNames()
      );
      return;
    }

    let specLogger = new SpecRunLogger();
    let specRunner;
    try {
      specRunner = new SingleSpecRunner(spec, specLogger);
    } catch (error){
      console.log(  '____________________________________\n' +
                    '| BUILDING-ERROR                    |\n');
      console.log(  '| ' + error.message + '');
      console.log('\n|___________________________________|\n');
      return;
    }

    //Print Building Errors
    specRunner.runSpec();

    //Print
    specLogger.getLogs().forEach((specLog) => {
      console.log(SuccessLogBeautyfier.SpecLogToString(specLog));
    });
  }



}
