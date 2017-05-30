"use strict";
exports.__esModule = true;
var testMethod_registry_entry_1 = require("../testMethodRegistryEntry/testMethod-registry-entry");
var SpecRegistryEntry = (function () {
    function SpecRegistryEntry(specClass) {
        this.given = new Map(); // exec-Number, MethodName
        this.then = new Map(); // exec-Number, MethodName
        this.specClass = specClass;
    }
    SpecRegistryEntry.prototype.setSpecName = function (specName) {
        this.specName = specName;
    };
    SpecRegistryEntry.prototype.addGiven = function (functionName, description, execNumber) {
        if (execNumber == null)
            execNumber = 0;
        if (this.given == null)
            this.given = new Map();
        if (this.given.get(execNumber) != null)
            throw new Error('Multiple @given, without ExecNumber, or it (' + execNumber + ') already exists on ' + this.getClassName() + '.' + functionName);
        this.given.set(execNumber, new testMethod_registry_entry_1.TestMethodRegistryEntry(functionName, description, execNumber));
    };
    SpecRegistryEntry.prototype.addThen = function (functionName, description, execNumber) {
        if (execNumber == null)
            execNumber = 0;
        if (this.then == null)
            this.then = new Map();
        if (this.then.get(execNumber) != null)
            throw new Error('Multiple @then, without ExecNumber, or it (' + execNumber + ') already exists on ' + this.getClassName() + '.' + functionName);
        this.then.set(execNumber, new testMethod_registry_entry_1.TestMethodRegistryEntry(functionName, description, execNumber));
    };
    SpecRegistryEntry.prototype.addWhen = function (functionName, description) {
        if (this.when != null) {
            throw new Error('Only one @When allowed on ' + this.getClassName() + 'cannot add ' + functionName + ', ' + this.when.getName() + ' is already @When');
        }
        this.when = new testMethod_registry_entry_1.TestMethodRegistryEntry(functionName, description);
    };
    SpecRegistryEntry.prototype.getSpecName = function () {
        return this.specName;
    };
    SpecRegistryEntry.prototype.getClassName = function () {
        return this.specClass.constructor.name;
    };
    SpecRegistryEntry.prototype.getClass = function () {
        return this.specClass;
    };
    SpecRegistryEntry.prototype.getGivenArray = function () {
        return Array.from(this.given.values());
    };
    SpecRegistryEntry.prototype.getThenArray = function () {
        return Array.from(this.then.values());
    };
    SpecRegistryEntry.prototype.getWhen = function () {
        return this.when;
    };
    return SpecRegistryEntry;
}());
exports.SpecRegistryEntry = SpecRegistryEntry;
