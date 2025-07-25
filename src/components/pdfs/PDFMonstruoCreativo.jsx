import { Document, Image, Page, StyleSheet, Text, View, Link, BlobProvider } from "@react-pdf/renderer"
import { Font } from "@react-pdf/renderer";
import DMSansBoldFont from "../../assets/fonts/DMSans-Bold.ttf";
import DMSansRegularFont from "../../assets/fonts/DMSans-Regular.ttf";
import ModalInDrawer from "../ui/ModalInDrawer"
import { PDFViewer } from "@react-pdf/renderer";
import PoppinsBold from "../../assets/fonts/PoppinsBold.ttf";
import PoppinsMedium from "../../assets/fonts/PoppinsMedium.ttf";
import PoppinsLight from "../../assets/fonts/PoppinsLight.ttf";
import LogoMcCuttedWhite from "../../assets/images/logo/LogoMcCuttedWhite.png"
import LogoMcWhite from "../../assets/images/logo/LogoMcWhite.png"
import salutHand from "../../assets/images/all-img/salutHand.png"
import { formatDateString } from "../../utils/DatesHelper"

import { getFinalPriceCotDrawer } from "../../utils/PreciosCotizacion";
import { CalculateFinalPrice } from "../../utils/CalcularPrecio";
import { FaDownload } from "react-icons/fa";

// import { handleDownloadBlobPDF } from "../../../utils/pdf/handleDownloadBlobPDF";

import CalcularPrecioPais from "../../utils/CalcularPrecioPais"
import ObtenerMultiplicador from "../../utils/ObtenerMultiplicador";

const brandName = "Monstruo Creativo"

Font.register({
    family: "DMSans",
    fonts: [
        { src: DMSansRegularFont, fontWeight: "normal" },
        { src: DMSansBoldFont, fontWeight: "bold" },
    ],
});

Font.register({
    family: "Poppins",
    fonts: [
        { src: PoppinsBold, fontWeight: "bold"},
        { src: PoppinsMedium, fontWeight: "normal"},
        { src: PoppinsLight, fontWeight: "light"}
    ]
})

const mainOrange = "#FE6400"
const secondaryOrange = "#FF7E0C"
const lightOrange = "#FFDCA6"
const darkBlue = "#072142"
const lightGray = "#F3F4F6"
const mediumGray = "#9CA3AF"
const mainGray = "#4B5563"
const linkBlue = "#005ACC"


const recurrentStyles = StyleSheet.create({

    generalSubtitle: {
        fontFamily: "Poppins", 
        fontWeight: "bold", 
        fontSize: "14px", 
        color: darkBlue, 
        marginBottom: "16px"
    },

    generalTitleHeadRow: {
        textAlign: "center", 
        fontFamily: "Poppins", 
        fontWeight: "bold", 
        fontSize: "10px", 
        color: "white"
    },
})

const infoBar = StyleSheet.create({

    infoBarItem: {
        display: "flex", 
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "center", 
        minWidth: "125px" 
    },

    infoBarTitle: {
        fontFamily: "Poppins", 
        fontWeight: "light", 
        color: darkBlue, 
        marginRight: "4px"
    },

    infoBarDataContainer: {
        backgroundColor: "white", 
        display: "flex", 
        flexDirection: "center", 
        justifyContent: "center", 
        minWidth: "88px", 
        height: "20px", 
        borderRadius: "4px",
        paddingHorizontal: "5px"
    },

    infoBarData: {
        fontFamily: "Poppins", 
        fontWeight: "light", 
        color: darkBlue,
        margin: "auto", 
        paddingTop: "2px"
    },

    infoBarDivison: {
        fontFamily: "Poppins",
        fontWeight: "light",
        color: darkBlue
    }
})

const dataSection = StyleSheet.create({

    titleDataSection: {
        fontFamily: "Poppins", 
        fontWeight: "normal", 
        fontSize: "14px", 
        color: mainOrange,
        marginBottom: "8px"
    },

    itemDataSection: {
        display: "flex",
        flexDirection: "row",
        width: "256px",
        marginBottom: "8px"
    },

    subtitleDataSection: {
        fontFamily: "Poppins",
        fontWeight: "bold",
        fontSize: "10px",
        color: darkBlue,
        minWidth: "80px",
    },

    itemDataDivisor: {
        fontFamily: "Poppins",
        fontWeight: "bold",
        fontSize: "10px",
        color: darkBlue,
        width: "3px",
        marginRight: "5px"
    },

    contentDataSection: {
        fontFamily: "Poppins",
        fontWeight: "light",
        fontSize: "10px",
        color: mainGray,
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis"
    },

    bankAccountsContainer: {
        display: "flex", 
        flexDirection: "column", 
        width: "190px", 
        paddingBottom: "4px", 
        marginBottom: "8px"
    },

    bankAccountsTitle: {
        fontFamily: "Poppins", 
        fontWeight: "light", 
        color: darkBlue, 
        fontSize: "10px", 
        marginBottom: "4px" 
    },

    bankAccountsData: {
        fontFamily: "Poppins",
        fontWeight: "bold",
        fontSize: "10px",
        color: darkBlue
    }
    

})

const serviceTable = StyleSheet.create({

    tableHeadContainer: {
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        width: "124px", 
        height: "32px", 
        backgroundColor: secondaryOrange, 
        borderColor: lightOrange, 
        borderWidth: 0.4
    },

    tableHeadContainer85: {
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        width: "85px", 
        height: "32px", 
        backgroundColor: secondaryOrange, 
        borderColor: lightOrange, 
        borderWidth: 0.4
    },

    tableHeadContainer56: {
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        width: "56px", 
        height: "32px", 
        backgroundColor: secondaryOrange, 
        borderColor: lightOrange, 
        borderWidth: 0.4
    },

    tableDataContainer85: {
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        width: "85px", 
        height: "56px", 
        borderWidth: 0.4, 
        borderColor: mediumGray
    },

    tableDataContainer124: {

    },

    tableDataContainer56: {
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        width: "56px", 
        height: "56px", 
        borderWidth: 0.4, 
        borderColor: mediumGray
    },

    tableDataText: {
        fontFamily: "Poppins", 
        fontWeight: "normal", 
        fontSize: "10px", 
        color: darkBlue,
        textAlign: "center"
    }

})

const paymentTable = StyleSheet.create({

    paymentTableheadContainer: {
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        width: "168px", 
        height: "32px", 
        backgroundColor: secondaryOrange, 
        borderColor: lightOrange, 
        borderWidth: 0.4
    },

    paymentTableDataContainer: {
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        width: "168px", 
        height: "32px", 
        borderColor: mediumGray, 
        borderWidth: 0.4
    }



})

const paymentTerms = StyleSheet.create({

    paymentTermItemContainer: {
        display: "flex", 
        flexDirection: "row", 
        textAlign: "center", 
        justifyContent: "center"
    },

    paymentTermTitle: {
        fontFamily: "Poppins", 
        fontWeight: "bold", 
        color: darkBlue, 
        fontSize: "10px" 
    },

    paymentTermItemDivisor: {
        display: "flex", 
        justifyContent: "center", 
        textAlign: "center", 
        fontFamily: "Poppins", 
        fontWeight: "bold", 
        fontSize: "10px", 
        width: "10px", 
        color: darkBlue
    },

    paymentTermLink: {
        fontFamily: "Poppins", 
        fontWeight: "bold", 
        color: linkBlue, 
        fontSize: "10px"
    }


})

const resumeServices = StyleSheet.create({

    serviceHeadContainer: {
        display: "flex", 
        justifyContent: "center", 
        width: "273px", 
        height: "32px", 
        paddingHorizontal: "16px", 
        backgroundColor: secondaryOrange, 
        borderWidth: 0.4, 
        borderColor: lightOrange
    },

    serviceHeadText: {
        fontFamily: "Poppins", 
        fontWeight: "Bold", 
        fontSize: "10px", 
        color: "white"
    }
})

const additionalLinks = StyleSheet.create({
    
    itemTitle: {
        fontFamily: "Poppins", 
        fontWeight: "bold", 
        fontSize: "10", 
        color: darkBlue, 
        width: "80px"
    },

    itemDivisor: {
        fontFamily: "Poppins",
        fontWeight: "bold", 
        fontSize: "10", 
        color: darkBlue, width: "10px"
    },

    itemData: {
        fontFamily: "Poppins", 
        fontWeight: "bold", 
        fontSize: "10px", 
        color: linkBlue
    }
})

