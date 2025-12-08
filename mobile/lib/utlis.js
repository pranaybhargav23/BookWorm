// this function will convert the createdAt to this format: "May 2023"
export function formatMemberSince(dateString) {
  // If no date is provided, use current date as fallback
  if (!dateString) {
    const currentDate = new Date();
    const month = currentDate.toLocaleString("default", { month: "short" });
    const year = currentDate.getFullYear();
    return `${month} ${year}`;
  }
  
  const date = new Date(dateString);
  
  // If date is invalid, use current date as fallback
  if (isNaN(date.getTime())) {
    const currentDate = new Date();
    const month = currentDate.toLocaleString("default", { month: "short" });
    const year = currentDate.getFullYear();
    return `${month} ${year}`;
  }
  
  const month = date.toLocaleString("default", { month: "short" });
  const year = date.getFullYear();
  return `${month} ${year}`;
}

// this function will convert the createdAt to this format: "May 15, 2023"
export function formatPublishDate(dateString) {
  if (!dateString) {
    return "Invalid Date";
  }
  
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }
  
  const month = date.toLocaleString("default", { month: "long" });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}