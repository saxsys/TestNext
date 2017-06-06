export type AssertProportion =
  'equal'|'not equal'|'greater'|'less'|'greater or equal'|'less or equal' | 'null'| 'not not equal to' |
  'not greater than' | 'not less than' | 'not greater or equal than' | 'not less or equal than' | 'not null';

export const AssertProportion = {
  EQUAL: "equal to" as AssertProportion,
  NOT_EQUAL: "not equal to" as AssertProportion,
  GREATER: "greater than" as AssertProportion,
  LESS: "less than" as AssertProportion,
  GREATER_OR_EQUAL: "greater or equal than" as AssertProportion,
  LESS_OR_EQUAL: "less or equal than" as AssertProportion,
  NULL: "null" as AssertProportion,
  NOT_NOT_EQUAL: "not not equal to" as AssertProportion,
  NOT_GREATER: "not greater than" as AssertProportion,
  NOT_LESS: "not less than" as AssertProportion,
  NOT_GREATER_OR_EQUAL: "not greater or equal than" as AssertProportion,
  NOT_LESS_OR_EQUAL: "not less or equal than" as AssertProportion,
  NOT_NULL: "not null" as AssertProportion,
};
