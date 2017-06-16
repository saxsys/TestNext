export type SpecMethodType = "Given" | "When" | "Then" | "Then throw Error";

export const SpecMethodType = {
  GIVEN: "Given" as SpecMethodType,
  WHEN: "When" as SpecMethodType,
  THEN: "Then" as SpecMethodType,
  THEN_ERROR: "Then throw Error" as SpecMethodType,
};



