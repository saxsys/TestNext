"use strict";
exports.__esModule = true;
var TestMethodRegistryEntry = (function () {
    function TestMethodRegistryEntry(name, description, execNumber) {
        this.name = name;
        this.description = description;
        this.execNumber = execNumber;
    }
    TestMethodRegistryEntry.prototype.getName = function () {
        return this.name;
    };
    TestMethodRegistryEntry.prototype.getDescription = function () {
        return this.description;
    };
    return TestMethodRegistryEntry;
}());
exports.TestMethodRegistryEntry = TestMethodRegistryEntry;
