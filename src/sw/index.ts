/**
 * @module
 * create and export worker instance
 */

const worker = new ComlinkWorker<typeof import("./worker")>(
  new URL("./worker", import.meta.url),
);

export default worker;
