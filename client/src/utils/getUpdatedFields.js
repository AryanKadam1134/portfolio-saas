export const getUpdatedFields = (data, dirtyFields) => {
  const updated = {};

  for (const key in dirtyFields) {
    if (
      typeof dirtyFields[key] === "object" &&
      !Array.isArray(dirtyFields[key])
    ) {
      updated[key] = getUpdatedFields(data[key], dirtyFields[key]);
    } else {
      updated[key] = data[key];
    }
  }

  return updated;
};
