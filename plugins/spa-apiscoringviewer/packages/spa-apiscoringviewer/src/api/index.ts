const DEFAULT_TIMEOUT = 15000;

export class ResponseError extends Error {
  status!: number;
  timeout = false;
}

export function isResponseError(error: Error): error is ResponseError {
  return error instanceof ResponseError;
}

export function isTimeoutError(error: Error): error is ResponseError {
  return isResponseError(error) && error.timeout;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HttpMethod = (url: string, options?: RequestInit) => Promise<any>;

type HttpMethodComposer = (method: HttpMethod, options?: RequestInit) => HttpMethod;

type ComposerFns = [HttpMethodComposer, ...HttpMethodComposer[]];

function compose(...fns: ComposerFns) {
  return function withVerbs(...methods: HttpMethod[]) {
    return methods.map((method) => fns.reduce((memo, fn) => fn(memo), method));
  };
}

const rejectServerErrors = (fn: HttpMethod) => (url: string, options?: RequestInit) =>
  new Promise((resolve, reject) =>
    fn(url, options)
      .then((res) => (res.ok ? resolve(res) : reject(res)))
      .catch((e) => reject(e)),
  );
const setAppBackend = (fn: HttpMethod) => (endpoint: string, options?: RequestInit) =>
  fn(process.env.NODE_ENV === "production" ? process.env.CERTIFICATION_SERVICE_URL + `${endpoint}` : endpoint, options);

const setCors =
  (fn: HttpMethod) =>
  (endpoint: string, options = {}) =>
    fn(endpoint, { ...options, mode: "cors" });

const parseResponseAndThrowError =
  <T>(fn: HttpMethod) =>
  (endpoint: string, options = {}): Promise<T> =>
    fn(endpoint, options).then(
      (res) => res.json(),
      (response): response is Response => {
        if (response instanceof ResponseError) {
          throw response;
        } else {
          const error = new ResponseError(response.statusText);
          error.status = response.status;
          throw error;
        }
      },
    );

const timeout =
  (fn: HttpMethod) =>
  (endpoint: string, options = {}): Promise<Response> => {
    const timeoutMs = 15000;
    const abortController = new AbortController();
    return new Promise((resolve, reject) => {
      const timeoutId = setTimeout(
        () => {
          abortController.abort();
          const error = new ResponseError("Request timeout");
          error.timeout = true;
          reject(error);
        },
        timeoutMs ? Number(timeoutMs) : DEFAULT_TIMEOUT,
      );

      fn(endpoint, { ...options, signal: abortController.signal })
        .then(resolve, reject)
        .then(() => {
          clearTimeout(timeoutId);
        });
    });
  };

const setJSONContentType = (fn: HttpMethod) => (url: string, options?: RequestInit) => {
  return fn(url, {
    ...options,
    headers: { ...options?.headers, "Content-Type": "application/json" },
  });
};

const makeRequest = (method: Required<RequestInit>["method"]) => (url: string, options?: RequestInit) => {
  return fetch(url, { ...options, method });
};

const [get, post] = compose(
  timeout,
  setJSONContentType,
  setAppBackend,
  setCors,
  rejectServerErrors,
  parseResponseAndThrowError,
)(makeRequest("GET"), makeRequest("POST"));

export { get, post };
