import {Provider, ReflectiveInjector, Type} from "@angular/core";
import {SpecRegistryError} from "../../spec-registry-error";
import {SpecGenerateProvider} from "./SpecGenerateProvider";

/**
 * @class for automated generating of Object on Property from a Type with Dependencies
 */
export class SpecGeneratorOfProperty {
  private specClassName: string;
  private propertyName: string;
  private typeToGenerate: Provider;
  private providers: Map<string, SpecGenerateProvider> = new Map<string, SpecGenerateProvider>();

  /**
   * Constructor for a Generate on a SpecClass
   * @param {string} specClassName Name of the Spec Class
   * @param {string} propertyName Name of the Property in which a Value should be generated
   */
  constructor(specClassName: string, propertyName: string) {
    this.specClassName = specClassName;
    this.propertyName = propertyName;
  }

  /**
   * Type to generate an object of
   * @param {Provider} typeToGenerate
   */
  setTypeToGenerate(typeToGenerate: Provider) {
    if (this.typeToGenerate != null)
      throw new SpecRegistryError('You Cannot set multiple Generate on one Property: ' + this.specClassName + '.' + this.propertyName, this.specClassName, this.propertyName);
    this.typeToGenerate = typeToGenerate;
  }

  /**
   * Providers of Dependencies for the TypeToGenerate
   * @param {Array<SpecGenerateProvider>} providers with the Class of Dependency an additional Classes of Objects as alternatives or mock to resolve the Dependencies
   */
  addDependencies(providers: Array<SpecGenerateProvider>) {
    providers.forEach((prov: SpecGenerateProvider) => {
      if (this.providers.get(prov.provide) != null)
        return;

      this.providers.set(prov.provide, prov);
    });
  }

  /**
   * @return {string} Name of the Property on which sth should be generated
   */
  getPropertyName(): string {
    return this.propertyName;
  }

  /**
   * @return {Provider} Type to generate an object of
   */
  getTypeToGenerate(): Provider {
    return this.typeToGenerate;
  }

  /**
   * @return {Array<SpecGenerateProvider>} the set Dependencies for the Generate
   */
  getDependencies(): Array<SpecGenerateProvider> {
    return Array.from(this.providers.values());
  }

  /**
   * generate an Object of the TypeToGenerate and return it, using mocked Values
   * @return {any}
   */
  generateWithMock(): any {
    let providers = [this.typeToGenerate];

    this.providers.forEach((prov) => {
        if (prov.mockClass != null) {
          providers.push({provide: prov.provide, useClass: prov.mockClass});
        } else if (prov.mockObject != null) {
          providers.push({provide: prov.provide, useValue: prov.mockObject});
        } else if(prov.mock != null) {
          providers.push({provide: prov.provide, useValue: prov.mock});
        } else if (prov.useClass != null) {
          providers.push({provide: prov.provide, useClass: prov.useClass});
        } else if (prov.useObject != null) {
          providers.push({provide: prov.provide, useValue: prov.useObject});
        } else {
          providers.push({provide: prov.provide, useClass: prov.provide});
        }
      }
    );

    return this.generate(providers);

  }

  /**
   * generate an Object of the TypeToGenerate and return it, usind the real Dependencies, or when given the alternative Dependencies
   * @return {any}
   */
  generateReal(): any {
    let providers = [this.typeToGenerate];

    this.providers.forEach((prov) => {
      if(prov.useClass != null){
        providers.push({provide: prov.provide, useClass: prov.useClass});
      } else if(prov.useObject != null){
        providers.push({provide: prov.provide, useValue: prov.useObject});
      } else {
        providers.push({provide: prov.provide, useClass: prov.provide});
      }
    });

    return this.generate(providers);
  }

  private generate(providers: Array<Provider>): any {
    let injector;
    try {
      injector = ReflectiveInjector.resolveAndCreate(providers);
      return injector.get(this.typeToGenerate);
    } catch (error) {
      throw new SpecRegistryError(error.message, this.specClassName);
    }
  }
}
