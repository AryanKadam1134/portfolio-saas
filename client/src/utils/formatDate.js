import dayjs from "dayjs";

const formatDateInISO = (date) => {
  return date ? dayjs(date).format("YYYY-MM-DD") : "";
};

const formatDateInAlphaNumeric = (date) => {
  return date ? dayjs(date).format("DD MMM, YYYY") : "";
};

export { formatDateInISO, formatDateInAlphaNumeric };
