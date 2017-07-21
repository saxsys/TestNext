import {SpecActionList} from "./spec-action-list";
import {ExampleActionContainerFiller} from "../../../utils/testData/example-action-container-filler";
import {SpecRegistryError} from "../../spec-registry-error";

describe('specActionList', ()=>{
  it('should init', ()=>{
    let specActionList = new SpecActionList('AClass');

    expect(specActionList).not.toBeNull();
  });
});

describe('specActionList.addAction', () => {



  it('should add an SpecActionContainer by its Name', ()=> {
    let actionList = new SpecActionList('ASpecClass');
    let actionContainer = ExampleActionContainerFiller.getStandardAction();

    actionList.addAction('aProperty', actionContainer);

    expect(actionList.getPropertiesWithAction().get('aProperty')).toEqual(actionContainer);
  });

  it('should refuse two Actions on one Property', ()=> {
    let actionList = new SpecActionList('ASpecClass');
    let actionContainer = ExampleActionContainerFiller.getStandardAction();

    actionList.addAction('aProperty',actionContainer);

    expect(()=>{
      actionList.addAction('aProperty', actionContainer);
    }).toThrowError(SpecRegistryError, 'One Property with multiple Actions: ASpecClass.aProperty');
  });
});
