export function formatDates(date) {
  let formatted = null;
  const dateRecieved = new Date(date);

  const mm = String(dateRecieved.getMonth() + 1).padStart(2, "0");
  const dd = String(dateRecieved.getDate()).padStart(2, "0");
  const yyyy = dateRecieved.getFullYear();
  formatted = `${mm}-${dd}-${yyyy}`;
  return formatted;
}
export function formatVoucherDate(dateInput) {
  const date = new Date(dateInput);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date");
  }
  console.log(date);

  const year = String(date.getFullYear()).slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");

  return `${year} YR ${month} MO`;
}
