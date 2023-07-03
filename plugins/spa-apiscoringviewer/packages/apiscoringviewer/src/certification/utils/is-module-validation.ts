import { ValidationType } from "../../types";

const types = [ValidationType.DESIGN, ValidationType.SECURITY, ValidationType.DOCUMENTATION];

export default function isModuleValidation(validationType: ValidationType) {
  return types.includes(validationType);
}
