function formatDate(value, fallback = "-") {
  try {
    if (!value) return fallback;
    const d = new Date(value);
    if (isNaN(d.getTime())) return fallback;
    return d.toLocaleDateString("es-PE", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return fallback;
  }
} 

export default formatDate;