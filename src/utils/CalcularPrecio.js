export function CalculateFinalPrice(s, services) {
  // console.log("Servicio:", s.servicio?.name || s.servicio);
  // console.log("ID:", s.id);
  
  let precioBase = 0;

  if (s.customPriceActive) {
    if (typeof s.customPrice === 'number' && typeof s.numeroItems === 'number') {
      precioBase = s.customPrice * s.numeroItems;
    } else {
      //console.warn("customPrice o numeroItems inválido:", s.customPrice, s.numeroItems);
    }
  } else if (s.servicio && s.planServicio) {
    const servicioInfo = services.find((e) => e.id === s.servicio.id);
    if (!servicioInfo) {
      //console.warn("Servicio no encontrado:", s.servicio.name);
    } else {
      const planInfo = servicioInfo.preciosUnitarios.find(
        (ev2) => ev2.plan.id === s.planServicio.id
      );
      if (!planInfo) {
        //console.warn("Plan no encontrado:", s.planServicio.id);
      } else if (typeof planInfo.precio === 'number' && typeof s.numeroItems === 'number') {
        precioBase = planInfo.precio * (s.servicio.categoria === "ADS" ? 1 : s.numeroItems);
      } else {
        //console.warn("Precio o número de items inválido:", planInfo.precio, s.numeroItems);
      }
    }
  }

  // Paso 2: Calcular descuento
  let montoDescuento = 0;
  if (s.tipoDescuento === "Porcentaje") {
    montoDescuento = precioBase * (s.montoDescuento / 100);
  } else if (s.tipoDescuento === "Fijo") {
    montoDescuento = s.montoDescuento * s.numeroItems;
  }

  // console.log(`Precio base: ${precioBase}, Descuento: ${montoDescuento}`);
  // console.log(`Precio final: ${precioBase - montoDescuento}`)

  // Paso 3: Retornar total
  return precioBase - montoDescuento;
}

// Esta fucnion servirá para calcular los precios en las tablas de metas individuales
// Ya que evalúa cuando el servicio es ADS, y multiplica los montos por 1
export function CalculateFinalPriceForGoals(s, services) {

  let precioBase = 0;

  if (s.customPriceActive) {
    if (typeof s.customPrice === 'number' && typeof s.numeroItems === 'number') {
      precioBase = s.customPrice * (s.servicio.categoria === "ADS" ? 1 : s.numeroItems);
    } else {
      //console.warn("customPrice o numeroItems inválido:", s.customPrice, s.numeroItems);
    }
  } else if (s.servicio && s.planServicio) {
    const servicioInfo = services.find((e) => e.id === s.servicio.id);
    if (!servicioInfo) {
      //console.warn("Servicio no encontrado:", s.servicio.name);
    } else {
      const planInfo = servicioInfo.preciosUnitarios.find(
        (ev2) => ev2.plan.id === s.planServicio.id
      );
      if (!planInfo) {
        //console.warn("Plan no encontrado:", s.planServicio.id);
      } else if (typeof planInfo.precio === 'number' && typeof s.numeroItems === 'number') {
        precioBase = planInfo.precio * (s.servicio.categoria === "ADS" ? 1 : s.numeroItems);
      } else {
        //console.warn("Precio o número de items inválido:", planInfo.precio, s.numeroItems);
      }
    }
  }

  // Paso 2: Calcular descuento
  let montoDescuento = 0;
  if (s.tipoDescuento === "Porcentaje") {
    montoDescuento = precioBase * (s.montoDescuento / 100);
  } else if (s.tipoDescuento === "Fijo") {
    montoDescuento = s.montoDescuento * (s.servicio.categoria === "ADS" ? 1 : s.numeroItems);

  }

  // console.log(`Precio base: ${precioBase}, Descuento: ${montoDescuento}`);
  // console.log(`Precio final: ${precioBase - montoDescuento}`)

  // Paso 3: Retornar total
  return precioBase - montoDescuento;}

