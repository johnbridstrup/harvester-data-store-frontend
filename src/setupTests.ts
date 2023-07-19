/**
 * Defines the setUp and tearDown server methods
 * for the requests
 *
 * Jest is excellent, but Vitest is more excellent.
 * This setup also allows us to extend Vitest matchers
 * with jest-dom.
 *
 * Note the trick:
 * The trick is to import only the matchers from jest-dom
 * and extend them manually with expect.extend(matchers).
 * The default way does not work because jest-dom expects
 * the Jest expect method to be in the global scope and
 * tries to use it to extend its matchers. But because we
 * use Vitest we need to extend the Vitest expect method
 * explicitly.
 */

// this is usually the default way with jest
// import "@testing-library/jest-dom";

// Now we got:
import matchers from "@testing-library/jest-dom/matchers";
import { expect } from "vitest";
import { server } from "@/mocks/server";

expect.extend(matchers);

// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());
