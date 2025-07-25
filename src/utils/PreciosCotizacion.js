import { toast } from "react-toastify";
import CalcularPrecioPais from "./CalcularPrecioPais";
import axios from "axios";
import { BACKEND } from "../configs/envConfig";

export const getFinalPriceCot = (
  serviciosCotizaciones,
  descuento,
  allServiciosList
) => {
  // Funcion rota hasta que se arregla usaremos la otra ↓
  // const sumOfServices = serviciosCotizaciones?.reduce(
  //   (acc, obj) =>
  //     (obj.customPriceActive ? obj.customPrice * obj.numeroItems : (allServiciosList
  //       .find((ev1) => ev1.id === obj.servicio.id)
  //       .preciosUnitarios.find((ev2) => ev2.plan.id === obj.planServicio.id)
  //       ?.precio * obj.numeroItems ))+ acc,0
  // );

  const sumOfServices = serviciosCotizaciones?.reduce((acc, obj) => {
    // Verificar que el objeto no sea nulo y que las propiedades necesarias existan
    if (!obj || !obj.numeroItems || !obj.servicio?.id || !obj.planServicio?.id) {
      return acc; // Si falta alguna propiedad, no suma este objeto
    }
  
    // Si tiene precio personalizado activado
    if (obj.customPriceActive) {
      return acc + (obj.customPrice || 0) * obj.numeroItems;
    }
  
    // Buscar el servicio en la lista de todos los servicios
    const servicioEncontrado = allServiciosList?.find((ev1) => ev1.id === obj.servicio.id);
    
    // Verificar si se encontró el servicio y si tiene los preciosUnitarios necesarios
    if (!servicioEncontrado?.preciosUnitarios) {
      return acc; // Si no se encuentra el servicio o preciosUnitarios, saltar
    }
  
    // Buscar el precio correspondiente al plan
    const precioEncontrado = servicioEncontrado.preciosUnitarios.find((ev2) => ev2.plan.id === obj.planServicio.id)?.precio;
  
    // Sumar el precio multiplicado por el número de ítems si se encontró, de lo contrario sumar 0
    return acc + (precioEncontrado || 0) * obj.numeroItems;
  }, 0);
  

  return sumOfServices - descuento;
};

export const getFinalPriceCotDrawer = ({ serviciosCotizaciones, allServiciosList, porcentajeIGV = 18, multiplicador }) => {
  let subtotalSinIGV = 0;
  let igvTotal = 0;

  serviciosCotizaciones?.forEach((obj) => {
    if (!obj || !obj.numeroItems || !obj.servicio?.id || !obj.planServicio?.id) {
      return; // Si falta alguna propiedad, no procesamos este objeto
    }

    // Precio del servicio (personalizado o encontrado)
    let precioBase = 0;
    if (obj.customPriceActive) {
      // El customPrice ya está en soles, solo multiplicamos por la cantidad
      precioBase = (obj.customPrice || 0) * obj.numeroItems;
    } else {
      const servicioEncontrado = allServiciosList?.find(
        (ev1) => ev1.id === obj.servicio.id
      );
      const precioEncontrado = servicioEncontrado?.preciosUnitarios.find(
        (ev2) => ev2.plan.id === obj.planServicio.id
      )?.precio;

      // Para precios no personalizados, primero calculamos el total y luego aplicamos el multiplicador
      precioBase = (precioEncontrado || 0) * obj.numeroItems;
      precioBase = CalcularPrecioPais({precio: precioBase, multiplicador: multiplicador});
    }

    // Aplicar el descuento al precio base
    let precioConDescuento = precioBase;

    if (obj.tipoDescuento === "Porcentaje") {
      precioConDescuento -= precioBase * (obj.montoDescuento / 100);
    } else if (obj.tipoDescuento === "Fijo") {
      precioConDescuento -= obj.montoDescuento * obj.numeroItems;
    }

    // Asegurarse de que el precio con descuento no sea negativo
    precioConDescuento = Math.max(precioConDescuento, 0);

    // Sumar al subtotal sin IGV (el precio con descuento)
    subtotalSinIGV += precioConDescuento;

    // Verificar si el servicio tiene IGV activo
    if (obj.igv === "si") {
      // El IGV se calcula sobre el precio con descuento
      igvTotal += precioConDescuento * (porcentajeIGV / 100);
    }
  });

  let totalConIGV = subtotalSinIGV + igvTotal;

  return {
    subtotalSinIGV,
    igvTotal,
    totalConIGV,
  };
};



// Funcion rota hasta que se arregla usaremos la otra ↓ x2
// export const getPuntosFromSelectedServicesandAllServices = (serviciosCotizaciones, allServiciosList) => {
//   const sumOfServices = serviciosCotizaciones?.reduce(
//     (acc, obj) =>
//       allServiciosList
//         .find((ev1) => ev1.id === obj.servicio.id)
//         .preciosUnitarios.find((ev2) => ev2.plan.id === obj.planServicio.id)
//         ?.puntos * obj.numeroItems + acc,0
//   );

//   return sumOfServices ;
// };

export const getPuntosFromSelectedServicesandAllServices = (serviciosCotizaciones, allServiciosList) => {

  const sumOfServices = serviciosCotizaciones?.reduce((acc, obj) => {
    // Encuentra el servicio correspondiente en allServiciosList
    const servicio = allServiciosList.find(ev1 => ev1.id === obj.servicio.id);
    
    // Si el servicio no existe, saltar al siguiente objeto
    if (!servicio) {
      // toast.error(`Servicio con ID ${obj.servicio.id} no encontrado`);
      // console.error(`Servicio con ID ${obj.servicio.id} no encontrado`);
      return acc; 
    }

    // Encuentra el plan correspondiente en preciosUnitarios
    const plan = servicio.preciosUnitarios?.find(ev2 => ev2.plan.id === obj.planServicio.id);
    
    // Si el plan no existe, saltar al siguiente objeto
    if (!plan) {
      // toast.error(`Plan con ID ${obj.planServicio.id} no encontrado en servicio con ID ${obj.servicio.id}`);
      // console.error(`Plan con ID ${obj.planServicio.id} no encontrado en servicio con ID ${obj.servicio.id}`);
      return acc; 
    }

    // Multiplica los puntos por el número de ítems y suma al acumulador
    return plan.puntos * obj.numeroItems + acc;
  }, 0);

  return sumOfServices;
};
