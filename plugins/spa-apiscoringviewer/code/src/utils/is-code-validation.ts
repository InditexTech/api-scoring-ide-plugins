import { ValidationType } from "types";

const CODE_VALIDATION_TYPES: ValidationType[] = [ValidationType.DESIGN, ValidationType.SECURITY];

export default function isCodeValidation(type: ValidationType) {
  return CODE_VALIDATION_TYPES.includes(type);
}
