export const getTodoistId = (url: string) => {
  try {
    const matched = url.match(/\d{10}/);
    if (!matched) {
      return "";
    }
    const todoistId = matched[0];
    return todoistId;
  } catch (e) {
    console.warn(e);
    return "";
  }
};
