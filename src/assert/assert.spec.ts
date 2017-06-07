import {Assert} from "./assert";
import {AssertionError} from "./assertion-Error";
import {isNull} from "util";

describe('Assert.that', () => {
  it('should return an assert', () =>{
    let assert = Assert.that(1);
    expect(assert).not.toBeNull();
    expect(assert instanceof Assert).toBeTruthy();
  });

});

describe('Assert.equals', () => {


  it('should pass for equal numbers without description', () =>{
    expect(() => {
      Assert.that(1).equals(1);
    }).not.toThrow()
  });

  it('should pass for equal numbers with description', () =>{
    expect(() => {
      Assert.that(1, 'a Number').equals(1, 'same Number');
    }).not.toThrow()
  });

  it('should throw AssertionError for unequal numbers, without description', () =>{
    expect(() => {
      Assert.that(1).equals(2);
    }).toThrowError(
      AssertionError, '(1) should be equal to (2)'
    );
  });

  it('should throw AssertionError for unequal numbers, with description', () =>{
    expect(() => {
      Assert.that(1, 'a Number').equals(2, 'different Number');
    }).toThrowError(
      AssertionError, 'a Number(1) should be equal to different Number(2)'
    );
  });

  it('should pass for equal strings', () =>{
    expect(() => {
      Assert.that('absd').equals('absd')
    }).not.toThrow();
  });

  it('should throw AssertionError for unequal strings', () =>{
    expect(() => {
      Assert.that('abc', 'a text').equals('def', 'a different text');
    }).toThrowError(
      AssertionError, 'a text(abc) should be equal to a different text(def)'
    );
  });


  it('should pass for same Object Reference', () =>{
    let obj = {
      val:1
    };

    expect(() => {
      Assert.that(obj).equals(obj);
    }).not.toThrow()
  });

  it('should pass for same Object-structure with different Reference', () =>{
    let obj1 = {
      val:1
    };
    let obj2 = {
      val:1
    };

    expect(() => {
      Assert.that(obj1).equals(obj2);
    }).not.toThrow()
  });

  it('should throw AssertionError for unequal Objects', () => {
    let obj1 = {
      val:1
    };
    let obj2 = {
      val:2
    };

    expect(() => {
      Assert.that(obj1).equals(obj2);
    }).toThrowError(AssertionError, '([object Object]) should be equal to ([object Object])');
  });

});

describe('Assert.equalsNot', () => {


  it('should pass for unequal numbers without description', () =>{
    expect(() => {
      Assert.that(1).equalsNot(2);
    }).not.toThrow()
  });

  it('should pass for equal unnumbers with description', () =>{
    expect(() => {
      Assert.that(1, 'a Number').equalsNot(2, 'different Number');
    }).not.toThrow()
  });

  it('should throw AssertionError for equal numbers, without description', () =>{
    expect(() => {
      Assert.that(1).equalsNot(1);
    }).toThrowError(
      AssertionError, '(1) should be not equal to (1)'
    );
  });

  it('should throw AssertionError for equal numbers, with description', () =>{
    expect(() => {
      Assert.that(1, 'a Number').equalsNot(1, 'same Number');
    }).toThrowError(
      AssertionError, 'a Number(1) should be not equal to same Number(1)'
    );
  });

  it('should pass for unequal strings', () =>{
    expect(() => {
      Assert.that('absd').equalsNot('def')
    }).not.toThrow();
  });

  it('should throw AssertionError for equal strings', () =>{
    expect(() => {
      Assert.that('abc', 'a text').equalsNot('abc', 'the same text');
    }).toThrowError(
      AssertionError, 'a text(abc) should be not equal to the same text(abc)'
    );
  });


  it('should throw AssertionError for same Object Reference', () =>{
    let obj = {
      val:1
    };

    expect(() => {
      Assert.that(obj).equalsNot(obj);
    }).toThrowError(AssertionError, '([object Object]) should be not equal to ([object Object])');
  });

  it('should throw AssertionError for same Object-structure with different Reference', () =>{
    let obj1 = {
      val:1
    };
    let obj2 = {
      val:1
    };

    expect(() => {
      Assert.that(obj1).equalsNot(obj2);
    }).toThrowError(AssertionError, '([object Object]) should be not equal to ([object Object])');
  });

  it('should pass for unequal Objects', () => {
    let obj1 = {
      val:1
    };
    let obj2 = {
      val:2
    };

    expect(() => {
      Assert.that(obj1).equalsNot(obj2);
    }).not.toThrow();
  });

});

