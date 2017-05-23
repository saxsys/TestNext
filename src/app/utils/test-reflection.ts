export class TestReflection {
  public static getAllPropertiesOf(obj): Array<any> {
    let props = [];

    do {
      props = props.concat(Object.getOwnPropertyNames(obj));
    } while (obj = Object.getPrototypeOf(obj));

    return props;
  }

  public static getAllFunctionsOf(obj): Array<any> {
    const props = TestReflection.getAllPropertiesOf(obj);

    return props.sort().filter((e, i, arr) => {
      if (e !== arr[i + 1] && typeof obj[e] === 'function') {
        return true;
      }
    });
  }
}
