import type { ApiIdentifier } from "types";

export default function getModuleId({ apiName, apiProtocol }: Pick<ApiIdentifier, "apiName" | "apiProtocol">) {
  return `${apiName}-${apiProtocol}`;
}
