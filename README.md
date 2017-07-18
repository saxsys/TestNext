# TestNext
Test-Framework zur Anwendung auf verschiedenen Abstraktionsstufen, basierend auf Angular/TypeScript.
Test-framework for the usage on different levels of abstraction, in Angular/TypeScript
## How-To
### Write Specs
* With TestNext Specs are written as classes
* A Spec is defined by 
  * at least one Given
  * exactly one When 
  * at least one Then step.
* the Spec will be executed in Order Given --> When --> Then
* class-names using TestNext in any way must be unique
  
####Spec Classes
* A class with the decorator `@Spec('Spec-description')` is a SpecClass and will be executed as Spec.
Example
```
@Spec('Testing Example')
 class TestExample{
  [...]    
 }
```
* one Spec-description (argument for Spec) can be used multiple times
* The class-name of a SpecClass must be unique in the whole project

####Spec-Methods
* Spec-Methods are marked with Decorators
  * Spec-Methods can be used in each class, the Class does not need to have a Spec-Decorator (look Inheritance)
* The Spec-methods will be executed in a specific order
  * Given --> When --> Then/ThenThrow --> Cleanup
* the methods
  * the method-name is a identifier and can only be used once per SpecClass (even with 'static'-modifier)
  * The methods must not have arguments
* Spec-Method-Description
  * Spec-Methods get a description, as first Argument in the Decorator
  * one description can be used multiple times
* ExecNumber
  * optional
  * for Spec-Method-Types which can appear multiple times in on Spec a execNumber can be given as second decorator-argument 
  * useful, when the execution order of the Spec-Methods matters
  
#####Given
* Given-methods will be executed first, while executing the SpecClass
* There must be at least one Given-method, multiple are possible
* They are marked with `@Given('description')` or `@Given('description', 1)` 

#####When
* Then When-methods will be executed second, while executing the SpecClass
* There can only be one When-method
* it is marked with `@When('description')`

#####Then
* Then-methods will be executed third, while executing the SpecClass
* There must be at least one Then-method, multiple are possible
* They are marked with `@Then('description')` or `@Then('description', 1)` 

#####ThenThrow
* The ThenThrow-method is an alternative to then Then-methods
* It is used, when the When-method is expected to throw an Error
* in the Method an Error should be thrown (this is not forced but would you use it otherwise)
* there can ony be one ThenThrow-method
* The error-type and the message are compared
* They are marked with `@ThenThrow('an error')`

#####Cleanup
* The Cleanup-methods are executed als last-method, while executing the SpecClass, even when the methods before failed
  * useful for example, when cleaning up a Database in the end
* It is optional, there can be multiple
* They are marked with `@Cleanup()`
  * a description is optional and can be given with `@Cleanup('description')`
  * an execNumber is optional and can be given with `@Cleanup('description', 1)`

####Subject
* For a better overview SpecClasses can be assigned to Subjects
* One Subject can contain multiple SpecClasses
* one SpecClass can be assigned to multiple Subjects
* A Subject is assigned to a SpecClass with `@Subject('Subject Name')`

####Inheritance
* A SpecClass can be extended and inherit
* The extended Class do not have to be a SpecClass (must not be marked with  `@Spec()`)
  * the child-SpecClasses will be Executed as long as the have the @Spec-Decorator
* All the methods can be inherited (Given, When, Then, ThenThrow, Cleanup)
  * If there can only one method of the type (as in When), the parents method is only used, when the child does not have an own
  * In the end The inheriting SpecClass must have at least one Given, exactly one When and at least one Then
* Execution-order
  * the usual method Order remains as it was, but the parent-Methods are executed before the Child Methods 
  * e.g. first all Parent-Given, then all Child-Given, then the Parents When or the child When
  * the execution-numbers only refer to the methods inside the SpecClass (so parent and child separated)
* Careful when inheriting:
  * overriding methods by their name can cause trouble
  
####SUT
* The SUT (System under Test) can be created automatically
  * Use the Decorator `@SUT(ClassToTest)` as Decorator for the SpecClass
  * Give all dependencies in `@Providers([DependencyClass, OtherDependencyClass])`
  * extend the Class `SpecWithSUT` (or declare an own public field SUT)
* use the SUT in the SpecClass by calling `this.SUT`

####Take Care
* Use unique SpecClass-Names
* overriding SpecMethods can cause Errors
* if you use variables in the Decorator-descriptions, they must be from static

###Asserts
// TODO

###Run Tests
####CLI
```shell
npm run tNxt <runMode> [<runModeArguments>] <outputModifier[...]>
```
* use `npm run tNxt` for help 
#####RunModes
* `AllSpecs`
  * execute all Specs
  * no additional Arguments
* `AllSubjects`
  * execute all Specs by their Subject
    * Print them ordered by the Subject
    * each Spec will only executed once (but printed for each Subject) 
  * no additional Arguments
  * Specs without Subject will also be executed, as '# Without Subject'
* `Subject`
  * runModeArgument: `SubjectName`
  * execute all Specs of the given Subject
* `Spec`
  * runModeArgument: `<SpecClassName>`
    * name of the Class with the Spec to Execute, not the description
  * the one Spec with the ClassName will be executed
  * inherited classes will not be executed separately
  
 #####outputModifier
 * change the output hand have no influence on the running
 * the Modifier can be combined freely
 * by standard
  * only failed and invalid Specs are shown
  * Specs are ordered by their heading and then alphabet
 
 ######show all
 * `sAll`
 * show all results of executable Specs (including ignored Specs)
 
 ######hide ignored
  * `hIgn`
  * useful in addition to `sAll`
  * hides ignored Specs
 
  ######show non Executable
  * `sNonExec`
  * show also non Executable SpecClasses (Classes having without @Spec, but other Spec-Decorator, e.g. a Given Method for inheritance)
  * useful for debugging 
  
  ######hide Cleanup
  * `hClean`
  * hides the Cleanup-Description, when not failed
  * useful, when output needs to be shortened
  
  ######order by Alphabet
  * `oAlpha`
  * order output by alphabet
 
 ######order by ExecutionStatus
   * `oExecStat`
   * order output by ExecutionStatus/Success
    * Failed-->Invalid-->Successful-->Ignored-->nonExecutable
