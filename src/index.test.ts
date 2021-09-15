import add from "./index";

test("add 1 + 2 to equal 3", () => {
  expect(add(1, 2)).toEqual(3);
});
