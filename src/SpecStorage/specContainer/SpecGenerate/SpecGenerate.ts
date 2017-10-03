import {Provider, ReflectiveInjector, Type} from "@angular/core";
import {SpecRegistryError} from "../../spec-registry-error";
import {SpecGenerationProvider} from "./SpecGenerateProvider";

export class SpecGeneratorOfProperty {
  private specClassName: string;
  private propertyName: string;
  private typeToGenerate: Provider;
  private providers: Map<string, SpecGenerationProvider> = new Map<string, SpecGenerationProvider>();

  constructor(specClassName: string, propertyName: string) {
    this.specClassName = specClassName;
    this.propertyName = propertyName;
  }

  setTypeToGenerate(typeToGenerate: Provider) {
    if (this.typeToGenerate != null)
      throw new SpecRegistryError('You Cannot set multiple Generate on one Property: ' + this.specClassName + '.' + this.propertyName, this.specClassName, this.propertyName);
    this.typeToGenerate = typeToGenerate;
  }

  addProviders(providers: Array<SpecGenerationProvider>) {
    providers.forEach((prov: SpecGenerationProvider) => {
      if (this.providers.get(prov.provide) != null)
        return;

      this.providers.set(prov.provide, prov);
    });
  }

  getPropertyName():string{
    return this.propertyName;
  }
  getTypeToGenerate(): Provider {
    return this.typeToGenerate;
  }

  getDependencies(): Array<SpecGenerationProvider> {
    return Array.from(this.providers.values());
  }

  generateWithMock(): any {
    let providers = [this.typeToGenerate];

    this.providers.forEach((prov) => {
      if (prov.mock != null)
        providers.push({provide: prov.provide, useValue: prov.mock});
      else
        providers.push({provide: prov.provide, useClass: prov.provide});

    });

    return this.generate(providers);

  }

  generateReal():any {
    let providers = [this.typeToGenerate];

    this.providers.forEach((prov) => {
        providers.push({provide: prov.provide, useClass: prov.provide});
    });

    return this.generate(providers);
  }

  private generate(providers:Array<Provider>):any{
    let injector;
    try {
      injector = ReflectiveInjector.resolveAndCreate(providers);
      return injector.get(this.typeToGenerate);
    } catch (error) {
      throw new SpecRegistryError(error.message, this.specClassName);
    }
  }
}
