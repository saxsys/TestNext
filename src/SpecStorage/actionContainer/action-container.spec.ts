import {SpecActionContainer} from "./action-container";
describe('SpecActionContainer', ()=>{

  class ActionClass{

  }

  let actionClassConstructor = ActionClass.prototype.constructor;

  it('should be initialized with a class-constructor', ()=>{
    let actionContainer = new SpecActionContainer(actionClassConstructor);

    expect(actionContainer).not.toBeUndefined();
  });

});