describe('Assert.isGreaterThan', () => {
  it('should pass for a number being greater than another Number, without description', () => {
    expect(() => {
      Assert.that(5).isGreaterThan(2)
    }).not.toThrow();
  });

  it('should pass for a number being greater than another Number, with description', () => {
    expect(() => {
      Assert.that(5, 'first Number').isGreaterThan(2, 'other Number')
    }).not.toThrow();
  });

  it('should throw AssertionError for a number being equal to another Number, without description', () => {
    expect(() => {
      Assert.that(2).isGreaterThan(2);
    }).toThrowError(AssertionError, '(2) should be greater than (2)');
  });

  it('should throw AssertionError for a number being equal to another Number, without description', () => {
    expect(() => {
      Assert.that(2, 'first Number').isGreaterThan(2, 'other Number');
    }).toThrowError(AssertionError, 'first Number(2) should be greater than other Number(2)');
  });

  it('should throw AssertionError for a number being less than other Number', () => {
    expect(() => {
      Assert.that(2, 'first Number').isGreaterThan(3, 'other Number');
    }).toThrowError(AssertionError, 'first Number(2) should be greater than other Number(3)');
  });

  it('should throw AssertionError for the first Value being a String (not a number)', () => {
    expect(() => {
      Assert.that('string').isGreaterThan(5)
    }).toThrowError(AssertionError, 'For a Comparing-Assertion both Values must be of type "number" and not null')
  });

  it('should throw AssertionError for the first Value being NaN', () => {
    expect(() => {
      Assert.that(NaN).isGreaterThan(5)
    }).toThrowError(AssertionError, 'For a Comparing-Assertion both Values must be of type "number" and not null')
  });

  it('should throw AssertionError for the first Value being null', () => {
    expect(() => {
      Assert.that(null).isGreaterThan(5)
    }).toThrowError(AssertionError, 'For a Comparing-Assertion both Values must be of type "number" and not null')
  });

  it('should throw AssertionError for the second Value being NaN', () => {
    expect(() => {
      Assert.that(3).isGreaterThan(NaN)
    }).toThrowError(AssertionError, 'For a Comparing-Assertion both Values must be of type "number" and not null')
  });

  it('should throw AssertionError for the second Value being null', () => {
    expect(() => {
      Assert.that(3).isGreaterThan(null)
    }).toThrowError(AssertionError, 'For a Comparing-Assertion both Values must be of type "number" and not null')
  });
});

