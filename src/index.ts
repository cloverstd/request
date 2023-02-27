import { internalRequest } from "./internalRequest";
import { InvokeContext } from "./types/InvokeContext";
import { Interceptor } from "./Interceptor";
import type { InvokeParams } from "./types/InvokeParams";
import type { InvokeResult } from "./types/InvokeResult";

export { InvokeContext, InvokeParams, InvokeResult };

// Export the interceptore pairs definitions.
export const interceptors = {
  request: new Interceptor<InvokeParams>(),
  response: new Interceptor<InvokeResult, InvokeContext>(),
};

// Export the `request` function and surround it with intercepters.
export const request = (args: InvokeParams) => {
  const { request, response } = interceptors;
  // Execute request handlers as a pipeline.
  return Interceptor.pipeline(request, Promise.resolve(args)).then((params) => {
    // Prepare the context of response pipeline.
    const context: InvokeContext = { request: params };
    // Call the internal request method and wrap it as a promise.
    const resTask = Promise.resolve(params).then(internalRequest);
    // Execute response handlers as a pipeline.
    return Interceptor.pipeline(response, resTask, context);
  });
};

// Find the globalThis object across browsers and miniprogram platforms.
const globalThis =
  typeof window === "object"
    ? window
    : typeof global === "object"
    ? global
    : null;
if (globalThis) {
  const key = "@huolala-tech/request";
  if (key in globalThis) {
    // Log an error if this key was set in the global object.
    console.error(`${key} was installed duplicately with different versions.`);
  } else {
    // Set the key to the global object.
    Object.defineProperty(globalThis, key, {
      configurable: true,
      value: request,
    });
  }
}