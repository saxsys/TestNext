/***
 * A Class having a Property SUT (System under Test), usable to inherit in Spec of TestNext.
 * The SUT will be generated while running the Spec, if configured properly with @SUT() and @Providers()
 */
export abstract class SpecWithSUT{
  public SUT: any;

}