describe('Assert.isLessThan', () => {
  it('should pass for a number being less than another Number, without description', () => {
    expect(() => {
      Assert.that(2).isLessThan(5)
    }).not.toThrow();
  });

  it('should pass for a number being less than another Number, with description', () => {
    expect(() => {
      Assert.that(2, 'first Number').isLessThan(5, 'other Number')
    }).not.toThrow();
  });

  it('should throw AssertionError for a number being equal to another Number, without description', () => {
    expect(() => {
      Assert.that(2).isLessThan(2);
    }).toThrowError(AssertionError, '(2) should be less than (2)');
  });

  it('should throw AssertionError for a number being equal to another Number, without description', () => {
    expect(() => {
      Assert.that(2, 'first Number').isLessThan(2, 'other Number');
    }).toThrowError(AssertionError, 'first Number(2) should be less than other Number(2)');
  });

  it('should throw AssertionError for a number being greater than other Number', () => {
    expect(() => {
      Assert.that(5, 'first Number').isLessThan(3, 'other Number');
    }).toThrowError(AssertionError, 'first Number(5) should be less than other Number(3)');
  });

  it('should throw AssertionError for the first Value being a String (not a number)', () => {
    expect(() => {
      Assert.that('string').isLessThan(5)
    }).toThrowError(AssertionError, 'For a Comparing-Assertion both Values must be of type "number" and not null')
  });

  it('should throw AssertionError for the first Value being NaN', () => {
    expect(() => {
      Assert.that(NaN).isLessThan(5)
    }).toThrowError(AssertionError, 'For a Comparing-Assertion both Values must be of type "number" and not null')
  });

  it('should throw AssertionError for the first Value being null', () => {
    expect(() => {
      Assert.that(null).isLessThan(5)
    }).toThrowError(AssertionError, 'For a Comparing-Assertion both Values must be of type "number" and not null')
  });

  it('should throw AssertionError for the second Value being NaN', () => {
    expect(() => {
      Assert.that(3).isLessThan(NaN)
    }).toThrowError(AssertionError, 'For a Comparing-Assertion both Values must be of type "number" and not null')
  });

  it('should throw AssertionError for the second Value being null', () => {
    expect(() => {
      Assert.that(3).isLessThan(null)
    }).toThrowError(AssertionError, 'For a Comparing-Assertion both Values must be of type "number" and not null')
  });
});

describe('Assert.isGreaterOrEquals', () => {
  it('should pass for a number being greater than another Number, without description', () => {
    expect(() => {
      Assert.that(5).isGreaterOrEquals(2)
    }).not.toThrow();
  });

  it('should pass for a number being greater than another Number, with description', () => {
    expect(() => {
      Assert.that(5, 'first Number').isGreaterOrEquals(2, 'other Number')
    }).not.toThrow();
  });

  it('should pass for a number being equal to another Number, without description', () => {
    expect(() => {
      Assert.that(2).isGreaterOrEquals(2);
    }).not.toThrow();
  });

  it('should throw pass for a number being equal to another Number, without description', () => {
    expect(() => {
      Assert.that(2, 'first Number').isGreaterOrEquals(2, 'other Number');
    }).not.toThrow();
  });

  it('should throw AssertionError for a number being less than other Number', () => {
    expect(() => {
      Assert.that(2, 'first Number').isGreaterOrEquals(3, 'other Number');
    }).toThrowError(AssertionError, 'first Number(2) should be greater than or equal to other Number(3)');
  });

  it('should throw AssertionError for the first Value being a String (not a number)', () => {
    expect(() => {
      Assert.that('string').isGreaterOrEquals(5)
    }).toThrowError(AssertionError, 'For a Comparing-Assertion both Values must be of type "number" and not null')
  });

  it('should throw AssertionError for the first Value being NaN', () => {
    expect(() => {
      Assert.that(NaN).isGreaterOrEquals(5)
    }).toThrowError(AssertionError, 'For a Comparing-Assertion both Values must be of type "number" and not null')
  });

  it('should throw AssertionError for the first Value being null', () => {
    expect(() => {
      Assert.that(null).isGreaterOrEquals(5)
    }).toThrowError(AssertionError, 'For a Comparing-Assertion both Values must be of type "number" and not null')
  });

  it('should throw AssertionError for the second Value being NaN', () => {
    expect(() => {
      Assert.that(3).isGreaterOrEquals(NaN)
    }).toThrowError(AssertionError, 'For a Comparing-Assertion both Values must be of type "number" and not null')
  });

  it('should throw AssertionError for the second Value being null', () => {
    expect(() => {
      Assert.that(3).isGreaterOrEquals(null)
    }).toThrowError(AssertionError, 'For a Comparing-Assertion both Values must be of type "number" and not null')
  });
});

