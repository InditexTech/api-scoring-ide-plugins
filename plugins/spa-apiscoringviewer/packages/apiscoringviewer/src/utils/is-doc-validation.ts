import { ValidationType } from "../types";

export default function isDocValidation(type: ValidationType) {
  return type === ValidationType.DOCUMENTATION;
}
