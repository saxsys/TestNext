"use strict";
exports.__esModule = true;
var spec_registry_entry_1 = require("./specRegistryEntry/spec-registry-entry");
var SPECCLASS_REGISTRY = new Map();
var SpecRegistry = (function () {
    function SpecRegistry() {
    }
    SpecRegistry.registerSpec = function (specClass, specName) {
        var specClassName = specClass.constructor.name;
        var registryEntry = SPECCLASS_REGISTRY.get(specClassName);
        if (registryEntry != null) {
            if (registryEntry.getSpecName() != null) {
                throw new Error(specClassName + ' is already registered for Spec:' + registryEntry.getSpecName() + ', can only be registered once, cannot register for Spec:' + specName);
            }
            registryEntry.setSpecName(specName);
        }
        else {
            var entry = new spec_registry_entry_1.SpecRegistryEntry(specClass);
            entry.setSpecName(specName);
            SPECCLASS_REGISTRY.set(specClassName, entry);
        }
    };
    SpecRegistry.registerGivenForSpec = function (specClass, functionName, description, execNumber) {
        var specClassName = specClass.constructor.name;
        var specRegEntry = SPECCLASS_REGISTRY.get(specClassName);
        if (specRegEntry == null) {
            specRegEntry = new spec_registry_entry_1.SpecRegistryEntry(specClass);
            SPECCLASS_REGISTRY.set(specClassName, specRegEntry);
        }
        else {
            if (specRegEntry.getClass().constructor != specClass.constructor)
                throw new Error('SpecClass ' + specClassName + ' already exists, but is not same Class (for @Given ' + functionName + ')');
        }
        var savedClass = specRegEntry.getClass();
        SpecRegistry.checkIfFunctionExistsOnClass(savedClass, functionName);
        specRegEntry.addGiven(functionName, description, execNumber);
    };
    SpecRegistry.registerWhenForSpec = function (specClass, functionName, description) {
        var specClassName = specClass.constructor.name;
        var specRegEntry = SPECCLASS_REGISTRY.get(specClassName);
        if (specRegEntry == null) {
            specRegEntry = new spec_registry_entry_1.SpecRegistryEntry(specClass);
            SPECCLASS_REGISTRY.set(specClassName, specRegEntry);
        }
        else {
            if (specRegEntry.getClass().constructor != specClass.constructor)
                throw new Error('SpecClass ' + specClassName + ' already exists, but is not same Class (for @When ' + functionName + ')');
        }
        var savedClass = specRegEntry.getClass();
        SpecRegistry.checkIfFunctionExistsOnClass(savedClass, functionName);
        specRegEntry.addWhen(functionName, description);
        /*
        let specRegEntry = SpecRegistry.getSpecBySpecClassNameException(specClassName);
        let specClass = specRegEntry.getClass();
        SpecRegistry.checkIfFunctionExistsOnClass(specClass, functionName);
        specRegEntry.addWhen(functionName, description);
        */
    };
    SpecRegistry.registerThenForSpec = function (specClass, functionName, description, execNumber) {
        var specClassName = specClass.constructor.name;
        var specRegEntry = SPECCLASS_REGISTRY.get(specClassName);
        if (specRegEntry == null) {
            specRegEntry = new spec_registry_entry_1.SpecRegistryEntry(specClass);
            SPECCLASS_REGISTRY.set(specClassName, specRegEntry);
        }
        else {
            if (specRegEntry.getClass().constructor != specClass.constructor)
                throw new Error('SpecClass ' + specClassName + ' already exists, but is not same Class (for @Then ' + functionName + ')');
        }
        var savedClass = specRegEntry.getClass();
        SpecRegistry.checkIfFunctionExistsOnClass(savedClass, functionName);
        specRegEntry.addThen(functionName, description, execNumber);
    };
    /*
      private static getSpecBySpecClassNameException(specClassName: string): SpecRegistryEntry {
        let specName = TESTCLASS_SPEC.get(specClassName);
        if (specName == null) throw new Error('Class ' + specClassName + ' is not registered as SpecRegistry');
        let specRegEntry = SPECCLASS_REGISTRY.get(specName);
        if (specRegEntry == null)throw new Error('There is no SpecRegEntry for SpecRegistry ' + specName + ', but Class ' + specClassName + 'is defined as SpecRegistry. This should not happen.');
        return specRegEntry
      }
    */
    SpecRegistry.getSpecClassNames = function () {
        return Array.from(SPECCLASS_REGISTRY.keys());
    };
    SpecRegistry.getSpecByClassName = function (className) {
        return SPECCLASS_REGISTRY.get(className);
    };
    SpecRegistry.checkIfFunctionExistsOnClass = function (specClass, functionName) {
        if (specClass[functionName] == null) {
            throw new Error(specClass.constructor.name + '.' + functionName + ' does not exist.');
        }
        if (typeof specClass[functionName] != 'function') {
            throw new Error(specClass.constructor.name + '.' + functionName + ' is not a function.');
        }
    };
    return SpecRegistry;
}());
exports.SpecRegistry = SpecRegistry;
