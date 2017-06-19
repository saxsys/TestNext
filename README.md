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
  
####Spec
* A class with the decorator @Spec('Spec-description') is a SpecClass and will be executed as Spec.
Example
```
@Spec('Testing Example')
 class TestExample{
  [...]    
 }
```
* one Spec-description (argument for Spec) can be used multiple times
* The class-name of a SpecClass must be unique in the whole project

####Given
* Given-methods will be executed first, when in a SpecClass
  * the containing class does not have to be marked as @Spec, look Inheritance
* They are marked with @Given('description')
* When there are multiple Given-methods they need an execution-number, to schedule the execution-order
  * @Given('given description', 1)
* again the description can be used multiple times, the method-name only once per SpecClass(even with 'static'-modifier)

####When
* Then When-methods will be executed second, when in a SpecClass  
  * the containing class does not have to be marked as @Spec, look Inheritance
* there can only be one When-method
* it is marked with @When('description')
* again the description can be used multiple times, the method-name only once per SpecClass (even with 'static'-modifier)

####Then
* Then-methods will be executed third, when in a SpecClass
  * the containing class does not have to be marked as @Spec, look Inheritance
* They are marked with @Then('description')
* When there are multiple There-methods they need an execution-number, to schedule the execution-order
  * @There('given description', 1)
* again the description can be used multiple times, the method-name only once per SpecClass(even with 'static'-modifier)

###Inheritance
* A SpecClass can be extended and inherit
* All the Given-, When- and Then-methods are inherited
* The extended Class do not have to be a SpecClass (must not be marked with  @Spec)
  * the child-SpecClasses will be Executed as long as the have the @Spec-Decorator
* In the end The inheriting SpecClass must have at least one Given, exactly one When and at least one Then
* The execution-order is:
  * all Parent-Given --> all Child-Given --> Parent/Child-When --> all Parent-Then --> all Child-Then
  * the execution-numbers only refer to the methods inside the SpecClass (so parent and child separated)
* Careful when inheriting:
  * a When in each, the parent- and child-class is invalid
  * overriding methods can cause trouble
  
####Subject
* For a better overview SpecClasses can be assigned to Subjects
* One Subject can contain multiple SpecClasses
* one SpecClass can be assigned to multiple Subjects
* A Subject is assigned to a SpecClass with @Subject('Subject Name')

#### Take Care
* Use unique SpecClass-Names
* overriding SpecMethods can cause Errors
* if you use variables in the Decorator-descriptions, they must be from static

### Asserts
// TODO

### CLI
#### run all specs
```shell
npm run tNxt -- <showFailedOnly>
```
* showFailedOnly - only show failed Specs, default=false

#### run all Specs
```shell
npm run tNxt:spec -- <SpecClassName> <showFailedOnly>
```
* SpecClassName - Name of the SpecClass to run
* showFailedOnly - only show failed Specs, default=false 

#### run Specs By Subject (all Subjects)
```shell
npm run tNxt:allSubjects <showFailedOnly>
```
* showFailedOnly - only show failed Specs, default=false

#### run all Specs of one Subject
```shell
npm run tNxt:subject -- \<SubjectName> <showFailedOnly>
```
* showFailedOnly - only show failed Specs, default=false
