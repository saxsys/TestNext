/**
 * Types of SpecMethods which have different functionality when executing a Spec
 */
export type SpecMethodType = "Given" | "When" | "Then" | "Then throw Error" | "Cleanup";

/**
 * Types of SpecMethods which have different functionality when executing a Spec
 * @type {{GIVEN: SpecMethodType; WHEN: SpecMethodType; THEN: SpecMethodType; THEN_ERROR: SpecMethodType; CLEANUP: SpecMethodType}}
 */
export const SpecMethodType = {
  GIVEN: "Given" as SpecMethodType,
  WHEN: "When" as SpecMethodType,
  THEN: "Then" as SpecMethodType,
  THEN_ERROR: "Then throw Error" as SpecMethodType,
  CLEANUP:"Cleanup" as SpecMethodType,
};



