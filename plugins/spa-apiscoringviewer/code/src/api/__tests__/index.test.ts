// SPDX-FileCopyrightText: ©2023 Inditex
//
// SPDX-License-Identifier: Apache-2.0

import { ResponseError, get, isResponseError, isTimeoutError } from "api";

afterEach(() => {
  jest.resetAllMocks();
});

test.each([{ httpVerb: get }])("200 Ok responses to return parsed content", async ({ httpVerb }) => {
  const OriginalRequest = global.Request;
  const spiedRequest = jest.spyOn(global, "Request");
  spiedRequest.mockImplementationOnce((...args) => new OriginalRequest(...args));

  const spiedFetch = jest.spyOn(global, "fetch");
  const response = new Response(JSON.stringify({ value: 3 }));
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  spiedFetch.mockImplementationOnce((..._args: Parameters<typeof fetch>) => Promise.resolve(response));

  const jsonResponse = await httpVerb("/test");

  expect(spiedFetch).toHaveBeenCalledWith("/test", expect.objectContaining({ mode: "cors" }));
  expect(jsonResponse).toMatchObject({ value: 3 });
});

test("rejects errors", () => {
  const spiedFetch = jest.spyOn(global, "fetch");
  const response = new Response(null, { status: 400, statusText: "Bad Request" });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  spiedFetch.mockImplementation((..._args: Parameters<typeof fetch>) => Promise.resolve(response));

  return Promise.all([
    expect(get("/")).rejects.toThrowError(new ResponseError("Bad Request")),
    expect(get("/")).rejects.toMatchObject({ status: 400, timeout: false }),
  ]);
});

test("timeouts errors", () => {
  jest.useFakeTimers("modern");

  const spiedFetch = jest.spyOn(global, "fetch");
  const response = new Response(JSON.stringify({ value: 3 }));
  spiedFetch.mockImplementation(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (..._args: Parameters<typeof fetch>) => new Promise((resolve) => setTimeout(resolve, 16000, response)),
  );
  jest.advanceTimersByTime(15001);

  const result = Promise.all([
    expect(get("/")).rejects.toThrowError(new ResponseError("Request timeout")),
    expect(get("/")).rejects.toMatchObject({ status: undefined, timeout: true }),
  ]);

  jest.runAllTimers();
  jest.useRealTimers();

  return result;
});

test("response error", () => {
  expect(isResponseError(new ResponseError("An error"))).toBe(true);

  const timeoutError = new ResponseError("Some error");
  timeoutError.timeout = true;
  expect(isResponseError(timeoutError)).toBe(true);
  expect(isTimeoutError(timeoutError)).toBe(true);
});

test("invalid JSON", () => {
  const spiedFetch = jest.spyOn(global, "fetch");
  const response = new Response('{"value":3');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  spiedFetch.mockImplementation((..._args: Parameters<typeof fetch>) => Promise.resolve(response));

  return Promise.all([
    expect(get("/")).rejects.toThrowError(),
    expect(get("/")).rejects.not.toBeInstanceOf(ResponseError),
    expect(get("/")).rejects.not.toMatchObject({ status: undefined, timeout: undefined }),
  ]);
});
