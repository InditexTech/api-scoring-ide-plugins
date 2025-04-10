import { ApiIdentifier } from "../../types";

export default function getApiIdentifier<TApiIdentifier extends ApiIdentifier = ApiIdentifier>({
  apiName,
  apiProtocol,
}: TApiIdentifier) {
  return `${apiName}-${apiProtocol}`;
}
