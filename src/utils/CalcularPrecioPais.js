const CalcularPrecioPais = ({precio, multiplicador}) => {

  if (!multiplicador || multiplicador === "Seleccionar" || multiplicador === 0) {
    return precio
  }

  // Los precios de la agencia ya estan sobre la base imponible de 1130
  // Por lo que solo debemos calcular el precio final en base al pais seleccionado a partir de nuestro precio base

  const increasePercentage = multiplicador

  const increasePayment = precio * (increasePercentage / 100)
  const precioFinal = precio + increasePayment

  return precioFinal
}

export default CalcularPrecioPais;