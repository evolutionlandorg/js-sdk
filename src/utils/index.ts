export const utilsPad0x = (str: string): string => {
  return str.startsWith("0x") ? str : `0x${str}`;
};
