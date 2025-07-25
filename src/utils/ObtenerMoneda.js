import NormalizeText from "./NormalizeText";

const ObtenerMoneda = ({pais, paises}) => {
  if (!pais || !paises) {
    if (!pais) {
      console.log("No se encontró el país")
    }
    if (!paises) {
      console.log("No se encontraron los países")
    }
    return 0;
  }
  const paisNormalizado = NormalizeText(pais);
  const clientCountry = paises?.find((p) => NormalizeText(p.name) === paisNormalizado)
  return clientCountry.currency || "PEN";
}

export default ObtenerMoneda;