describe('Assert.isLessOrEquals', () => {
  it('should pass for a number being less than another Number, without description', () => {
    expect(() => {
      Assert.that(2).isLessOrEquals(5)
    }).not.toThrow();
  });

  it('should pass for a number being less than another Number, with description', () => {
    expect(() => {
      Assert.that(2, 'first Number').isLessOrEquals(5, 'other Number')
    }).not.toThrow();
  });

  it('should pass for a number being equal to another Number, without description', () => {
    expect(() => {
      Assert.that(2).isLessOrEquals(2);
    }).not.toThrow();
  });

  it('should pass for a number being equal to another Number, without description', () => {
    expect(() => {
      Assert.that(2, 'first Number').isLessOrEquals(2, 'other Number');
    }).not.toThrow();
  });

  it('should throw AssertionError for a number being greater than other Number', () => {
    expect(() => {
      Assert.that(5, 'first Number').isLessOrEquals(3, 'other Number');
    }).toThrowError(AssertionError, 'first Number(5) should be less than or equal to other Number(3)');
  });

  it('should throw AssertionError for the first Value being a String (not a number)', () => {
    expect(() => {
      Assert.that('string').isLessOrEquals(5)
    }).toThrowError(AssertionError, 'For a Comparing-Assertion both Values must be of type "number" and not null')
  });

  it('should throw AssertionError for the first Value being NaN', () => {
    expect(() => {
      Assert.that(NaN).isLessOrEquals(5)
    }).toThrowError(AssertionError, 'For a Comparing-Assertion both Values must be of type "number" and not null')
  });

  it('should throw AssertionError for the first Value being null', () => {
    expect(() => {
      Assert.that(null).isLessOrEquals(5)
    }).toThrowError(AssertionError, 'For a Comparing-Assertion both Values must be of type "number" and not null')
  });

  it('should throw AssertionError for the second Value being NaN', () => {
    expect(() => {
      Assert.that(3).isLessOrEquals(NaN)
    }).toThrowError(AssertionError, 'For a Comparing-Assertion both Values must be of type "number" and not null')
  });

  it('should throw AssertionError for the second Value being null', () => {
    expect(() => {
      Assert.that(3).isLessOrEquals(null)
    }).toThrowError(AssertionError, 'For a Comparing-Assertion both Values must be of type "number" and not null')
  });
});

describe('Assert.isNull', () => {
  it('should pass for null', () => {
    expect(() => {
      Assert.that(null, 'nothing').isNull();
    }).not.toThrow();
  });

  it('should pass for undefined', () => {
    expect(() => {
      let undef: number;

      Assert.that(undef).isNull();
    }).not.toThrow();
  });

  it('should throw AssertionError for values not null, without description', () => {
    expect(() => {
      Assert.that(5).isNull();
    }).toThrowError(AssertionError, 'value should be null, not 5');
  });

  it('should throw AssertionError for values not null, with description', () => {
    expect(() => {
      Assert.that(5, 'something').isNull();
    }).toThrowError(AssertionError, 'something should be null, not 5');
  });
});





