import {SpecMethodReport} from "./spec-method-report";
import {SpecMethodContainer} from "../../../SpecStorage/specContainer/specMethodContainer/spec-method-container";
import {SpecMethodType} from "../../../SpecStorage/specContainer/specMethodContainer/spec-method-type";

describe('SpecMethodReport', () => {
  it('should init with arguments for success', () => {


    let methodName = 'aMethod';
    let methodDescr = 'doing Something';
    let methodType = SpecMethodType.GIVEN;
    let success = true;

    let methodContainer = new SpecMethodContainer(methodName, methodDescr, methodType);

    let methodReport = new SpecMethodReport(methodContainer, success);

    expect(methodReport).not.toBeNull();
    expect(methodReport.getSpecMethod()).toEqual(methodContainer, 'specMethodContainer not correct');
    expect(methodReport.getMethodName()).toEqual(methodName, 'method Name wrong');
    expect(methodReport.getDescription()).toEqual(methodDescr, 'methodDescription wrong');
    expect(methodReport.isSuccess()).toEqual(success, 'success wrong');
    expect(methodReport.getError()).toBeUndefined('saved Error not undefined');
  });

  it('should init with arguments for failure', () => {

    let methodName = 'aMethod';
    let methodDescription = 'doing Something';
    let methodType = SpecMethodType.GIVEN;
    let success = false;
    let error = new Error('failed');

    let methodContainer = new SpecMethodContainer(methodName, methodDescription, methodType);

    let methodReport = new SpecMethodReport(methodContainer, success, error);

    expect(methodReport).not.toBeNull();
    expect(methodReport.getSpecMethod()).toEqual(methodContainer, 'specMethodContainer not correct');
    expect(methodReport.getMethodName()).toEqual(methodName, 'method Name wrong');
    expect(methodReport.getDescription()).toEqual(methodDescription, 'methodDescription wrong');
    expect(methodReport.isSuccess()).toEqual(success, 'success wrong');
    expect(methodReport.getError()).toEqual(error, 'error wrong');
  });

});
