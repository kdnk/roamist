import { getTodoistIdFromBlock } from "../get-todoist-id-from-block";

test("a", () => {
  expect(1).toBe(1);
  expect(getTodoistIdFromBlock("9876543210 aaaaaaa #Todoist/0123456789")).toBe(
    "0123456789"
  );
});
