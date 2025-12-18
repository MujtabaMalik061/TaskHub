export const formatTimeAMPM = (isoDate) => {
  if (!isoDate) return "";

  const date = new Date(isoDate);

  let hours = date.getHours();
  const minutes = date.getMinutes();

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${formattedHours}:${formattedMinutes} ${ampm}`;
};

export const formatDateDDMMYY = (isoDate) => {
  if (!isoDate) return "";

  const date = new Date(isoDate);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear());

  return `${day}/${month}/${year}`;
};

export const groupCommentsByDate = (comments = []) => {
  return comments.reduce((groups, comment) => {
    const dateKey = formatDateDDMMYY(comment.createdAt);

    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }

    groups[dateKey].push(comment);
    return groups;
  }, {});
};