describe('Assert.not.equals', () => {


  it('should pass for unequal numbers without description', () =>{
    expect(() => {
      Assert.that(1).not.equals(2);
    }).not.toThrow()
  });

  it('should pass for equal unnumbers with description', () =>{
    expect(() => {
      Assert.that(1, 'a Number').not.equals(2, 'different Number');
    }).not.toThrow()
  });

  it('should throw AssertionError for equal numbers, without description', () =>{
    expect(() => {
      Assert.that(1).not.equals(1);
    }).toThrowError(
      AssertionError, '(1) should be not equal to (1)'
    );
  });

  it('should throw AssertionError for equal numbers, with description', () =>{
    expect(() => {
      Assert.that(1, 'a Number').not.equals(1, 'same Number');
    }).toThrowError(
      AssertionError, 'a Number(1) should be not equal to same Number(1)'
    );
  });

  it('should pass for unequal strings', () =>{
    expect(() => {
      Assert.that('absd').not.equals('def')
    }).not.toThrow();
  });

  it('should throw AssertionError for equal strings', () =>{
    expect(() => {
      Assert.that('abc', 'a text').not.equals('abc', 'the same text');
    }).toThrowError(
      AssertionError, 'a text(abc) should be not equal to the same text(abc)'
    );
  });


  it('should throw AssertionError for same Object Reference', () =>{
    let obj = {
      val:1
    };

    expect(() => {
      Assert.that(obj).not.equals(obj);
    }).toThrowError(AssertionError, '([object Object]) should be not equal to ([object Object])');
  });

  it('should throw AssertionError for same Object-structure with different Reference', () =>{
    let obj1 = {
      val:1
    };
    let obj2 = {
      val:1
    };

    expect(() => {
      Assert.that(obj1).not.equals(obj2);
    }).toThrowError(AssertionError, '([object Object]) should be not equal to ([object Object])');
  });

  it('should pass for unequal Objects', () => {
    let obj1 = {
      val:1
    };
    let obj2 = {
      val:2
    };

    expect(() => {
      Assert.that(obj1).not.equals(obj2);
    }).not.toThrow();
  });

});

describe('Assert.not.isGreaterThan', () => {
  it('should pass for a number being less than another Number, without description', () => {
    expect(() => {
      Assert.that(2).not.isGreaterThan(5)
    }).not.toThrow();
  });

  it('should pass for a number being less than another Number, with description', () => {
    expect(() => {
      Assert.that(2, 'first Number').not.isGreaterThan(5, 'other Number')
    }).not.toThrow();
  });

  it('should pass for a number being equal to another Number, without description', () => {
    expect(() => {
      Assert.that(2).not.isGreaterThan(2);
    }).not.toThrow();
  });

  it('should pass for a number being equal to another Number, without description', () => {
    expect(() => {
      Assert.that(2, 'first Number').not.isGreaterThan(2, 'other Number');
    }).not.toThrow();
  });

  it('should throw AssertionError for a number being greater than other Number', () => {
    expect(() => {
      Assert.that(5, 'first Number').not.isGreaterThan(3, 'other Number');
    }).toThrowError(AssertionError, 'first Number(5) should be not greater than other Number(3)');
  });

  it('should throw AssertionError for the first Value being a String (not a number)', () => {
    expect(() => {
      Assert.that('string').not.isGreaterThan(5)
    }).toThrowError(AssertionError,
      'For a Comparing-Assertion both Values must be of type "number" and not null')
  });

  it('should throw AssertionError for the first Value being NaN', () => {
    expect(() => {
      Assert.that(NaN).not.isGreaterThan(5)
    }).toThrowError(AssertionError,
      'For a Comparing-Assertion both Values must be of type "number" and not null')
  });

  it('should throw AssertionError for the first Value being null', () => {
    expect(() => {
      Assert.that(null).not.isGreaterThan(5)
    }).toThrowError(AssertionError,
      'For a Comparing-Assertion both Values must be of type "number" and not null')
  });

  it('should throw AssertionError for the second Value being NaN', () => {
    expect(() => {
      Assert.that(3).not.isGreaterThan(NaN)
    }).toThrowError(AssertionError,
      'For a Comparing-Assertion both Values must be of type "number" and not null')
  });

  it('should throw AssertionError for the second Value being null', () => {
    expect(() => {
      Assert.that(3).not.isGreaterThan(null)
    }).toThrowError(AssertionError,
      'For a Comparing-Assertion both Values must be of type "number" and not null')
  });
});

