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

  constructor(specClassName: string, propertyName: string) {
    this.specClassName = specClassName;
    this.propertyName = propertyName;
  }

  setTypeToGenerate(typeToGenerate: Provider) {
    if (this.typeToGenerate != null)
      throw new SpecRegistryError('You Cannot set multiple Generate on one Property: ' + this.specClassName + '.' + this.propertyName, this.specClassName, this.propertyName);
    this.typeToGenerate = typeToGenerate;
  }

  addProviders(providers: Array<SpecGenerateProvider>) {
    providers.forEach((prov: SpecGenerateProvider) => {
      if (this.providers.get(prov.provide) != null)
        return;

      this.providers.set(prov.provide, prov);
    });
  }

  getPropertyName(): string {
    return this.propertyName;
  }

  getTypeToGenerate(): Provider {
    return this.typeToGenerate;
  }

  getDependencies(): Array<SpecGenerateProvider> {
    return Array.from(this.providers.values());
  }

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

  private

  generate(providers: Array<Provider>): any {
    let injector;
    try {
      injector = ReflectiveInjector.resolveAndCreate(providers);
      return injector.get(this.typeToGenerate);
    } catch (error) {
      throw new SpecRegistryError(error.message, this.specClassName);
    }
  }
}
