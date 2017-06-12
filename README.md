# TestNext
Test-Framework zur Anwendung auf verschiedenen Abstraktionsstufen, basierend auf Angular/Typescript.

## How-To
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
