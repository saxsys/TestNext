import {ISpecContainer} from "../../SpecStorage/specContainer/iSpec-Container";
import {SpecRunner} from "../specContainerRunner/spec-container-runner";
import {SpecGeneralActionRunner} from "../specActionRunner/spec-general-action-runner";
import {SpecReporter} from "../specReporting/specReporter/spec-reporter";
/**
 * Class collecting multiple Specs and necessary Action, which should be executed
 */
export class SpecSuiteRunner{

  specs:ISpecContainer[];
  reporter:SpecReporter;
  specRunners:SpecRunner[];
  generalActionRunners = new Map<string, SpecGeneralActionRunner>();

  constructor(specs:Array<ISpecContainer>){
    this.specs = specs;
    this.reporter = new SpecReporter();
  }

  setup(){
    this.specs.forEach((specContainer) =>{
      let specReport = this.reporter.getOrCreateSpecReport(specContainer);
      let specRunner = new SpecRunner(specContainer, specReport);
      let generalActions = specContainer.getGeneralActions();

      //give General Actions to Runner
      generalActions.forEach((generalAction)=>{
        //take existing general Action
        let actionRunner = this.generalActionRunners.get(generalAction.getActionClassName());
        //or create new GeneralActionRunner, if not existing
        if(actionRunner == null){
          actionRunner = new SpecGeneralActionRunner(generalAction);
        }

        specRunner.addActionRunner(actionRunner);

      })
    });
  }


}
