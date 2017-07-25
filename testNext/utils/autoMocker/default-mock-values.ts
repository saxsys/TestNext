export class DefaultMockValues {
  public static defaultValues = {
    func: ([]: any) => {
      console.log('run mock fkt');
    },
    bool: false,
    num: 0,
    str: '',
    symb: Symbol,
    obj: {}
  };
}
