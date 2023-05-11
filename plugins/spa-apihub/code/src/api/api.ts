import { get } from "api";

const appendSearch = (pathName: string, searchParams: URLSearchParams): string => {
  const search = searchParams.toString();
  return search.length > 0 ? `${pathName}?${search}` : pathName;
};

export const api = {
  validations: {
    latest: (searchParams: URLSearchParams) => {
      return get(appendSearch("/validation/latest", searchParams));
    },
  },
};
