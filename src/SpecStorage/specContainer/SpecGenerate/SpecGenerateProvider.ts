/**
 * Interface to store Providers for usage in Dependencies in @Generate
 */
export interface SpecGenerateProvider{
  /**
   * original Class of Dependency
   */
  provide:any;
  /**
   * alternative Class to replace the original Provider for running integrationtests
   */
  useClass?:any;
  /**
   * alternative Object to replace priginal Provider fpr running integrationtests
   */
  useObject?:any;
  /**
   * Class to replace the Provider as mock in unittests
   */
  mockClass?:any;
  /**
   * Object to replace the Provider as mock in unittests
   */
  mockObject?:any;
  /**
   * short for mockObject, Object to replace the Provider as mock in unittests
   */
  mock?:any;
}
