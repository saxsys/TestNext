export class IgnoredMockProperties {

  private static IGNORED_MOCK_PROPERTIES = [
    'constructor', 'toSource', 'toString',
    'toLocaleString', 'valueOf', 'watch', 'unwatch',
    'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable',
    '__defineGetter__', '__defineSetter__', '__lookupGetter__', '__lookupSetter__', '__proto__'
  ];

  public static isIgnoredProperty(propName: string): boolean {
    return (IgnoredMockProperties.IGNORED_MOCK_PROPERTIES.indexOf(propName)) >= 0;
  }
}