describe('Assert.not.isLessThan', () => {
  it('should pass for a number being greater than another Number, without description', () => {
    expect(() => {
      Assert.that(5).not.isLessThan(2)
    }).not.toThrow();
  });

  it('should pass for a number being greater than another Number, with description', () => {
    expect(() => {
      Assert.that(5, 'first Number').not.isLessThan(2, 'other Number')
    }).not.toThrow();
  });

  it('should pass for a number being equal to another Number, without description', () => {
    expect(() => {
      Assert.that(2).not.isLessThan(2);
    }).not.toThrow();
  });

  it('should throw pass for a number being equal to another Number, without description', () => {
    expect(() => {
      Assert.that(2, 'first Number').not.isLessThan(2, 'other Number');
    }).not.toThrow();
  });

  it('should throw AssertionError for a number being less than other Number', () => {
    expect(() => {
      Assert.that(2, 'first Number').not.isLessThan(3, 'other Number');
    }).toThrowError(AssertionError, 'first Number(2) should be not less than other Number(3)');
  });

  it('should throw AssertionError for the first Value being a String (not a number)', () => {
    expect(() => {
      Assert.that('string').not.isLessThan(5)
    }).toThrowError(AssertionError,
      'For a Comparing-Assertion both Values must be of type "number" and not null')
  });

  it('should throw AssertionError for the first Value being NaN', () => {
    expect(() => {
      Assert.that(NaN).not.isLessThan(5)
    }).toThrowError(AssertionError,
      'For a Comparing-Assertion both Values must be of type "number" and not null')
  });

  it('should throw AssertionError for the first Value being null', () => {
    expect(() => {
      Assert.that(null).not.isLessThan(5)
    }).toThrowError(AssertionError,
      'For a Comparing-Assertion both Values must be of type "number" and not null')
  });

  it('should throw AssertionError for the second Value being NaN', () => {
    expect(() => {
      Assert.that(3).not.isLessThan(NaN)
    }).toThrowError(AssertionError,
      'For a Comparing-Assertion both Values must be of type "number" and not null')
  });

  it('should throw AssertionError for the second Value being null', () => {
    expect(() => {
      Assert.that(3).not.isLessThan(null)
    }).toThrowError(AssertionError,
      'For a Comparing-Assertion both Values must be of type "number" and not null')
  });
});

describe('Assert.not.isGreaterOrEquals', () => {
  it('should pass for a number being less than another Number, without description', () => {
    expect(() => {
      Assert.that(2).not.isGreaterOrEquals(5)
    }).not.toThrow();
  });

  it('should pass for a number being less than another Number, with description', () => {
    expect(() => {
      Assert.that(2, 'first Number').not.isGreaterOrEquals(5, 'other Number')
    }).not.toThrow();
  });

  it('should throw AssertionError for a number being equal to another Number, without description', () => {
    expect(() => {
      Assert.that(2).not.isGreaterOrEquals(2);
    }).toThrowError(AssertionError, '(2) should be not greater than or equal to (2)');
  });

  it('should throw AssertionError for a number being equal to another Number, without description', () => {
    expect(() => {
      Assert.that(2, 'first Number').not.isGreaterOrEquals(2, 'other Number');
    }).toThrowError(AssertionError, 'first Number(2) should be not greater than or equal to other Number(2)');
  });

  it('should throw AssertionError for a number being greater than other Number', () => {
    expect(() => {
      Assert.that(5, 'first Number').not.isGreaterOrEquals(3, 'other Number');
    }).toThrowError(AssertionError, 'first Number(5) should be not greater than or equal to other Number(3)');
  });

  it('should throw AssertionError for the first Value being a String (not a number)', () => {
    expect(() => {
      Assert.that('string').not.isGreaterOrEquals(5)
    }).toThrowError(AssertionError, 'For a Comparing-Assertion both Values must be of type "number" and not null')
  });

  it('should throw AssertionError for the first Value being NaN', () => {
    expect(() => {
      Assert.that(NaN).not.isGreaterOrEquals(5)
    }).toThrowError(AssertionError, 'For a Comparing-Assertion both Values must be of type "number" and not null')
  });

  it('should throw AssertionError for the first Value being null', () => {
    expect(() => {
      Assert.that(null).not.isGreaterOrEquals(5)
    }).toThrowError(AssertionError, 'For a Comparing-Assertion both Values must be of type "number" and not null')
  });

  it('should throw AssertionError for the second Value being NaN', () => {
    expect(() => {
      Assert.that(3).not.isGreaterOrEquals(NaN)
    }).toThrowError(AssertionError, 'For a Comparing-Assertion both Values must be of type "number" and not null')
  });

  it('should throw AssertionError for the second Value being null', () => {
    expect(() => {
      Assert.that(3).not.isGreaterOrEquals(null)
    }).toThrowError(AssertionError, 'For a Comparing-Assertion both Values must be of type "number" and not null')
  });
});