const PDFMonstruoCreativo = ({ incognitMode, open, igv, onClose, title, cotizacionData, allServiciosList, serviciosList, pagosList,  moneda, comparativo, tipoCambio, paises }) => {

    const subtotal = serviciosList.reduce((acc, value) => {
        // Obtener el precio base
        const precioBase = value.customPriceActive
            ? value.customPrice * value.numeroItems
            : value.servicio.preciosUnitarios?.find(
                (pU) => pU.plan.id === value.planServicio.id
            )?.precio * value.numeroItems || 0;

        // Aplicar multiplicador del país solo si no es customPrice
        const precioConPais = value.customPriceActive
            ? precioBase
            : CalcularPrecioPais({
                precio: precioBase,
                multiplicador: ObtenerMultiplicador({
                    pais: cotizacionData?.cliente?.pais || cotizacionData?.lead?.country,
                    paises: paises
                })
            });

        // Aplicar descuento si existe
        let precioFinal = precioConPais;
        if (value.tipoDescuento === "Porcentaje") {
            precioFinal -= precioConPais * (value.montoDescuento / 100);
        } else if (value.tipoDescuento === "Fijo") {
            precioFinal -= value.montoDescuento * value.numeroItems;
        }

        return acc + precioFinal;
    }, 0);
    
    const calculateServicePrice = (servicio) => {
        if (servicio.customPriceActive) {
          // Si el precio personalizado está activo
          return servicio.customPrice * servicio.numeroItems;
        } else {
          // Buscar el precio del plan correspondiente
          const unitPrice =
            servicio.servicio.preciosUnitarios?.find(
              (pU) => pU.plan.id === servicio.planServicio.id
            )?.precio || 0;
          return unitPrice * servicio.numeroItems;
        }
    };

    // Versión nueva
    const calculateDiscount = () => {
        if (serviciosList && serviciosList.length > 0) {
          // Calcular el descuento total iterando sobre la lista de servicios
          const totalDescuento = serviciosList.reduce((total, servicio) => {
            const { tipoDescuento, montoDescuento } = servicio;
      
            // Calcular el precio del servicio usando la nueva función
            const precio = calculateServicePrice(servicio);
      
            // Asegurarse de que montoDescuento sea un número válido
            const descuentoNumerico = Number(montoDescuento) || 0;
      
            // Calcular el monto del descuento según el tipo
            let montoDescuentoCalculado = 0;
            if (tipoDescuento === "Porcentaje") {
                // Para descuento porcentual, aplicar al precio con multiplicador del país
                const precioConPais = servicio.customPriceActive
                    ? precio
                    : CalcularPrecioPais({
                        precio: precio,
                        multiplicador: ObtenerMultiplicador({
                            pais: cotizacionData?.cliente?.pais || cotizacionData?.lead?.country,
                            paises: paises
                        })
                    });
                montoDescuentoCalculado = (precioConPais * descuentoNumerico) / 100;
            } else if (tipoDescuento === "Fijo") {
                // Para descuento fijo, solo multiplicar por cantidad (sin multiplicador del país)
                montoDescuentoCalculado = descuentoNumerico * servicio.numeroItems;
            }
      
            return total + montoDescuentoCalculado; // Sumar el descuento al total
          }, 0);
      
          return totalDescuento; // Retornar el valor sin formatear para usar en cálculos
        } else {
          // Si no hay servicios, retornar un valor por defecto
          return 0;
        }
    };

    const descuentoTotal = calculateDiscount()
              
    const totalSinDescuento = subtotal - descuentoTotal;

    const { subtotalSinIGV, igvTotal, totalConIGV } = getFinalPriceCotDrawer({
      serviciosCotizaciones: serviciosList,
      allServiciosList: allServiciosList,
      porcentajeIGV: 18,
      multiplicador: ObtenerMultiplicador({
        pais: cotizacionData?.cliente?.pais || cotizacionData?.lead?.country, 
        paises: paises
      })
    })

    serviciosList.forEach(servicio => {
        // Ensure servicio is defined
        if (!servicio || !servicio.planServicio || !servicio.servicio) return;

        const nombrePlan = servicio.planServicio.name || ""; // Default to empty string if undefined
        const nombreServicio = servicio.servicio.name || ""; // Default to empty string if undefined

        const preciosUnitarios = servicio.servicio.preciosUnitarios || []; // Default to empty array if undefined

        const planesFiltrados = preciosUnitarios
            .filter(plan => nombrePlan === plan.plan?.name) // Optional chaining for safety
            .map(plan => ({
                nombreServicio,
                nombrePlan: plan.plan.name,
                descripcion: plan.descripcion,
            }));

        // Check if planesFiltrados has elements
        if (planesFiltrados.length > 0) {
            servicio.planServicio = {
                ...servicio.planServicio,
                nombreServicio: planesFiltrados[0].nombreServicio || "",
                descripcion: planesFiltrados[0].descripcion || "",
            };
        }
    });

    // Destructurar la descripcion por líneas en objetos { key: value }
    const parseDescription = (description) => {
        if (!description || typeof description !== 'string') {
            return [];
        }
    
        return description.split('\n').map(item => {
            const [key, value] = item.split(':');
            return { 
                key: key ? key.trim() : '',
                value: value ? value.trim() === '✓' ? 'Si' : value.trim() : 'No'
            };
        });
    };

    // Calcular automáticamente la altura del documento
    const calculatePageHeight = () => {
        const header = 108;
        const bar = 40;
        const info = 259;
        const serviceTable = 80;
        const terms = 209;
        const serviceResume = 40;
        const marginBottom = 150;
        const succesCases = 200;
        const footer = 40;
    
        if (comparativo) {
            const staticHeight = header + bar + info + terms + marginBottom + footer;
            
            // Calcular altura para cada servicio en modo comparativo
            const serviciosHeight = comparativoServicios.reduce((total, servicio) => {
                // Altura del título del servicio
                const tituloHeight = 36; // 20px font + 16px margin-bottom
                
                // Obtener la descripción del primer plan para saber cuántas características hay
                const caracteristicas = parseDescription(servicio.planes[0].customDescription);
                
                // Altura del header de la tabla (nombre del plan + padding)
                const tableHeaderHeight = 48; // 16px padding top/bottom + 16px contenido
                
                // Altura de cada fila de características (12px padding top/bottom + contenido)
                const caracteristicasHeight = caracteristicas.length * 56;
                
                // Altura del footer con precios y descuentos
                const footerHeight = 48; // 16px padding + contenido
                
                // Margen entre tablas
                const tableMargin = 32;
                
                // Total para este servicio
                return total + tituloHeight + tableHeaderHeight + caracteristicasHeight + footerHeight + tableMargin;
            }, 0);

            return staticHeight + serviciosHeight;
        }
    
        const staticHeight = header + bar + info + serviceTable + terms + serviceResume;
        const minDescriptionHeight = 400; // Altura mínima para la descripción de cada servicio
    
        const serviciosItemNumbers = serviciosList.length * 56;
        const pagosItemNumbers = pagosList.length * 100;
    
        const serviciosDescripcionNumbers = serviciosList.reduce((total, item) => {
            let descriptionService = []

            if (item.customDescriptionActive) {
                descriptionService = parseDescription(item.customDescriptionText)
            } else {
                descriptionService = parseDescription(item.planServicio.descripcion);
            }
    
            const descriptionHeight = descriptionService.reduce((descTotal, descItem) => {
                return descTotal + (descItem.key.length < 35 ? 40 : 52);
            }, 0);
    
            // Usar el máximo entre la altura calculada y la mínima para cada servicio
            return total + Math.max(descriptionHeight, minDescriptionHeight);
        }, 0);
    
        const finalHeight = staticHeight + serviciosItemNumbers + pagosItemNumbers + marginBottom + succesCases + footer;
        return finalHeight + serviciosDescripcionNumbers;
    };

    const comparativoServicios = serviciosList.reduce((acc, item) => {
        // Buscar si ya existe el servicio en el acumulador
        const servicioExistente = acc.find(s => s.servicio.id === item.servicio.id);

        if (servicioExistente) {
            // Si existe, agregar el plan al array de planes
            servicioExistente.planes.push({
                plan: item.planServicio,
                customDescription: item.customDescriptionActive ? item.customDescriptionText : item.planServicio.descripcion,
                precio: item.customPriceActive ? item.customPrice : item.servicio.preciosUnitarios?.find(pU => pU.plan.id === item.planServicio.id)?.precio || 0,
                descuento: item.montoDescuento || 0,
                tipoDescuento: item.tipoDescuento,
                cantidad: item.numeroItems
            });
            // Ordenar los planes por precio de menor a mayor
            servicioExistente.planes.sort((a, b) => a.precio - b.precio);
        } else {
            // Si no existe, crear nuevo objeto con el servicio y su primer plan
            acc.push({
                servicio: item.servicio,
                planes: [{
                    plan: item.planServicio,
                    customDescription: item.customDescriptionActive ? item.customDescriptionText : item.planServicio.descripcion,
                    precio: item.customPriceActive ? item.customPrice : item.servicio.preciosUnitarios?.find(pU => pU.plan.id === item.planServicio.id)?.precio || 0,
                    descuento: item.montoDescuento || 0,
                    tipoDescuento: item.tipoDescuento,
                    cantidad: item.numeroItems
                }]
            });
        }
        return acc;
    }, []);

    const hasWebService = serviciosList.some(s => s.servicio.categoria === "Web");

    const pdf = (
        <>
            {
            <Document title={`${cotizacionData?.cliente?.razonSocial || cotizacionData?.lead?.leadName} - ${brandName} `}>
                <Page style={{ fontSize: 12 }} size={[842, calculatePageHeight()]}>

                    {/* Header */}
                    <View style={{ display: "flex", flexDirection: "row", width: "100%", height: "108px", backgroundColor: mainOrange }}> 
                        <View style={{ marginTop: "35px", marginLeft: "50px", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "start", width: "460px" }}>
                            <Image src={LogoMcWhite} style={{ width: "65px", marginRight: "15px" }}/>
                            <View style={{ display: "flex", flexDirection: "col", height: "60px", marginBottom: "10px" }}>
                                <Text style={{ color: "white", fontFamily: "Poppins", fontWeight: "bold", fontSize: "32px" }}>
                                    {cotizacionData?.tipo === "Factura" ? cotizacionData?.tipo : "Cotización"}
                                </Text>
                                
                                <Text style={{ color: lightOrange, fontFamily: "Poppins", fontWeight: "bold", fontSize: "12px" }}>
                                    MONSTRUO CREATIVO S.A.C
                                </Text>
                            </View>
                        </View>

                        <Image src={LogoMcCuttedWhite} style={{opacity: "0.15", height: "85px"}}/>
                    </View>

                    {/* InfoBar */}
                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%", backgroundColor: lightGray, height: "40px", paddingHorizontal: "48px", paddingVertical: "8px" }}>

                        <View style={infoBar.infoBarItem}>
                            <Text style={infoBar.infoBarTitle}>
                                Fecha:
                            </Text>
                            <View style={infoBar.infoBarDataContainer}>
                                <Text style={infoBar.infoBarData}>
                                    {cotizacionData?.createdAt && formatDateString(cotizacionData?.createdAt)}
                                </Text>
                            </View>
                        </View>

                        <Text style={infoBar.infoBarDivison}>
                            /
                        </Text>

                        <View style={infoBar.infoBarItem}>
                            <Text style={infoBar.infoBarTitle}>
                                Nro de Cotización:
                            </Text>
                            <View style={infoBar.infoBarDataContainer}>
                                <Text style={infoBar.infoBarData}>
                                    {cotizacionData?.numeroCotizacion}
                                </Text>
                            </View>
                        </View>

                        <Text style={infoBar.infoBarDivison}>
                            /
                        </Text>

                        <View style={infoBar.infoBarItem}>
                            <Text style={infoBar.infoBarTitle}>
                                Válido hasta:
                            </Text>
                            <View style={infoBar.infoBarDataContainer}>
                                <Text style={infoBar.infoBarData}>
                                {cotizacionData?.fechaCotizacionLimite && formatDateString(cotizacionData?.fechaCotizacionLimite)}
                                </Text>
                            </View>
                        </View>

                    </View>

                    {/* Data empresa y cliente */}
                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", height: "259px", paddingHorizontal: "48px", paddingVertical: "16px" }}>

                        { /* Cointenedor */ }
                        <View style={{ display: "flex", flexDirection: "col", justifyContent: "space-between", marginVertical: "auto"}}>
                            
                            <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", marginTop: "40px" }}>

                                {/* Datos de la empresa */}
                                <View style={{ display: "flex", flexDirection: "column", width: "264px", height: "163px" }}>
                                    <Text style={dataSection.titleDataSection}>
                                        DATOS DE LA EMPRESA
                                    </Text>
                                    <View style={dataSection.itemDataSection}>
                                        <Text style={dataSection.subtitleDataSection}>
                                            Dirección
                                        </Text>
                                        <Text style={dataSection.itemDataDivisor}>
                                            :
                                        </Text>
                                        <Text style={dataSection.contentDataSection}>
                                            Cal. Elías Aguirre Nro 180
                                        </Text>
                                    </View>
                                    <View style={dataSection.itemDataSection}>
                                        <Text style={dataSection.subtitleDataSection}>
                                            Distrito
                                        </Text>
                                        <Text style={dataSection.itemDataDivisor}>
                                            :
                                        </Text>
                                        <Text style={dataSection.contentDataSection}>
                                            Miraflores - Lima
                                        </Text>
                                    </View>
                                    <View style={dataSection.itemDataSection}>
                                        <Text style={dataSection.subtitleDataSection}>
                                            Sitio web
                                        </Text>
                                        <Text style={dataSection.itemDataDivisor}>
                                            :
                                        </Text>
                                        <Text style={dataSection.contentDataSection}>
                                            www.monstruocreativo.com
                                        </Text>
                                    </View>
                                    <View style={dataSection.itemDataSection}>
                                        <Text style={dataSection.subtitleDataSection}>
                                            Correo
                                        </Text>
                                        <Text style={dataSection.itemDataDivisor}>
                                            :
                                        </Text>
                                        <Text style={dataSection.contentDataSection}>
                                            ventas@monstruocreativo.com
                                        </Text>
                                    </View>
                                    <View style={dataSection.itemDataSection}>
                                        <Text style={dataSection.subtitleDataSection}>
                                            Asesor(a)
                                        </Text>
                                        <Text style={dataSection.itemDataDivisor}>
                                            :
                                        </Text>
                                        <Text style={dataSection.contentDataSection}>
                                            {cotizacionData?.cotizador?.name}
                                        </Text>
                                    </View>
                                    <View style={dataSection.itemDataSection}>
                                        <Text style={dataSection.subtitleDataSection}>
                                            Teléfono
                                        </Text>
                                        <Text style={dataSection.itemDataDivisor}>
                                            :
                                        </Text>
                                        <Text style={dataSection.contentDataSection}>
                                            {
                                                (() => {
                                                    const phoneNumbers = {
                                                        "Astryd": "+51 984 619 652",
                                                        "Cinthya Melissa": "+51 967 000 607",
                                                        "ventas 1": "+51 992 539 898"
                                                    };
                                                    return phoneNumbers[cotizacionData?.cotizador?.name] || "+51 984 619 652";
                                                })()
                                            }
                                        </Text>
                                    </View>
                                </View>
                                
                                {/* Datos del cliente */}
                                <View style={{ display: "flex", flexDirection: "column", width: "264px", height: "163px" }}>
                                    <Text style={dataSection.titleDataSection}>
                                        DATOS DEl CLIENTE
                                    </Text>
                                    <View style={dataSection.itemDataSection}>
                                        <Text style={dataSection.subtitleDataSection}>
                                            {cotizacionData?.tipo !== "Cotizacion" ? "Razón Social" : "Cliente"}
                                        </Text>
                                        <Text style={dataSection.itemDataDivisor}>
                                            :
                                        </Text>
                                        <Text style={dataSection.contentDataSection}>
                                            {`${cotizacionData?.tipo !== "Cotizacion" ? (cotizacionData?.cliente?.nombreComercial?.length ? cotizacionData?.cliente?.nombreComercial.substring(0, 25) + (cotizacionData?.cliente?.nombreComercial?.length > 25 ? "..." : "") : "") : (cotizacionData?.leadNombre?.length ? cotizacionData?.leadNombre.substring(0, 25) + (cotizacionData?.leadNombre.length > 25 ? '...' : '') : '')}`}
                                        </Text>
                                    </View>

                                    <View style={dataSection.itemDataSection}>
                                        <Text style={dataSection.subtitleDataSection}>
                                            RUC
                                        </Text>
                                        <Text style={dataSection.itemDataDivisor}>
                                            :
                                        </Text>
                                        <Text style={dataSection.contentDataSection}>
                                            {cotizacionData?.tipo === "Cotizacion" ? cotizacionData?.leadRUC : cotizacionData?.cliente?.ruc}
                                        </Text>
                                    </View>

                                    <View style={dataSection.itemDataSection}>
                                        <Text style={dataSection.subtitleDataSection}>
                                            Dirección 
                                        </Text>
                                        <Text style={dataSection.itemDataDivisor}>
                                            :
                                        </Text>
                                        <Text style={dataSection.contentDataSection}>
                                            {cotizacionData?.cliente?.direccion}
                                        </Text>
                                    </View>
                                    <View style={dataSection.itemDataSection}>
                                        <Text style={dataSection.subtitleDataSection}>
                                            Distrito: 
                                        </Text>
                                        <Text style={dataSection.itemDataDivisor}>
                                            :
                                        </Text>
                                        <Text style={dataSection.contentDataSection}>
                                            {cotizacionData?.cliente?.distrito}
                                        </Text>
                                    </View>
                                    <View style={dataSection.itemDataSection}>
                                        <Text style={dataSection.subtitleDataSection}>
                                            Teléfono
                                        </Text>
                                        <Text style={dataSection.itemDataDivisor}>
                                            :
                                        </Text>
                                        <Text style={dataSection.contentDataSection}>
                                            {cotizacionData?.cliente?.telefono}
                                        </Text>
                                    </View>
                                    <View style={dataSection.itemDataSection}>
                                        <Text style={dataSection.subtitleDataSection}>
                                            Encargado
                                        </Text>
                                        <Text style={dataSection.itemDataDivisor}>
                                            :
                                        </Text>
                                        <Text style={dataSection.contentDataSection}>
                                            {cotizacionData?.cliente?.encargadoProyecto}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            { /* Buenas tardes */}
                            <View style={{ display: "flex", alignItems: "center", flexDirection: "row", marginTop: "12px" }}>
                                <Text style={{ color: darkBlue, fontWeight: "normal", fontSize: "20px", fontFamily: "Poppins" }}>
                                {`Buenas tardes${cotizacionData?.tipo !== "Cotizacion" ? ", " + (cotizacionData?.cliente?.nombreComercial?.length ? cotizacionData?.cliente?.nombreComercial.substring(0, 25) + (cotizacionData?.cliente?.nombreComercial?.length > 25 ? "..." : "") : "") : ", " + (cotizacionData?.leadNombre?.length ? cotizacionData?.leadNombre.substring(0, 25) + (cotizacionData?.leadNombre.length > 25 ? '...' : '') : '')}`}
                                </Text>
                                <Image src={salutHand} style={{ height: "24px", width: "24px", marginLeft: "8px", marginBottom: "10px"}} />
                            </View>

                        </View>

                        {/* Cuentas bancarias */}
                        <View style={{ display: "flex", flexDirection: "column", borderColor: mainOrange, borderWidth: "2", borderRadius: "8", width: "214px", height: "227px", paddingVertical: "16px", paddingHorizontal: "12px" }}>
                            <Text style={{ fontFamily: "Poppins", fontWeight: "normal", color: darkBlue, fontSize: "14px", marginBottom: "8px" }}>
                                N° CUENTAS BANCARIAS
                            </Text>

                            <View style={dataSection.bankAccountsContainer}>
                                <Text style={dataSection.bankAccountsTitle}>
                                    Cuenta Interbank dólares :
                                </Text>
                                <Text style={dataSection.bankAccountsData}>
                                    {/* 200-3004305598 */}
                                    200-3007424490

                                </Text>
                            </View>

                            <View style={dataSection.bankAccountsContainer}>
                                <Text style={dataSection.bankAccountsTitle}>
                                    Cuenta Interbank interbancaria dólares :
                                </Text>
                                <Text style={dataSection.bankAccountsData}>
                                    {/* 003-200-003004305598-34 */}
                                    003-200-003007424490-33
                                </Text>
                            </View>

                            <View style={dataSection.bankAccountsContainer}>
                                <Text style={dataSection.bankAccountsTitle}>
                                    Cuenta Interbank soles :
                                </Text>
                                <Text style={dataSection.bankAccountsData}>
                                    200-3004305580
                                </Text>
                            </View>

                            <View style={dataSection.bankAccountsContainer}>
                                <Text style={dataSection.bankAccountsTitle}>
                                    Cuenta Interbank interbancaria soles:
                                </Text>
                                <Text style={dataSection.bankAccountsData}>
                                    003-200-003004305580-32
                                </Text>
                            </View>

                        </View>
                        
                    </View>

                    {/* Sección de tablas servicios y pagos */}
                    <View style={{ display: "flex", flexDirection: "column", paddingHorizontal: "48px", paddingVertical: "16px"}}>
                        
                        { /* Tabla servicios */}
                        <View style={{ display: "flex", flexDirection: "col", marginBottom: "16px"}}>

                            { /* Table head */}
                            <View style={{ display: "flex", flexDirection: "row"}}>

                                <View style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "124px", height: "32px", backgroundColor: secondaryOrange, borderColor: lightOrange, borderWidth: 0.4}}>
                                    <Text style={recurrentStyles.generalTitleHeadRow}>
                                        Servicio
                                    </Text>
                                </View>

                                <View style={serviceTable.tableHeadContainer56}>
                                    <Text style={recurrentStyles.generalTitleHeadRow}>
                                        Plan
                                    </Text>
                                </View>

                                <View style={serviceTable.tableHeadContainer85}>
                                    <Text style={recurrentStyles.generalTitleHeadRow}>
                                        Fecha inicio
                                    </Text>
                                </View>

                                <View style={serviceTable.tableHeadContainer85}>
                                    <Text style={recurrentStyles.generalTitleHeadRow}>
                                        Fecha fin
                                    </Text>
                                </View>

                                <View style={serviceTable.tableHeadContainer85}>
                                    <Text style={recurrentStyles.generalTitleHeadRow}>
                                        Precio{"\n"}unitario
                                    </Text>
                                </View>

                                <View style={{  display: "flex", alignItems: "center", justifyContent: "center", width: "85px", height: "32px", backgroundColor: darkBlue, borderColor: lightOrange, borderWidth: 0.4}}>
                                    <Text style={recurrentStyles.generalTitleHeadRow}>
                                        Descuento {"\n"}unitario
                                    </Text>
                                </View>


                                <View style={serviceTable.tableHeadContainer85}>
                                    <Text style={recurrentStyles.generalTitleHeadRow}>
                                        Monto{"\n"}final x unid.
                                    </Text>
                                </View>

                                <View style={serviceTable.tableHeadContainer56}>
                                    <Text style={recurrentStyles.generalTitleHeadRow}>
                                        Cant.
                                    </Text>
                                </View>


                                <View style={serviceTable.tableHeadContainer56}>
                                    <Text style={recurrentStyles.generalTitleHeadRow}>
                                        IGV
                                    </Text>
                                </View>

                                <View style={serviceTable.tableHeadContainer85}>
                                    <Text style={recurrentStyles.generalTitleHeadRow}>
                                        Total
                                    </Text>
                                </View>

                            </View>

                            { /* Rows */ }
                            <View style={{ display: "flex", flexDirection: "column"}}>

                                { /* Servicio row */}
                                {serviciosList.map((e, index) => {
                                    const numeroItems = incognitMode ? "1" : e.numeroItems
                                    return (
                                        <View key={index} style={{ display: "flex", flexDirection: "row", backgroundColor: index % 2 === 0 ? "white" : lightGray }}> 
                                            
                                            {/* Servicio */}
                                            <View style={{display: "flex", alignItems: "center", justifyContent: "center", width: "124px", height: "56px", borderWidth: 0.4, borderColor: mediumGray, backgroundColor: "white"}}>
                                                <Text style={{fontFamily: "Poppins", fontWeight: "bold", fontSize: "10px", color: darkBlue, textAlign: "center" }}>
                                                    {e.servicio.name}
                                                </Text>
                                            </View>

                                            {/* Plan */}
                                            <View style={serviceTable.tableDataContainer56}>
                                                <Text style={serviceTable.tableDataText}>
                                                    {e?.planServicio?.name}
                                                </Text>
                                            </View>

                                            {/* Fecha inicio */}
                                            <View style={serviceTable.tableDataContainer85}>
                                                <Text style={serviceTable.tableDataText}>
                                                    {e.fechaInicio && formatDateString(e?.fechaInicio)}
                                                </Text>
                                            </View>

                                            {/* Fecha fin */}
                                            <View style={serviceTable.tableDataContainer85}>
                                                <Text style={serviceTable.tableDataText}>
                                                    {e.fechaFin && formatDateString(e?.fechaFin)}
                                                </Text>
                                            </View>

                                            {/* Precio unitario */}
                                            <View style={serviceTable.tableDataContainer85}>
                                                <Text style={serviceTable.tableDataText}>
                                                    {moneda + " "}
                                                    {(() => {
                                                        // Obtener el precio base
                                                        const precioBase = e?.customPriceActive
                                                            ? e.customPrice
                                                            : e.servicio?.preciosUnitarios?.find(
                                                                (pU) => pU.plan.id === e.planServicio.id
                                                            )?.precio || 0;

                                                        // Calcular el precio según el país solo si no es customPrice
                                                        const precioConPais = e?.customPriceActive
                                                            ? precioBase
                                                            : CalcularPrecioPais({
                                                                precio: precioBase,
                                                                multiplicador: ObtenerMultiplicador({
                                                                    pais: cotizacionData?.cliente?.pais || cotizacionData?.lead?.country,
                                                                    paises: paises
                                                                })
                                                            });
                                                            
                                                        // Convertir a la moneda objetivo
                                                        return (precioConPais / tipoCambio).toLocaleString("en-US", {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2
                                                        });
                                                    })()}
                                                </Text>
                                            </View>

                                            {/* Descuento unitario */}
                                            <View style={serviceTable.tableDataContainer85}>
                                                <Text style={serviceTable.tableDataText}>
                                                    {e?.tipoDescuento === "Porcentaje"
                                                        ? (!isNaN(Number(e?.montoDescuento)) 
                                                            ? `${Number(e.montoDescuento)} %` 
                                                            : "-") 
                                                        : (moneda && !isNaN(Number(e?.montoDescuento)) 
                                                            ? `${moneda} ${(() => {
                                                                // Calcular el descuento según el país
                                                                return (e.montoDescuento / tipoCambio).toLocaleString("en-US", {
                                                                    minimumFractionDigits: 2,
                                                                    maximumFractionDigits: 2
                                                                });
                                                            })()}` 
                                                            : "-")
                                                    }                                            
                                                </Text>
                                            </View>

                                            {/* Monto final x unid. */}
                                            <View style={serviceTable.tableDataContainer85}>
                                                <Text style={serviceTable.tableDataText}>
                                                    {moneda + " "}
                                                    {(() => {
                                                        // Obtener el precio base
                                                        const precioBase = e?.customPriceActive
                                                            ? e.customPrice
                                                            : e.servicio?.preciosUnitarios?.find(
                                                                (pU) => pU.plan.id === e.planServicio.id
                                                            )?.precio || 0;

                                                        // Calcular el precio según el país solo si no es customPrice
                                                        const precioConPais = e?.customPriceActive
                                                            ? precioBase
                                                            : CalcularPrecioPais({
                                                                precio: precioBase,
                                                                multiplicador: ObtenerMultiplicador({
                                                                    pais: cotizacionData?.cliente?.pais || cotizacionData?.lead?.country,
                                                                    paises: paises
                                                                })
                                                            });

                                                        // Aplicar descuento si existe
                                                        let precioFinal = precioConPais;
                                                        if (e.tipoDescuento === "Porcentaje") {
                                                            precioFinal -= precioConPais * (e.montoDescuento / 100);
                                                        } else if (e.tipoDescuento === "Fijo") {
                                                            precioFinal -= e.montoDescuento;
                                                        }

                                                        // Convertir a la moneda objetivo
                                                        return (precioFinal / tipoCambio).toLocaleString("en-US", {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2
                                                        });
                                                    })()}
                                                </Text>
                                            </View>

                                            {/* Cant. */}
                                            <View style={serviceTable.tableDataContainer56}>
                                                <Text style={serviceTable.tableDataText}>
                                                    {numeroItems}
                                                </Text>
                                            </View>

                                            {/* IGV */}
                                            <View style={serviceTable.tableDataContainer56}>
                                                <Text style={serviceTable.tableDataText}>
                                                    {e?.igv !== "no" ? e?.igv : "-"} 
                                                </Text>
                                            </View>

                                            {/* Total */}
                                            <View style={serviceTable.tableDataContainer85}>
                                                <Text style={serviceTable.tableDataText}>
                                                    {moneda + " "}
                                                    {(() => {
                                                        // Obtener el precio base
                                                        const precioBase = e?.customPriceActive
                                                            ? e.customPrice * e.numeroItems
                                                            : e.servicio?.preciosUnitarios?.find(
                                                                (pU) => pU.plan.id === e.planServicio.id
                                                            )?.precio * e.numeroItems || 0;

                                                        // Calcular el precio según el país solo si no es customPrice
                                                        const precioConPais = e?.customPriceActive
                                                            ? precioBase
                                                            : CalcularPrecioPais({
                                                                precio: precioBase,
                                                                multiplicador: ObtenerMultiplicador({
                                                                    pais: cotizacionData?.cliente?.pais || cotizacionData?.lead?.country,
                                                                    paises: paises
                                                                })
                                                            });

                                                        // Aplicar descuento si existe
                                                        let precioFinal = precioConPais;
                                                        if (e.tipoDescuento === "Porcentaje") {
                                                            precioFinal -= precioConPais * (e.montoDescuento / 100);
                                                        } else if (e.tipoDescuento === "Fijo") {
                                                            precioFinal -= e.montoDescuento * e.numeroItems;
                                                        }

                                                        // Convertir a la moneda objetivo
                                                        return (precioFinal / tipoCambio).toLocaleString("en-US", {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2
                                                        });
                                                    })()}
                                                </Text>
                                            </View>

                                        </View>
                                    )
                                })}

                            </View>

                        </View>
                                
                        { /* Texto webs */ }
                        {hasWebService && (
                            <View style={{ display: "flex", flexDirection: "column", paddingVertical: "16px", marginBottom: "16px"}}>
                                <Text style={{ fontFamily: "Poppins", fontSize: "10px", fontWeight: "light", color: darkBlue}}>
                                    <Text style={{ fontWeight: "bold"}}>*Para servicios webs: </Text>El cliente se compromete a entregar toda la información y materiales necesarios dentro de los tres (3) días posteriores al primer pago (50%).
                                    Si no lo hace y esto retrasa el proyecto, el segundo pago deberá efectuarse igual en la fecha pactada. Si la demora es responsabilidad de la agencia, el segundo pago se realizará al momento de la entrega del sitio web.
                                </Text>
                            </View>
                        )}
                        
                        { /* Tablas condiciones de pago y cuenta total */}
                        {!incognitMode && (
                            <View style={{ display: "flex", flexDirection: "row"}}>

                                <View style={{ width: "504px", marginRight: "16px"}}>

                                    { /* Condiciones de pago */ }
                                    <Text style={recurrentStyles.generalSubtitle}>
                                        Condiciones de pago
                                    </Text>

                                    { /* Tabla pagos */ }
                                    <View style={{ display: "flex", flexDirection: "col"}}>

                                        { /* Table Head */ }
                                        <View style={{ display: "flex", flexDirection: "row"}}>

                                            <View style={paymentTable.paymentTableheadContainer}>
                                                <Text style={recurrentStyles.generalTitleHeadRow}>
                                                    Descripción
                                                </Text>
                                            </View>

                                            <View style={paymentTable.paymentTableheadContainer}>
                                                <Text style={recurrentStyles.generalTitleHeadRow}>
                                                    Monto a pagar
                                                </Text>
                                            </View>

                                            <View style={paymentTable.paymentTableheadContainer}>
                                                <Text style={recurrentStyles.generalTitleHeadRow}>
                                                    Fecha límite
                                                </Text>
                                            </View>

                                        </View>

                                        { /* Rows */ }
                                        <View style={{ display: "flex", flexDirection: "column"}}>
                                            {pagosList.map((e, index) => (
                                                <View style={{ display: "flex", flexDirection: "row", backgroundColor: index % 2 === 0 ? "white" : lightGray }}> 
                                                    
                                                    {/* Descripción */}
                                                    <View style={paymentTable.paymentTableDataContainer}>
                                                        <Text style={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "normal", fontSize: "10px", color: darkBlue}}>
                                                            {e?.descripcion}
                                                        </Text>
                                                    </View>

                                                    {/* Monto a pagar */}
                                                    <View style={paymentTable.paymentTableDataContainer}>
                                                        <Text style={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "normal", fontSize: "10px", color: darkBlue}}>
                                                            {moneda} {(e.precio / tipoCambio).toLocaleString("en-US", {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2
                                                            })}
                                                        </Text>
                                                    </View>

                                                    {/* Fecha límite */}
                                                    <View style={paymentTable.paymentTableDataContainer}>
                                                        <Text style={{ textAlign: "center", fontFamily: "Poppins", fontWeight: "bold", fontSize: "10px", color: darkBlue}}>
                                                            {e.fechaLimite && formatDateString(e?.fechaLimite)}
                                                        </Text>
                                                    </View>
                                                </View>
                                            ))}
                                        </View>

                                    </View>

                                </View>

                                <View style={{ width: "226px"}}>

                                    { /* Cuenta total */ }
                                    <Text style={recurrentStyles.generalSubtitle}>
                                        Cuenta total
                                    </Text>

                                    { /* Tabla total */ }
                                    <View style={{ display: "flex", flexDirection: "col" }}>
                                            
                                        {/* Subtotal */}
                                        <View style={{ display: "flex", flexDirection: "row"}}>

                                            <View style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "32px", width: "141px", backgroundColor: lightGray, borderWidth: 0.4, borderColor: mediumGray}}>
                                                <Text style={{ fontFamily: "Poppins", fontSize: "10px", fontWeight: "light", color: darkBlue}}>
                                                    Subtotal sin descuento
                                                </Text>
                                            </View>
                                            
                                            {/* Version antigua ↓ */}
                                            {/* <View style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "32px", width: "85px", borderWidth: 0.4, borderColor: mediumGray}}>
                                                <Text style={{ fontFamily: "Poppins", fontSize: "10px", fontWeight: "bold", color: darkBlue}}>
                                                    {moneda + " "}
                                                    {serviciosList
                                                        .reduce((acc, value) => {
                                                            const precio =
                                                            value.customPriceActive
                                                                ? value.customPrice * value.numeroItems
                                                                : value.servicio.preciosUnitarios?.find(
                                                                    (pU) => pU.plan.id === value.planServicio.id
                                                                )?.precio * value.numeroItems || 0;
                                                            return acc + precio;
                                                        }, 0).toLocaleString("en-US", {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2
                                                        })
                                                    }
                                                </Text>
                                            </View> */}

                                            <View style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "32px", width: "85px", borderWidth: 0.4, borderColor: mediumGray}}>
                                                <Text style={{ fontFamily: "Poppins", fontSize: "10px", fontWeight: "bold", color: darkBlue}}>
                                                    {moneda + " "}
                                                    {serviciosList
                                                        .reduce((acc, servicio) => {
                                                            // Calcular precio unitario del servicio
                                                            let precioUnitario = 0;
                                                            
                                                            if (servicio.customPriceActive) {
                                                                // Si tiene precio personalizado, usar ese
                                                                precioUnitario = servicio.customPrice;
                                                            } else {
                                                                // Si no, buscar en precios unitarios del plan
                                                                const precioPlan = servicio.servicio.preciosUnitarios?.find(
                                                                    (pU) => pU.plan.id === servicio.planServicio.id
                                                                );
                                                                precioUnitario = precioPlan?.precio || 0;
                                                            }
                                                            
                                                            // Calcular precio total del servicio (precio unitario * cantidad)
                                                            const precioTotal = precioUnitario * servicio.numeroItems;
                                                            
                                                            // Aplicar multiplicador según el país
                                                            const precioConPais = servicio.customPriceActive
                                                            ? precioTotal
                                                            : CalcularPrecioPais({
                                                                precio: precioTotal,
                                                                multiplicador: ObtenerMultiplicador({
                                                                    pais: cotizacionData?.cliente?.pais || cotizacionData?.lead?.country,
                                                                    paises: paises
                                                                })
                                                            });
                                                            
                                                            return acc + precioConPais / tipoCambio;
                                                        }, 0)
                                                        .toLocaleString("en-US", {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2
                                                        })
                                                    }
                                                </Text>
                                            </View>

                                        </View>
                                        
                                        {/* Descuento */}
                                        <View style={{ display: "flex", flexDirection: "row"}}>

                                            <View style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "32px", width: "141px", backgroundColor: lightGray, borderWidth: 0.4, borderColor: mediumGray}}>
                                                <Text style={{ fontFamily: "Poppins", fontSize: "10px", fontWeight: "light", color: darkBlue}}>
                                                    Descuento (?)
                                                </Text>
                                            </View>

                                            <View
                                                style={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    height: "32px",
                                                    width: "85px",
                                                    borderWidth: 0.4,
                                                    borderColor: mediumGray,
                                                }}
                                                >
                                                {/* Error decuento, arreglar porcentaje */ }
                                                <Text
                                                    style={{
                                                    fontFamily: "Poppins",
                                                    fontSize: "10px",
                                                    fontWeight: "bold",
                                                    color: darkBlue,
                                                    }}
                                                >
                                                    {/* Version antigua ↓ */}
                                                    {moneda + " "} 
                                                    {/* {descuentoTotal.toLocaleString("en-US", {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    })} */}
                                                    {(() => {
                                                        return (descuentoTotal / tipoCambio).toLocaleString("en-US", {
                                                            minimumFractionDigits: 2,
                                                            maximumFractionDigits: 2
                                                        });
                                                    })()}
                                                </Text>
                                            </View>


                                        </View>

                                        {/* Total sin IGV */}
                                        <View style={{ display: "flex", flexDirection: "row"}}>

                                            <View style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "32px", width: "141px", backgroundColor: lightGray, borderWidth: 0.4, borderColor: mediumGray}}>
                                                <Text style={{ fontFamily: "Poppins", fontSize: "10px", fontWeight: "light", color: darkBlue}}>
                                                    {"Total sin IGV"}
                                                </Text>
                                            </View>

                                            <View style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "32px", width: "85px", borderWidth: 0.4, borderColor: mediumGray}}>
                                                <Text style={{ fontFamily: "Poppins", fontSize: "10px", fontWeight: "light", color: darkBlue}}>
                                                    {/* Version antigua ↓ */}
                                                    {/* {moneda + " "} {totalSinDescuento.toLocaleString("en-US", {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    })} */}
                                                    {moneda + " "}
                                                    {(() => {
                                                        return (serviciosList.reduce((acc, servicio) => {
                                                              // Calcular precio unitario del servicio
                                                              let precioUnitario = 0;
                                                              
                                                              if (servicio.customPriceActive) {
                                                                  // Si tiene precio personalizado, usar ese
                                                                  precioUnitario = servicio.customPrice;
                                                              } else {
                                                                  // Si no, buscar en precios unitarios del plan
                                                                  const precioPlan = servicio.servicio.preciosUnitarios?.find(
                                                                      (pU) => pU.plan.id === servicio.planServicio.id
                                                                  );
                                                                  precioUnitario = precioPlan?.precio || 0;
                                                              }
                                                              
                                                              // Calcular precio total del servicio (precio unitario * cantidad)
                                                              const precioTotal = precioUnitario * servicio.numeroItems;
                                                              
                                                              // Aplicar multiplicador según el país
                                                              const precioConPais = servicio.customPriceActive
                                                              ? precioTotal
                                                              : CalcularPrecioPais({
                                                                  precio: precioTotal,
                                                                  multiplicador: ObtenerMultiplicador({
                                                                      pais: cotizacionData?.cliente?.pais || cotizacionData?.lead?.country,
                                                                      paises: paises
                                                                  })
                                                              });
                                                              
                                                              return acc + precioConPais / tipoCambio;
                                                          }, 0) - descuentoTotal / tipoCambio).toLocaleString("en-US", {
                                                              minimumFractionDigits: 2,
                                                              maximumFractionDigits: 2
                                                          });
                                                    })()}
                                                </Text>
                                            </View>

                                        </View>

                                        {/* Monto IGV */}
                                        <View style={{ display: "flex", flexDirection: "row"}}>

                                            <View style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "32px", width: "141px", backgroundColor: lightGray, borderWidth: 0.4, borderColor: mediumGray}}>
                                                <Text style={{ fontFamily: "Poppins", fontSize: "10px", fontWeight: "light", color: darkBlue}}>
                                                    {igv ? "Si": "Monto IGV"}
                                                </Text>
                                            </View>

                                            <View style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "32px", width: "85px", borderWidth: 0.4, borderColor: mediumGray}}>
                                                <Text style={{ fontFamily: "Poppins", fontSize: "10px", fontWeight: "light", color: darkBlue}}>
                                                    {igv ? "Sí " : `${moneda} ` + igvTotal.toLocaleString("en-US", {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    })}
                                                </Text>
                                            </View>

                                        </View>
                                        
                                        {/* Total tabla precios */}
                                        <View style={{ display: "flex", flexDirection: "row"}}>

                                            <View style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "32px", width: "141px", backgroundColor: darkBlue, borderWidth: 0.4, borderColor: lightOrange}}>
                                                <Text style={{ fontFamily: "Poppins", fontSize: "10px", fontWeight: "bold", color: "white"}}>
                                                    Total
                                                </Text>
                                            </View>

                                            <View style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "32px", width: "85px", backgroundColor: darkBlue, borderWidth: 0.4, borderColor: lightOrange}}>
                                                <Text style={{ fontFamily: "Poppins", fontSize: "10px", fontWeight: "bold", color: "white"}}>
                                                    {/* Version antigua ↓ */}
                                                    {/* {moneda} {(totalSinDescuento + igvTotal).toLocaleString("en-US", {
                                                        minimumFractionDigits: 2,
                                                        maximumFractionDigits: 2
                                                    })} */}
                                                    {moneda + " "}
                                                    {(() => {
                                                        return (serviciosList.reduce((acc, servicio) => {
                                                              // Calcular precio unitario del servicio
                                                              let precioUnitario = 0;
                                                              
                                                              if (servicio.customPriceActive) {
                                                                  // Si tiene precio personalizado, usar ese
                                                                  precioUnitario = servicio.customPrice;
                                                              } else {
                                                                  // Si no, buscar en precios unitarios del plan
                                                                  const precioPlan = servicio.servicio.preciosUnitarios?.find(
                                                                      (pU) => pU.plan.id === servicio.planServicio.id
                                                                  );
                                                                  precioUnitario = precioPlan?.precio || 0;
                                                              }
                                                              
                                                              // Calcular precio total del servicio (precio unitario * cantidad)
                                                              const precioTotal = precioUnitario * servicio.numeroItems;
                                                              
                                                              // Aplicar multiplicador según el país
                                                              const precioConPais = servicio.customPriceActive
                                                              ? precioTotal
                                                              : CalcularPrecioPais({
                                                                  precio: precioTotal,
                                                                  multiplicador: ObtenerMultiplicador({
                                                                      pais: cotizacionData?.cliente?.pais || cotizacionData?.lead?.country,
                                                                      paises: paises
                                                                  })
                                                              });
                                                              
                                                              return acc + precioConPais / tipoCambio;
                                                          }, 0) - descuentoTotal / tipoCambio + Number(igvTotal) / tipoCambio).toLocaleString("en-US", {
                                                              minimumFractionDigits: 2,
                                                              maximumFractionDigits: 2
                                                          });
                                                    })()}
                                                </Text>
                                            </View>

                                        </View>

                                    </View>

                                </View>

                            </View>
                        )}

                    </View>

                    {/* Sección términos de pago */}
                    <View style={{ display: "flex", flexDirection: "column", paddingHorizontal: "48px", paddingVertical: "16px", height: "209px"}}>
                        
                        <Text style={recurrentStyles.generalSubtitle}>
                            Términos de pago
                        </Text>

                        { /* Términos de pago contenedores */}
                        <View style={{ display: "flex", flexDirection: "row", marginBottom: "16px"}}>

                            <View style={{ display: "flex", flexDirection: "column", width: "504px", marginRight: "16px", borderRadius: "8px", paddingHorizontal: "16px", paddingVertical: "24px", backgroundColor: lightGray, borderWidth: 0.4, borderColor: mediumGray }}>

                                <Text style={{ fontFamily: "Poppins", fontSize: "10px", fontWeight: "light", color: darkBlue, marginBottom: "5px" }}>
                                    1.  El cliente 
                                    <Text style={{ fontWeight: "bold" }}> realizará el pago en las fechas consignadas </Text>
                                    en esta cotización
                                </Text>

                                <Text style={{ fontFamily: "Poppins", fontSize: "10px", fontWeight: "light", color: darkBlue, marginBottom: "5px" }}>
                                    2. El cliente 
                                    <Text style={{ fontWeight: "bold" }}> enviará la cotización firmada </Text> 
                                    al correo ventas@monstruocreativo.com.
                                </Text>

                                <Text style={{ fontFamily: "Poppins", fontSize: "10px", fontWeight: "light", color: darkBlue }}>
                                    3. El cliente al firmar esta cotización acepta las Políticas de: 
                                    <Text style={{ fontWeight: "bold" }}> pagos, servicio, privacidad, </Text>
                                </Text>

                                <Text style={{ fontFamily: "Poppins", fontSize: "10px", fontWeight: "bold", color: darkBlue, marginLeft: "12px" }}>
                                    términos y condiciones.
                                </Text>

                            </View>

                            <View style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", width: "226px", borderRadius: "8px", paddingHorizontal: "16px", paddingTop: "16px", paddingBottom: "8px", borderWidth: 0.4, borderColor: mainOrange }}>
                                
                                <Text style={{ fontFamily: "Poppins", fontSize: "10px", fontWeight: "light", color: darkBlue, marginBottom: "auto" }}>
                                    El cliente acepta firmar: 
                                </Text>
                                                
                                <Text style={{ display: "flex", justifyContent: "center", textAlign: "center", fontFamily: "Poppins", fontSize: "10px", fontWeight: "bold", color: darkBlue, paddingTop: "10px", width: "194px", borderTopColor: mainGray, borderTopWidth: 0.4 }}>
                                    Nombre del cliente
                                </Text>
                            </View>

                        </View>
                        
                        { /* Términos de pago ítems*/}
                        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>

                            <View style={paymentTerms.paymentTermItemContainer}>

                                <Text style={paymentTerms.paymentTermTitle}>
                                    Política de pago
                                </Text>

                                <Text style={paymentTerms.paymentTermItemDivisor}>
                                    :
                                </Text>

                                <Link src="https://monstruocreativo.com/politica-de-pagos">
                                    <Text style={paymentTerms.paymentTermLink}>
                                        Ver   
                                    </Text>
                                </Link>

                            </View>

                            <View style={paymentTerms.paymentTermItemContainer}>

                                <Text style={paymentTerms.paymentTermTitle}>
                                    Política de servicio
                                </Text>

                                <Text style={paymentTerms.paymentTermItemDivisor}>
                                    :
                                </Text>

                                <Link src="https://monstruocreativo.com/politica-de-servicios">
                                    <Text style={paymentTerms.paymentTermLink}>
                                        Ver   
                                    </Text>
                                </Link>

                            </View>

                            <View style={paymentTerms.paymentTermItemContainer}>

                                <Text style={paymentTerms.paymentTermTitle}>
                                    Política de privacidad
                                </Text>

                                <Text style={paymentTerms.paymentTermItemDivisor}>
                                    :
                                </Text>

                                <Link src="https://monstruocreativo.com/politica-de-privacidad">
                                    <Text style={paymentTerms.paymentTermLink}>
                                        Ver   
                                    </Text>
                                </Link>

                            </View>

                            <View style={paymentTerms.paymentTermItemContainer}>

                                <Text style={paymentTerms.paymentTermTitle}>
                                    Términos y condiciones
                                </Text>

                                <Text style={paymentTerms.paymentTermItemDivisor}>
                                    :
                                </Text>

                                <Link src="https://monstruocreativo.com/terminos-y-condiciones">
                                    <Text style={paymentTerms.paymentTermLink}>
                                        Ver   
                                    </Text>
                                </Link>

                            </View>

                        </View>

                    </View>

                    {/* Sección servicios */}
                    <View style={{ display: "flex", flexDirection: "column", paddingHorizontal: "48px", paddingVertical: "16px"}}>

                        {/* Título */}
                        <Text style={{ fontFamily: "Poppins", fontSize: "20px", fontWeight: "normal", color: darkBlue, marginBottom: "16px" }}>
                            Resumen de servicios
                        </Text>

                        {/* Mapeo de servicios */}

                        {comparativo ? (
                            <View>
                                {comparativoServicios.map((servicio, index) => (
                                    <View style={{ display: "flex", flexDirection: "column", marginBottom: "32px" }} key={servicio.servicio.id}>
                                        {/* Título del servicio */}
                                        <Text style={{ fontFamily: "Poppins", fontSize: "20px", fontWeight: "normal", color: darkBlue, marginBottom: "16px" }}>
                                            {servicio.servicio.name}
                                        </Text>

                                        {/* Tabla comparativa */}
                                        <View style={{ display: "flex", flexDirection: "column", borderWidth: 0.4, borderColor: mediumGray }}>
                                            {/* Header de la tabla con los planes */}
                                            <View style={{ display: "flex", flexDirection: "row" }}>
                                                {/* Columna de características */}
                                                <View style={{ width: "273px", display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: secondaryOrange, padding: "16px", borderRightWidth: 0.4, borderColor: lightOrange }}>
                                                    <Text style={{ fontFamily: "Poppins", fontWeight: "bold", fontSize: "14px", color: "white" }}>
                                                        Características
                                                    </Text>
                                                </View>
                                                
                                                {/* Columnas de planes */}
                                                {servicio.planes.map((plan, planIndex) => (
                                                    <View key={plan.plan.id} style={{ 
                                                        flex: 1, 
                                                        backgroundColor: secondaryOrange, 
                                                        padding: "16px",
                                                        borderRightWidth: planIndex < servicio.planes.length - 1 ? 0.4 : 0,
                                                        borderColor: lightOrange,
                                                        alignItems: "center"
                                                    }}>
                                                        <Text style={{ fontFamily: "Poppins", fontWeight: "bold", fontSize: "14px", color: "white", textAlign: "center" }}>
                                                            {plan.plan.name}
                                                        </Text>
                                                        {/* <Text style={{ fontFamily: "Poppins", fontWeight: "bold", fontSize: "12px", color: "white", marginTop: "8px" }}>
                                                            {(cotizacionData?.moneda === "PEN" ? "S/. " : "$") + plan.precio.toLocaleString("en-US", {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2
                                                            })}
                                                        </Text> */}
                                                    </View>
                                                ))}
                                            </View>

                                            {/* Contenido de la tabla */}
                                            {parseDescription(servicio.planes[0].customDescription).map((caracteristica, caracIndex) => (
                                                <View key={caracIndex} style={{ 
                                                    display: "flex", 
                                                    flexDirection: "row",
                                                    backgroundColor: caracIndex % 2 === 0 ? "white" : lightGray
                                                }}>
                                                    {/* Nombre de la característica */}
                                                    <View style={{ 
                                                        width: "273px", 
                                                        padding: "12px", 
                                                        borderRightWidth: 0.4, 
                                                        borderColor: mediumGray
                                                    }}>
                                                        <Text style={{ fontFamily: "Poppins", fontSize: "10px", color: darkBlue }}>
                                                            {caracteristica.key}
                                                        </Text>
                                                    </View>

                                                    {/* Valores para cada plan */}
                                                    {servicio.planes.map((plan, planIndex) => {
                                                        const planCaracteristicas = parseDescription(plan.customDescription);
                                                        const caracteristicaPlan = planCaracteristicas[caracIndex];
                                                        
                                                        return (
                                                            <View key={`${plan.plan.id}-${caracIndex}`} style={{ 
                                                                flex: 1, 
                                                                padding: "12px",
                                                                borderRightWidth: planIndex < servicio.planes.length - 1 ? 0.4 : 0,
                                                                borderColor: mediumGray,
                                                                alignItems: "center"
                                                            }}>
                                                                <Text style={{ 
                                                                    fontFamily: "Poppins", 
                                                                    fontSize: "10px", 
                                                                    color: darkBlue,
                                                                    textAlign: "center"
                                                                }}>
                                                                    {caracteristicaPlan?.value || "-"}
                                                                </Text>
                                                            </View>
                                                        );
                                                    })}
                                                </View>
                                            ))}

                                            {/* Footer con precios y descuentos */}
                                            <View style={{ 
                                                display: "flex", 
                                                flexDirection: "row",
                                                backgroundColor: darkBlue,
                                            }}>
                                                <View style={{ width: "273px", display: "flex", padding: "16px", justifyContent: "center", borderRightWidth: 0.4, borderColor: mainGray }}>
                                                    <Text style={{ fontFamily: "Poppins", fontWeight: "bold", fontSize: "12px", color: "white" }}>
                                                        Resumen
                                                    </Text>
                                                </View>

                                                {servicio.planes.map((plan, planIndex) => {
                                                    const precioFinal = plan.tipoDescuento === "Porcentaje" 
                                                        ? plan.precio - (plan.precio * plan.descuento / 100)
                                                        : plan.precio - plan.descuento;
                                                    
                                                    return (
                                                        <View key={`${plan.plan.id}-footer`} style={{ 
                                                            flex: 1,
                                                            alignItems: "center",
                                                            padding: "16px",
                                                            borderRightWidth: 0.4, 
                                                            borderColor: mainGray
                                                        }}>
                                                            <Text style={{ fontFamily: "Poppins", fontSize: "10px", color: "white", marginBottom: "4px" }}>
                                                                {plan.descuento > 0 
                                                                    ? `Descuento: ${plan.tipoDescuento === "Porcentaje" 
                                                                        ? `${plan.descuento}%` 
                                                                        : `${cotizacionData?.moneda === "PEN" ? "S/. " : "$"}${plan.descuento}`}`
                                                                    : "Sin descuento"}
                                                            </Text>
                                                            <Text style={{ fontFamily: "Poppins", fontWeight: "bold", fontSize: "12px", color: "white" }}>
                                                                Total: {(cotizacionData?.moneda === "PEN" ? "S/. " : "$") + (precioFinal * plan.cantidad).toLocaleString("en-US", {
                                                                    minimumFractionDigits: 2,
                                                                    maximumFractionDigits: 2
                                                                })}
                                                            </Text>
                                                        </View>
                                                    );
                                                })}
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        ) : (
                            serviciosList.map(item => (
                                <View style={{ display: "flex", flexDirection: "column", marginBottom: "16px" }} key={item.id}>
                                    <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", textAlign: "center" }}>
                                        <Text style={recurrentStyles.generalSubtitle}>
                                            {item.servicio.name}
                                        </Text>
                                        <Text style={{ fontFamily: "Poppins", fontSize: "14px", fontWeight: "light", color: mainGray }}>
                                            {item.planServicio.name}
                                        </Text>
                                    </View>
    
                                    <View style={{ display: "flex", flexDirection: "col" }}>
                                        {/* Encabezado de la tabla */}
                                        <View style={{ display: "flex", flexDirection: "row" }}>
                                            <View style={resumeServices.serviceHeadContainer}>
                                                <Text style={resumeServices.serviceHeadText}>
                                                    Descripción del servicio
                                                </Text>
                                            </View>
    
                                            <View style={resumeServices.serviceHeadContainer}>
                                                <Text style={resumeServices.serviceHeadText}>
                                                    Detalles específicos
                                                </Text>
                                            </View>
    
                                            <View style={{ display: "flex", justifyContent: "center", paddingHorizontal: "16px", width: "200px", height: "32px", backgroundColor: darkBlue, borderColor: lightOrange, borderWidth: 0.4 }}>
                                                <Text style={{ fontFamily: "Poppins", fontWeight: "Bold", fontSize: "10px", color: "white" }}>
                                                    Comentarios del vendedor
                                                </Text>
                                            </View>
                                        </View>
    
                                        {/* Cuerpo de la tabla */}
                                        <View style={{ display: "flex", flexDirection: "row" }}>
                                            <View style={{ display: "flex", flexDirection: "col" }}>
                                                {item.customDescriptionActive ? (
                                                    parseDescription(item.customDescriptionText).map((service, index) => (
                                                        <View style={{ display: "flex", flexDirection: "row" }} key={index}>
                                                            <View style={{ display: "flex", justifyContent: "center", width: "273px", paddingVertical: "10px", backgroundColor: index % 2 !== 0 ? lightGray : "white", borderWidth: 0.4, borderColor: mediumGray, paddingHorizontal: "16px" }}>
                                                                <Text style={{ fontFamily: "Poppins", fontWeight: "light", fontSize: "10px", color: darkBlue }}>
                                                                    {service.key}
                                                                </Text>
                                                            </View>
                                                            <View style={{ display: "flex", justifyContent: "center", width: "273px", backgroundColor: index % 2 !== 0 ? lightGray : "white", borderWidth: 0.4, borderColor: mediumGray, paddingHorizontal: "16px" }}>
                                                                <Text style={{ fontFamily: "Poppins", fontWeight: "light", fontSize: "10px", color: darkBlue }}>
                                                                    {service.value}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    ))
                                                ) : (
                                                    parseDescription(item.planServicio.descripcion).map((service, index) => (
                                                        <View style={{ display: "flex", flexDirection: "row" }} key={index}>
                                                            <View style={{ display: "flex", justifyContent: "center", width: "273px", paddingVertical: "10px", backgroundColor: index % 2 !== 0 ? lightGray : "white", borderWidth: 0.4, borderColor: mediumGray, paddingHorizontal: "16px" }}>
                                                                <Text style={{ fontFamily: "Poppins", fontWeight: "light", fontSize: "10px", color: darkBlue }}>
                                                                    {service.key}
                                                                </Text>
                                                            </View>
                                                            <View style={{ display: "flex", justifyContent: "center", width: "273px", backgroundColor: index % 2 !== 0 ? lightGray : "white", borderWidth: 0.4, borderColor: mediumGray, paddingHorizontal: "16px" }}>
                                                                <Text style={{ fontFamily: "Poppins", fontWeight: "light", fontSize: "10px", color: darkBlue }}>
                                                                    {service.value}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    ))
                                                )}
                                            </View>
    
                                            <View style={{ width: "200px", paddingHorizontal: "16px", paddingVertical: "10px", borderWidth: 0.4, borderColor: mediumGray }}>
                                                <Text style={{ fontFamily: "Poppins", fontSize: "10px", fontWeight: "light", color: darkBlue, marginBottom: "16px" }}>
                                                    {item.comentarioVendedor ? item.comentarioVendedor : "No hay comentarios adicionales"}
                                                </Text>
                                                
                                                {/* {!incognitMode && (
                                                    <View style={{ marginTop: "8px" }}>
                                                        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                                        <Text style={{ fontFamily: "Poppins", fontSize: "10px", fontWeight: "light", color: darkBlue }}>
                                                            Precio fijo:
                                                        </Text>
                                                        <Text style={{ fontFamily: "Poppins", fontSize: "10px", fontWeight: "light", color: darkBlue }}>
                                                            {(cotizacionData?.moneda === "PEN" ? "S/. " : "$") + (item?.customPriceActive ? item.customPrice : item.servicio.preciosUnitarios?.find(pU => pU.plan.id === item.planServicio.id)?.precio || 0).toLocaleString("en-US", {
                                                              minimumFractionDigits: 2,
                                                              maximumFractionDigits: 2
                                                            })}
                                                        </Text>
                                                        </View>
                                                        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                                        <Text style={{ fontFamily: "Poppins", fontSize: "10px", fontWeight: "light", color: darkBlue }}>
                                                            Descuento:
                                                        </Text>
                                                        <Text style={{ fontFamily: "Poppins", fontSize: "10px", fontWeight: "light", color: darkBlue }}>
                                                            {item?.tipoDescuento === "Porcentaje" 
                                                            ? (!isNaN(Number(item?.montoDescuento))
                                                                ? `${Number(item.montoDescuento)} %`
                                                                : "-")
                                                            : (cotizacionData?.moneda && !isNaN(Number(item?.montoDescuento))
                                                                ? `${cotizacionData.moneda === "PEN" ? "S/. " : "$"} ${Number(item.montoDescuento).toLocaleString("en-US", {
                                                                minimumFractionDigits: 2,
                                                                maximumFractionDigits: 2
                                                                })}`
                                                            : "-"
                                                            )}
                                                        </Text>
                                                        </View>
                                                        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                                            <Text style={{ fontFamily: "Poppins", fontSize: "10px", fontWeight: "light", color: darkBlue }}>
                                                                Precio final x unidad:
                                                            </Text>
                                                            <Text style={{ fontFamily: "Poppins", fontSize: "10px", fontWeight: "light", color: darkBlue }}>
                                                                {(moneda + " ") + (() => {
                                                                    const precioBase = item?.customPriceActive 
                                                                        ? item.customPrice 
                                                                        : item.servicio.preciosUnitarios?.find(pU => pU.plan.id === item.planServicio.id)?.precio || 0;
                                                                    
                                                                    const descuento = item?.tipoDescuento === "Porcentaje" 
                                                                        ? (precioBase * (Number(item?.montoDescuento) || 0) / 100)
                                                                        : (Number(item?.montoDescuento) || 0);
                                                                    
                                                                    const precioFinal = precioBase - descuento;
                                                                    
                                                                    const precioConPais = CalcularPrecioPais({
                                                                        precio: precioFinal,
                                                                        multiplicador: ObtenerMultiplicador({
                                                                            pais: cotizacionData?.cliente?.pais || cotizacionData?.lead?.country,
                                                                            paises: paises
                                                                        })
                                                                    });
                                                                    
                                                                    return (precioConPais / tipoCambio).toLocaleString("en-US", {
                                                                        minimumFractionDigits: 2,
                                                                        maximumFractionDigits: 2
                                                                    });
                                                                })()}
                                                            </Text>
                                                        </View>
                                                        <Text style={{ fontFamily: "Poppins", fontSize: "10px", fontWeight: "light", color: darkBlue }}>
                                                          {"---------------------------------"}
                                                        </Text>
                                                        <View style={{ display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                                            <Text style={{ fontFamily: "Poppins", fontSize: "10px", fontWeight: "light", color: darkBlue }}>
                                                                Total:
                                                            </Text>
                                                            <Text style={{ fontFamily: "Poppins", fontSize: "10px", fontWeight: "light", color: darkBlue }}>
                                                                {(moneda + " ") + (() => {
                                                                    const precioFinal = CalculateFinalPrice(item, allServiciosList);
                                                                    const totalConPais = CalcularPrecioPais({
                                                                        precio: precioFinal,
                                                                        multiplicador: ObtenerMultiplicador({
                                                                            pais: cotizacionData?.cliente?.pais || cotizacionData?.lead?.country,
                                                                            paises: paises
                                                                        })
                                                                    });
                                                                    return (totalConPais / tipoCambio).toLocaleString("en-US", {
                                                                        minimumFractionDigits: 2,
                                                                        maximumFractionDigits: 2
                                                                    });
                                                                })()}
                                                            </Text>
                                                        </View>
                                                    </View>
                                                )} */}
                                                
                                            </View>
                                        </View>
    
                                    </View>
                                </View>
                            ))
                        )}
                    </View>

                    {/* Enlaces adicionales */}
                    <View style={{ display: "flex", flexDirection: "column", paddingHorizontal: "48px", paddingVertical: "16px", height: "193px", backgroundColor: lightGray, marginTop: "auto"}}>
                        <Text style={{ fontFamily: "Poppins", fontSize: "20px", fontWeight: "normal", color: darkBlue, marginBottom: "16px" }}>
                            Enlaces adicionales
                        </Text>

                        <View style={{ display: "flex", flexDirection: "row", marginRight: "16px" }}>

                            <View style={{ display: "flex", flexDirection: "column", marginRight: "16px", width: "264px" }}>

                                <Text style={ recurrentStyles.generalSubtitle }>
                                    Casos de Éxito
                                </Text>

                                <View style={{ display: "flex", flexDirection: "row", marginBottom: "4px" }}>
                                    <Text style={additionalLinks.itemTitle}>
                                        Google Ads
                                    </Text>

                                    <Text style={additionalLinks.itemDivisor}>
                                        :
                                    </Text>
                                    <Link src="https://www.youtube.com/watch?v=9OSdtnjKrQ4&list=PLTZlHKHffVTYC9wsIC6dYlB2-nBqipx1f&pp=iAQB">
                                        <Text style={additionalLinks.itemData}>
                                            https://www.youtube.com
                                        </Text>
                                    </Link>
                                </View>

                                <View style={{ display: "flex", flexDirection: "row", marginBottom: "4px"}}>
                                    <Text style={additionalLinks.itemTitle}>
                                        Meta Ads
                                    </Text>

                                    <Text style={additionalLinks.itemDivisor}>
                                        :
                                    </Text>

                                    <Link src="https://www.youtube.com/watch?v=qUXb5UH6Yug&list=PLTZlHKHffVTaB8qnRcqb9vhPR_jHCHsgy&pp=iAQB">
                                        <Text style={additionalLinks.itemData}>
                                            https://www.youtube.com
                                        </Text>
                                    </Link>
                                </View>

                                <View style={{ display: "flex", flexDirection: "row", marginBottom: "4px"}}>
                                    <Text style={additionalLinks.itemTitle}>
                                        Linkedin ads
                                    </Text>

                                    <Text style={additionalLinks.itemDivisor}>
                                        :
                                    </Text>

                                    <Link src="https://www.youtube.com/watch?v=OwCBApwvIw0&list=PLTZlHKHffVTYynZk8hFUIob9MwFWUzIsu&pp=iAQB">
                                        <Text style={additionalLinks.itemData}>
                                            https://www.youtube.com
                                        </Text>
                                    </Link>
                                </View>

                            </View>

                            <View style={{ display: "flex", flexDirection: "column", marginRight: "16px", width: "264px" }}>

                                <Text style={ recurrentStyles.generalSubtitle }>
                                    Testimonios de clientes
                                </Text>

                                <View style={{ display: "flex", flexDirection: "row", marginBottom: "4px" }}>
                                    <Text style={additionalLinks.itemTitle}>
                                        Google Ads
                                    </Text>

                                    <Text style={additionalLinks.itemDivisor}>
                                        :
                                    </Text>

                                    <Link src="https://www.youtube.com/watch?v=DBRoxjR-jf4&list=PLTZlHKHffVTZEcrn-Z-ObqvpyUWyb3qLn&pp=iAQB">
                                        <Text style={additionalLinks.itemData}>
                                            https://www.youtube.com
                                        </Text>
                                    </Link>
                                </View>

                                <View style={{ display: "flex", flexDirection: "row", marginBottom: "4px"}}>
                                    <Text style={additionalLinks.itemTitle}>
                                        Meta Ads
                                    </Text>

                                    <Text style={additionalLinks.itemDivisor}>
                                        :
                                    </Text>

                                    <Link src="https://www.youtube.com/watch?v=hjzi_xPYGrU&list=PLTZlHKHffVTYRD-veZzPOePVFss6-ReDB&pp=iAQB">
                                        <Text style={additionalLinks.itemData}>
                                            https://www.youtube.com
                                        </Text>
                                    </Link>
                                </View>

                                <View style={{ display: "flex", flexDirection: "row", marginBottom: "4px"}}>
                                    <Text style={additionalLinks.itemTitle}>
                                        Desarrollo Web
                                    </Text>

                                    <Text style={additionalLinks.itemDivisor}>
                                        :
                                    </Text>

                                    <Link src="https://www.youtube.com/watch?v=-SF6AT671eo&list=PLTZlHKHffVTam7SwWwq7VO8BfPda1tvLi&pp=iAQB">
                                        <Text style={additionalLinks.itemData}>
                                            https://www.youtube.com
                                        </Text>
                                    </Link>
                                </View>

                            </View>

                            <View style={{ display: "flex", flexDirection: "column", width: "186px" }}>

                                <Text style={ recurrentStyles.generalSubtitle }>
                                    Recursos
                                </Text>

                                <View style={{ display: "flex", flexDirection: "row", marginBottom: "4px" }}>
                                    <Link src="https://monstruocreativo.com/portafolio">
                                        <Text style={{ fontFamily: "Poppins", fontWeight: "bold", fontSize: "10px", color: darkBlue}}>
                                            Portafolio
                                        </Text>
                                    </Link>
                                </View>
                                <View style={{ display: "flex", flexDirection: "row", marginBottom: "4px" }}>
                                    <Link src="https://monstruocreativo.com/servicios">
                                        <Text style={{ fontFamily: "Poppins", fontWeight: "bold", fontSize: "10px", color: darkBlue}}>
                                            Servicios
                                        </Text>
                                    </Link>
                                </View>
                                <View style={{ display: "flex", flexDirection: "row", marginBottom: "4px" }}>
                                    <Link src="https://monstruocreativo.com/beneficios">
                                        <Text style={{ fontFamily: "Poppins", fontWeight: "bold", fontSize: "10px", color: darkBlue}}>
                                            Beneficios
                                        </Text>
                                    </Link>
                                </View>

                            </View>

                        </View>
                    </View>

                    {/* Footer */}
                    <View style={{ display: "flex", justifyContent: "center", textAlign: "center", alignItems: "center", backgroundColor: darkBlue, height: "40px" }}>
                        <Text style={{ fontFamily: "Poppins", fontSize: "10px", color: "white", fontWeight: "normal" }}>
                            @monstruocreativo/agenciademarketing
                        </Text>
                    </View>
    
                </Page>
            </Document>
            }
        </>
    )

    return (
      <ModalInDrawer
        className="max-w-5xl w-full"
        activeModal={open}
        onClose={onClose}
        title={title}
      >
        <BlobProvider document={pdf}>
          {({ blob, url, loading }) => (
            <div className="w-full h-full">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <p>Cargando PDF...</p>
                </div>
              ) : (
                <div className="w-full h-full">
                  <iframe
                    src={url}
                    className="w-full h-full min-h-screen"
                    title="PDF Viewer"
                    showToolbar={false}
                  />
                  {/* <button
                    onClick={() => handleDownloadBlobPDF(blob, `${cotizacionData?.cliente?.razonSocial || cotizacionData?.lead?.leadName} - ${brandName} - ${formatDateString(cotizacionData?.createdAt)}.pdf`)}
                    className="fixed top-4 font-bold text-xs right-4 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-all duration-100 shadow-md"
                  >
                    <div className="flex items-center gap-2">
                      Descargar PDF
                      <FaDownload />
                    </div>
                  </button> */}
                </div>
              )}
            </div>
          )}
        </BlobProvider>
      </ModalInDrawer>
    );
}

export default PDFMonstruoCreativo