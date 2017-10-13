/**
 * Type to store the compare-operator of Asserts
 */
export type AssertProportion =
  'equal'|'not equal'|'greater'|'less'|'greater than or equal to'|'less than or equal to' | 'null'|
  'not greater than' | 'not less than' | 'not greater than or equal to' | 'not less than or equal to' | 'not null';

/**
 * Type to store the compare-operator of Asserts
 */
export const AssertProportion = {
  EQUAL: "equal to" as AssertProportion,
  NOT_EQUAL: "not equal to" as AssertProportion,
  GREATER: "greater than" as AssertProportion,
  LESS: "less than" as AssertProportion,
  GREATER_OR_EQUAL: "greater than or equal to" as AssertProportion,
  LESS_OR_EQUAL: "less than or equal to" as AssertProportion,
  NULL: "null" as AssertProportion,
  NOT_GREATER: "not greater than" as AssertProportion,
  NOT_LESS: "not less than" as AssertProportion,
  NOT_GREATER_OR_EQUAL: "not greater than or equal to" as AssertProportion,
  NOT_LESS_OR_EQUAL: "not less than or equal to" as AssertProportion,
  NOT_NULL: "not null" as AssertProportion,
};