describe('Assert.not.isLessOrEquals', () => {
  it('should pass for a number being greater than another Number, without description', () => {
    expect(() => {
      Assert.that(5).not.isLessOrEquals(2)
    }).not.toThrow();
  });

  it('should pass for a number being greater than another Number, with description', () => {
    expect(() => {
      Assert.that(5, 'first Number').not.isLessOrEquals(2, 'other Number')
    }).not.toThrow();
  });

  it('should throw AssertionError for a number being equal to another Number, without description', () => {
    expect(() => {
      Assert.that(2).not.isLessOrEquals(2);
    }).toThrowError(AssertionError, '(2) should be not less than or equal to (2)');
  });

  it('should throw AssertionError for a number being equal to another Number, without description', () => {
    expect(() => {
      Assert.that(2, 'first Number').not.isLessOrEquals(2, 'other Number');
    }).toThrowError(AssertionError, 'first Number(2) should be not less than or equal to other Number(2)');
  });

  it('should throw AssertionError for a number being less than other Number', () => {
    expect(() => {
      Assert.that(2, 'first Number').not.isLessOrEquals(3, 'other Number');
    }).toThrowError(AssertionError, 'first Number(2) should be not less than or equal to other Number(3)');
  });

  it('should throw AssertionError for the first Value being a String (not a number)', () => {
    expect(() => {
      Assert.that('string').isGreaterThan(5)
    }).toThrowError(AssertionError, 'For a Comparing-Assertion both Values must be of type "number" and not null')
  });

  it('should throw AssertionError for the first Value being NaN', () => {
    expect(() => {
      Assert.that(NaN).not.isLessOrEquals(5)
    }).toThrowError(AssertionError, 'For a Comparing-Assertion both Values must be of type "number" and not null')
  });

  it('should throw AssertionError for the first Value being null', () => {
    expect(() => {
      Assert.that(null).not.isLessOrEquals(5)
    }).toThrowError(AssertionError, 'For a Comparing-Assertion both Values must be of type "number" and not null')
  });

  it('should throw AssertionError for the second Value being NaN', () => {
    expect(() => {
      Assert.that(3).not.isLessOrEquals(NaN)
    }).toThrowError(AssertionError, 'For a Comparing-Assertion both Values must be of type "number" and not null')
  });

  it('should throw AssertionError for the second Value being null', () => {
    expect(() => {
      Assert.that(3).not.isLessOrEquals(null)
    }).toThrowError(AssertionError, 'For a Comparing-Assertion both Values must be of type "number" and not null')
  });
});

describe('Assert.not.isNull', () => {
  it('should throw AssertionError for null', () => {
    expect(() => {
      Assert.that(null, 'nothing').not.isNull();
    }).toThrowError(AssertionError, 'nothing should not be null, is null');
  });

  it('should throw AssertionError for undefined', () => {
    expect(() => {
      let undef: number;

      Assert.that(undef).not.isNull();
    }).toThrowError(AssertionError, 'value should not be null, is null');
  });

  it('should pass for values not null, without description', () => {
    expect(() => {
      Assert.that(5).not.isNull();
    }).not.toThrow();
  });

  it('should pass for values not null, with description', () => {
    expect(() => {
      Assert.that(5, 'something').not.isNull();
    }).not.toThrow();
  });
});
