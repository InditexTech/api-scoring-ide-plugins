import { ValidationType } from "../../types";

const types = ["DESIGN", "SECURITY", "DOCUMENTATION"];

export default function isModuleValidation(validationType: ValidationType) {
  return types.includes(validationType);
}
