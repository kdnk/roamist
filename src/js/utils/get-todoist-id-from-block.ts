export const getTodoistIdFromBlock = (text: string) => {
  try {
    const matched = text.match(/#Todoist\/\d{10}/);
    if (!matched) {
      return "";
    }
    const todoistId = matched[0].replace("#Todoist/", "");
    return todoistId;
  } catch (e) {
    console.warn(e);
    return "";
  }
};
