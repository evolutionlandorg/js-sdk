import { isString } from "lodash-es";
import foo from "./foo";

const add = (a: number, b = 20): number => {
  isString(foo) ? console.log(foo) : console.log("what ...");
  return a + b + 10;
};

export default add;
