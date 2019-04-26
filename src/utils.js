import isString from "lodash/isString";

// 首字母大写
export function capitalize(str) {
  if (str && isString(str)) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
  return "";
}
