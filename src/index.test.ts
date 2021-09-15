import add from "./index";

test("add 10 + 20 to equal 30", () => {
  expect(add(10, 20)).toEqual(30);
});
