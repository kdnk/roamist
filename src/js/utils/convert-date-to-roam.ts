// ref. https://github.com/dvargas92495/SmartBlocks/issues/187#issuecomment-766252353
export const convertToRoamDate = (dateString: string) => {
  const [year, month, day] = dateString
    .split("-")
    .map((v) => Number(v));
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthName = months[month - 1];
  const suffix =
    (day >= 4 && day <= 20) || (day >= 24 && day <= 30)
      ? "th"
      : ["st", "nd", "rd"][(day % 10) - 1];
  return `${monthName} ${day}${suffix}, ${year}`;
};
