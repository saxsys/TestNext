import {TestReflection} from '../../utils/test-reflection';
import {IgnoredMockProperties} from '../ignored-mock-properties';
import {DefaultMockValues} from '../default-mock-values';

export class ObjectMocker {
  private original;

  private functions = new Array<string>();
  private booleans = new Array<string>();
  private numbers = new Array<string>();
  private strings = new Array<string>();
  private symbols = new Array<string>();
  private objects = new Array<string>();



  constructor(obj: any) {
    this.original = obj;
    this.sortProperties();
  }


  public sortProperties() {
    const props = TestReflection.getAllPropertiesOf(this.original);
    props.forEach((prop) => {
      const type = typeof this.original[prop];
      if (type === 'undefined') {
        return;
      }
      if (IgnoredMockProperties.isIgnoredProperty(prop)) {
        return;
      }
      this[type + 's'].push(prop);

    });
  }

  public mock(): any {
    const obj = {};

    this.functions.forEach((func) => {
      obj[func] = DefaultMockValues.defaultValues.func;
    });
    this.booleans.forEach((bool) => {
      obj[bool] = DefaultMockValues.defaultValues.bool;
    });
    this.numbers.forEach((num) => {
      obj[num] = DefaultMockValues.defaultValues.num;
    });
    this.strings.forEach((str) => {
      obj[str] = DefaultMockValues.defaultValues.str;
    });
    this.symbols.forEach((sym) => {
      // obj[sym] = defaultValues.num;
      obj[sym] = this.original[sym];
    });
    this.objects.forEach((anObj) => {
      obj[anObj] = DefaultMockValues.defaultValues.obj;
    });

    return obj;
  }

  public mockDeep(): any {
    const mock = this.mock();

    this.objects.forEach((obj) => {
      const propSorterChild = new ObjectMocker(this.original[obj]);
      mock[obj] = propSorterChild.mockDeep();
    });

    return mock;
  }

}
