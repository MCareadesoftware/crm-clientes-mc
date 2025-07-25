
// Insensiblizar el texto a mayúsculas, minúsculas y tíldes.
export default function NormalizeText(str) {
  if (!str || typeof str !== 'string') {
    return '';
  }
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}