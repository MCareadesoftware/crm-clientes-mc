import NormalizeText from "./NormalizeText";

const ObtenerMultiplicador = ({pais, paises}) => {
  if (!pais || !paises) {
    return 0;
  }

  const paisNormalizado = NormalizeText(pais);
  const clientCountry = paises?.find((p) => NormalizeText(p.name) === paisNormalizado)
  // console.log(clientCountry)
  // console.log("Multiplicador: " + clientCountry.increasePercentage)
  // console.log("Descuento: " + clientCountry.discountPercentage)
  const multiplicador = (clientCountry.increasePercentage - clientCountry.discountPercentage) || 0;
  // console.log("Total: " + multiplicador)
  return multiplicador || 0;
}

export default ObtenerMultiplicador;
