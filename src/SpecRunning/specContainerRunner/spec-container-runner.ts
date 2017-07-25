import {ISpecContainer} from "../../SpecStorage/specContainer/iSpec-Container";
import {ISpecActionRunner} from "../specActionRunner/iSpec-action-runner";
import {ISpecReport} from "../specReporting/specReport/iSpec-report";
import {SpecValidator} from "../specValidator/spec-validator";
import {ReflectiveInjector} from "@angular/core";

export class SpecRunner {
  private specContainer: ISpecContainer = null;
  private specObject: any = null;
  private actionRunners = new Map<string, ISpecActionRunner>();
  private report: ISpecReport = null;

  constructor(specContainer: ISpecContainer, specReport: ISpecReport) {
    this.specContainer = specContainer;
    this.report = specReport;
  }

  addActionRunner(actionRunner:ISpecActionRunner){
    if(this.actionRunners.get(actionRunner.getActionClassName()) != null)
      throw new Error('actionRunner for Action"' + actionRunner.getActionClassName() + '" ' +
        'already exists on SpecRunner for "' + this.specContainer.getClassName() + '"');
    this.actionRunners.set(actionRunner.getActionClassName(), actionRunner);
  }

  private validateSpec() {
    SpecValidator.validate(this.specContainer);
  }

  createObject(): any {
    try {
      this.validateSpec();
      let constructor = this.specContainer.getClassConstructor();
      let object = new constructor;

      //set SUT
      let sut = this.specContainer.getSUT();
      if (sut != null) {
        let injector = ReflectiveInjector.resolveAndCreate(this.specContainer.getProviders());
        object['SUT'] = injector.get(sut);
      }


      //set Actions
      this.specContainer.getPropertiesWithAction().forEach((action, propertyName) => {
        let actionName = action.getActionClassName();
        let actionRunner = this.actionRunners.get(actionName);
        if (actionRunner == null)
          throw new Error('SpecAction saved in SpecContainer not set in SpecRunner: ' + actionName);
        object[propertyName] = actionRunner.getActionResult();
      });

      this.specObject = object;
      return object;

    } catch (error) {
      this.report.reportValidationError(error);
      return null;
    }
  }

  getReport():ISpecReport{
    return this.report;
  }

  getObject():any{
    return this.specObject;
  }
}
