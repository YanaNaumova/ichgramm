export function timeAgo(postDate) {
  const postDateObj = new Date(postDate); // Convert the string to a Date object
  const currentDate = new Date(); // Get the current date
  const diffInMilliseconds = currentDate - postDateObj; // Difference in milliseconds

  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60)); // Difference in minutes
  const diffInHours = Math.floor(diffInMinutes / 60); // Difference in hours
  const diffInDays = Math.floor(diffInHours / 24); // Difference in days

  if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""}`; // "1 day" or "2 days"
  } else if (diffInHours > 0) {
    return `${diffInHours} h.`; // "3 h." or "12 h."
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes} min.`; // "45 min." or "1 min."
  } else {
    return "just now"; // If the difference is less than a minute
  }
}
