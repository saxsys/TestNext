import {SpecLoader} from "./spec-loader";
import {SpecReportOutputConsole} from "../SpecRunning/RunReportOutput/spec-report-output-console";
import {SpecReporter} from "../SpecRunning/specReporting/specReporter/spec-reporter";
import {SpecExecArgumentParser} from "./spec-exec-argument-parser";
import {config} from "../testNext.config";
import {SpecExecChooser} from "../SpecRunning/specExecChooser/spec-exec-chooser";

/**
 * executing all Specs in dirPath
 * @param {string} dirPath
 * @param {string[]} args arguments for runMode, runMode-Argument, mock and output
 */
export function runTestNext(dirPath:string, args: string[]) {
  let runMode = null;
  let mock = false;
  if (args[0] != null && args[0] != 'help') {
//configure Run Mode from arguments
    runMode = config.runMode[args[0]];
  }

  if (runMode == null) {
    console.log('<RunMode> <RunMode-argument> <mock?> <output-arguments>');
    let modeNames = [];
    for (let modeName in config.runMode)
      modeNames.push(modeName);

    console.log('choose a run mode from:');
    modeNames.forEach((modeName) => {
      console.log('   ' + modeName + ': ' + config.runMode[modeName].heading);
    });
    console.log('\n if you want to "mock" dependencies, add a: mock after the RunMode-Arguments');
    console.log('\n optionally modify the output with: ');
    for (let outputMod in config.outputParameters) {
      console.log('   ' + outputMod + ': ' + config.outputParameters[outputMod].description);
    }

  } else
    try {
      let outputArgs;
      let runModeArguments = args.slice(1, 1 + runMode.additionalArgumentCount);
      //look if should be mocked
      if (args[runMode.additionalArgumentCount + 1] == 'mock') {
        mock = true;
        //outputArgs are all after Runmode, RunMode-Arguments and mock-trigger
        outputArgs = args.slice(2 + runMode.additionalArgumentCount);
      } else {
        outputArgs = args.slice(1 + runMode.additionalArgumentCount);
      }

      let reporter = new SpecReporter();
      let argParser = new SpecExecArgumentParser(outputArgs);
      let specRunOutput = new SpecReportOutputConsole(reporter);
      argParser.applyOnOutput(specRunOutput);

      specRunOutput.setHeading(runMode.heading + ' ' + runModeArguments);

      //load specs into Registry
      let registry = SpecLoader.loadSpecs(dirPath);

      //execute Method
      SpecExecChooser[runMode.methodName](registry, reporter, ...runModeArguments, mock);

      specRunOutput.outputResult();
    } catch (error) {
      console.error('\x1b[1;31m' + 'Error: ' + error + '\n' + error.stack + '\x1b[0m');
    }
}












