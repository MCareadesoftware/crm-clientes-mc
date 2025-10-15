function formatCurrency(value) {
  try {
    return value?.toLocaleString("es-PE", { style: "currency", currency: "PEN" });
  } catch {
    return value;
  }
}

export default formatCurrency;