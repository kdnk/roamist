/* eslint-disable @typescript-eslint/no-non-null-assertion */

export const getTodoistId = (url: string) => {
  try {
    const todoistId = url.match(/\d{10}/)![0];
    return todoistId;
  } catch (e) {
    console.warn(e);
    return "";
  }
};
