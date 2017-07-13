import {SpecLoader} from "./spec-loader";
import {SpecReportOutputConsole} from "../src/SpecRunning/RunReportOutput/spec-report-output-console";
import {SpecReporter} from "../src/SpecRunning/specReporting/specReporter/spec-reporter";
import {SpecExecArgumentParser} from "./spec-exec-argument-parser";
import {config} from "../testNext-config";
import {SpecExecChooser} from "../src/SpecRunning/specExecChooser/spec-exec-chooser";

let args = process.argv.slice(2);
let runMode = null;
if (args[0] != null && args[0] != 'help') {
//configure Run Mode from arguments
  runMode = config.runMode[args[0]];
}

if (runMode == null) {
  let modeNames = [];
  for (let modeName in config.runMode)
    modeNames.push(modeName);

  console.log('choose a run mode from:');
  modeNames.forEach((modeName) => {
    console.log('   ' + modeName + ': ' + config.runMode[modeName].heading);
  });
  console.log('\n optionally modify the output with: ');
  for (let outputMod in config.outputParameters) {
    console.log('   ' + outputMod + ': ' + config.outputParameters[outputMod].description);
  }

} else
  try {
    let additionalArguments = args.slice(1, 1 + runMode.additionalArgumentCount);

    let argsOutput = args.slice(1 + runMode.additionalArgumentCount);

    let reporter = new SpecReporter();
    let argParser = new SpecExecArgumentParser(argsOutput);
    let specRunOutput = new SpecReportOutputConsole(reporter);
    argParser.applyOnOutput(specRunOutput);

    specRunOutput.setHeading(runMode.heading + ' ' + additionalArguments);

    //load specs into Registry
    let registry = SpecLoader.loadSpecs();

    //execute Method
    SpecExecChooser[runMode.methodName](registry, reporter, ...additionalArguments);

    specRunOutput.outputResult();
  } catch (error) {
    console.error('\x1b[1;31m' + 'Error: ' + error + '\x1b[0m');
  }













