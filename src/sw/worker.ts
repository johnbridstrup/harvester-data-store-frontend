/// <reference lib="webworker" />
declare const self: DedicatedWorkerGlobalScope;

// import { blockingFunc } from "../utils";
// import blocking functions from the utils file here

// @todo to remove this function
export const blockingFunc = () => {
  new Array(100_000_000)
    .map((elm, index) => elm + index)
    .reduce((acc, cur) => acc + cur, 0);
};

export const someRPCFunc = () => {
  blockingFunc();
};
