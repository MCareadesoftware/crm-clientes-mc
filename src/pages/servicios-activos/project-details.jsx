import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "@/components/ui/Card";
import Icon from "@/components/ui/Icon";
import GroupChart4 from "@/components/partials/widget/chart/group-chart-4";

import GroupChart1 from "@/components/partials/widget/chart/group-chart-1";
import GroupChart2 from "@/components/partials/widget/chart/group-chart-2";
import GroupChart3 from "@/components/partials/widget/chart/group-chart-3";
import GroupChart5 from "@/components/partials/widget/chart/group-chart5";

import DonutChart from "@/components/partials/widget/chart/donut-chart";
import { meets, files } from "@/constant/data";
import SelectMonth from "@/components/partials/SelectMonth";
import TaskLists from "@/components/partials/widget/task-list";
import MessageList from "@/components/partials/widget/message-list";
import TrackingParcel from "@/components/partials/widget/activity";
import TeamTable from "@/components/partials/Table/team-table";
import CalendarView from "@/components/partials/widget/CalendarView";
import axios from "axios";
import { BACKEND } from "../../configs/envConfig";
import Loading from "../../components/Loading";
import { differenceInDays, format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { MdCheck, MdOutlineWorkOutline } from "react-icons/md";
import { convertFirstLetterCapital } from "../../helpers/stringsHelper";
import EtapasTareasSeguimiento from "../../components/modules/servicios/EtapasTareasSeguimiento";
import ActividadServicio from "../../components/modules/servicios/Actividad";
import Reuniones from "../../components/modules/servicios/Reuniones";
import qs from "qs";
import { FaCheck, FaFileInvoice, FaMicrophone, FaSoundcloud, FaUser, FaVolumeUp } from "react-icons/fa";
import banner from "../../assets/images/all-img/Banner-Google.webp";
import { BackgroundColorStatusMap, itemColorStatusMap } from "../../utils/ColorData";
import ChackkIcon from '/chackk.svg';
import { useSelector } from "react-redux";
import ProyectLinks from "../../components/ui/proyect-links";

import PDFMonstruoCreativo from "../../components/pdfs/PDFMonstruoCreativo";
import ObtenerMultiplicador from "../../utils/ObtenerMultiplicador";
import ObtenerMoneda from "../../utils/ObtenerMoneda";

const ServicioDetails = () => {
  const { id } = useParams();
  const user = useSelector((state) => state.user.user);

  const [dataServicio, setDataServicio] = useState(null);
  const [citasList, setCitasList] = useState([]);
  const [integrantes, setIntegrantes] = useState([]);

  const [tareasList, setTareasList] = useState([]);
  const [relevantTasks, setRelevantTasks] = useState([]);
  const [linksList, setLinksList] = useState([]);
  const [serviceForm, setServiceForm] = useState(null);

  const webOficialLink = linksList.find(link => link.titulo === "Link web oficial")?.url || null;
  const demoLink = linksList.find(link => link.titulo === "Link demo")?.url || null;
  const capacitacionLink = dataServicio?.linkCapacitacion ? dataServicio?.linkCapacitacion : null;

  const getTotalTasks = async () => {
    try {
      const stringifiedQuery = qs.stringify(
        {
          where: {
            and: [
              {
                serviceId: {
                  equals: id,
                },
              },
              {
                visibleToClient: {
                  equals: true,
                },
              },
              {
                or: [
                  {
                    status: {
                      not_equals: "Incumplido",
                    },
                  },
                  {
                    status: {
                      not_equals: "Eliminado",
                    },
                  },
                ],
              },
            ],
          },
          depth: 4,
          limit: 0,
        },
        { addQueryPrefix: true }
      );

      const response = await axios.get(`${BACKEND}/tareasProyectos${stringifiedQuery}`);
      setRelevantTasks(response.data.docs.filter((t) => t.task.isMeeting || t.task.isVisit).filter((t) => t.delivered))

      const uniqueArray = [
        ...new Map(
          response.data.docs
            .filter((item) => typeof item.task.defaultResponsible === "object") // Filtra los strings y valores nulos
            .map((item) => {
              return [
                item.task.defaultResponsible.id,
                item.task.defaultResponsible,
              ];
            }) // Crea pares [id, objeto] .
        ).values(),
      ];

      setIntegrantes(uniqueArray);

      setTareasList(() => response.data.docs.filter((t) => !t.task.isMeeting));

      setCitasList(() => response.data.docs.filter((t) => t.task.isMeeting));
    } catch (error) {
      return null
    }
  };

  const getLinks = async () => { // Obtenemos los links de los clientes
    try {
      const response = await axios.get(`${BACKEND}/LinksServiciosClientes?limit=0&where[cliente][equals]=${user.id}&where[servicio][equals]=${dataServicio?.servicio?.id}`)
      setLinksList(response.data.docs)
    } catch (error) {
      return null
    }
  }

  const getCitas = async () => {
    try {
      const response = await axios.get(
        `${BACKEND}/serviciosCotizacionesCitas?limit=1000&where[servicioCotizacion][equals]=${id}&sort=createdAt`
      );
      setCitasList(response.data.docs);
    } catch (error) {}
  };

  const getForm = async () => {
    try {
      const response = await axios.get(`${BACKEND}/formularioServicioRespuestas?where[servicioCotizacion][equals]=${id}&limit=100`)
      const form = response?.data?.docs[0]

      if (!form) {
        setServiceForm(null)
        return
      }

      setServiceForm(`/encuestas/answer/${form?.id}?idform=${form?.formulario?.id}`)
    } catch (error) {
      return null
    }
  }

  useEffect(() => {
    getTotalTasks();
    getCitas();
    getLinks();
    getForm();
  }, []);

  const getServicioDetails = async () => {
    try {
      const response = await axios.get(
        `${BACKEND}/serviciosCotizaciones/${id}`
      );
      setDataServicio(response.data);
    } catch (error) {}
  };

  useEffect(() => {
    getServicioDetails();
  }, []);

  /// PDF
  const [pdfOpen, setPdfOpen] = useState(false)
  const [paises, setPaises] = useState([])
  const [pagosList, setPagosList] = useState([])
  const [allServiciosList, setAllServiciosList] = useState([])
  const [allServiciosCotizacionesList, setAllServiciosCotizacionesList] = useState([])
  const [currencyExchanges, setCurrencyExchanges] = useState({})
  const [currency, setCurrency] = useState("PEN")

  const pdfMap = {
    "67ea9c110e2642a4b0b902e1": "PDFMonstruoCreativo",
    "67ea9c250e2642a4b0b902fa": "PDFW3b",
    "67ea9c2c0e2642a4b0b90313": "PDFMundoDigital",
    "67ea9c320e2642a4b0b9032c": "PDFAllSavfe",
    "67ea9c3e0e2642a4b0b90345": "PDFConviertelo",
    "67ea9c440e2642a4b0b9035e": "PDFLucuma",
  }

  const PDFComponents = {
    PDFMonstruoCreativo,
    // PDFAllSavfe,
    // PDFW3b,
    // PDFMundoDigital,
    // PDFConviertelo,
    // PDFLucuma,
  }

  const defaultPDF = "PDFMonstruoCreativo"
  const selectedPDFKey = pdfMap[dataServicio?.marca?.id]
  const SelectedPDFComponent = PDFComponents[selectedPDFKey] || PDFComponents[defaultPDF]

  // const multiplicador = ObtenerMultiplicador({pais: data?.cliente?.pais || data?.lead?.country, paises: paises})
  // const flagUrl = paises.find(p => NormalizeText(p.name) === NormalizeText(data?.cliente?.pais || data?.lead?.country))?.bandera?.url
  
  const currencyExchange = currencyExchanges[currency]

  const getPaises = async () => {
    try {
      const response = await axios.get(`${BACKEND}/paises?limit=0`)
      setPaises(response.data.docs)
    } catch (error) {
      return false
    }
  }
  
  const getPagos = async () => {
    try {
      const response = await axios.get(`${BACKEND}/pagosCotizaciones?where[cotizacion][equals]=${dataServicio?.cotizacion.id}&sort=createdAt&limit=1000`)
      setPagosList(response.data.docs)
    } catch (error) {
      return false
    }
  };

  const getServiciosCotizaciones = async () => {
    try {
      const response = await axios.get(`${BACKEND}/serviciosCotizaciones?where[cotizacion][equals]=${dataServicio?.cotizacion?.id}&limit=0&depth=4`)
      setAllServiciosCotizacionesList(response.data.docs)
    } catch (error) {
      return false
    }
  };

  const getServicios = async () => {
    try {
      const response = await axios.get(`${BACKEND}/servicios?limit=1000`)
      setAllServiciosList(response.data.docs)
    } catch (error) {
      return false
    }
  };

  const getCurrencyExchange = async () => {
    try {
      const response = await axios.get(`${BACKEND}/tiposCambio?limit=0`)
      const currencyExchanges = response.data.docs.reduce((acc, item) => {
        acc[item.moneda] = item.tipoCambio
        return acc
      }, {})
      setCurrencyExchanges(currencyExchanges)
    } catch (error) {
      return false
    }
  }

  useEffect(() => {
    getPaises()
    getPagos()
    getServiciosCotizaciones()
    getServicios()
    getCurrencyExchange()
  }, [])

  useEffect(() => {
    getPaises()
    getPagos()
    getServiciosCotizaciones()
    getServicios()
    getCurrencyExchange()

      setCurrency(ObtenerMoneda({pais: dataServicio?.cotizacion?.cliente?.pais || dataServicio?.cotizacion?.lead?.country, paises: paises}))
 
  }, [dataServicio])

  if (!dataServicio)
    return (
      <div>
        <Loading />
      </div>
    );
  if (typeof dataServicio != "object") return <>no existe el servicio</>;

  return (
    <div className="space-y-5">

      {SelectedPDFComponent && dataServicio && (
        <SelectedPDFComponent
          onClose={() => setPdfOpen(false)}
          open={pdfOpen}
          cotizacionData={dataServicio.cotizacion}
          title={"Vista Previa PDF"}
          igv={false}
          comparativo={false}
          incognitMode={false}
          moneda={currency}
          tipoCambio={currencyExchange}
          paises={paises}
          pagosList={pagosList}
          serviciosList={allServiciosCotizacionesList}
          allServiciosList={allServiciosList}
        />
      )}

      <div className="flex flex-row overflow-x-auto justify-center items-center border bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 p-4 rounded-md px-8">
        
        <div className="flex flex-col gap-1 min-w-[8rem] w-1/5">
          <span className="text-xs text-gray-500 dark:text-slate-400" > 
            Plan
          </span>
          <span className="text-xs font-medium text-slate-700 dark:text-slate-200" > 
            {dataServicio.planServicio.name}
          </span>
        </div>

        <div className="flex flex-col min-w-[8rem] gap-1 border-l border-gray-200 dark:border-slate-700 pl-4 w-1/5">
          <span className="text-xs text-gray-500 dark:text-slate-400" > 
            Estado
          </span>

          <div className={`${BackgroundColorStatusMap[dataServicio.estado]} dark:bg-slate-700 flex flex-row items-center justify-center gap-2 px-3 py-1 rounded-md w-fit `}>
            <div className={`w-2 h-2 ${itemColorStatusMap[dataServicio.estado]} dark:bg-green-700 rounded-full animate-pulse`}></div>
            <span className="text-slate-800 dark:text-green-300 text-xs font-medium">{dataServicio.estado}</span>
          </div>
        </div>

        <div className="flex flex-col min-w-[8rem] gap-1 border-l border-gray-200 dark:border-slate-700 pl-4 w-1/5">
          <span className="text-xs text-gray-500 dark:text-slate-400" > 
            Fecha inicio
          </span>
          <div className="flex flex-row items-center justify-start gap-2">
            <Icon icon="heroicons-outline:calendar" className="text-slate-600 dark:text-slate-400" />
            <span className="block text-xs font-medium text-slate-700 dark:text-slate-200">
              {format(new Date(dataServicio.fechaInicio), "dd MMMM , yyyy", {
                locale: es,
              })}
            </span>
          </div>
        </div>

        <div className="flex flex-col min-w-[8rem] gap-1 border-l border-gray-200 dark:border-slate-700 pl-4 w-1/5">
          <span className="text-xs text-gray-500 dark:text-slate-400" > 
            Fecha fin
          </span>
          <div className="flex flex-row items-center justify-start gap-2">
            <Icon icon="heroicons-outline:calendar" className="text-slate-600 dark:text-slate-400" />
            <span className="block text-xs font-medium text-slate-700 dark:text-slate-200">
              {format(new Date(dataServicio.fechaFin), "dd MMMM , yyyy", {
                locale: es,
              })}
            </span>
          </div>
        </div>

        <div className="flex flex-col min-w-[8rem] gap-1 border-l border-gray-200 dark:border-slate-700 pl-4 w-1/5">
          <span className="text-xs text-gray-500 dark:text-slate-400" > 
            Cotización
          </span>
          <div className="flex flex-row gap-2 items-center hover:cursor-pointer">
            <Icon icon="heroicons-outline:eye" className="text-blue-500 dark:text-blue-500" />
            <button 
              className="text-xs font-medium text-slate-700 dark:text-slate-200" 
              onClick={() => setPdfOpen(true)}
            > 
              Previsualizar
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card title="Descripción del servicio" icon="/letterservices.svg" className="flex flex-col w-full dark:bg-slate-800 dark:border-slate-700">
          <div className="flex flex-col justify-between">

            <ul className="space-y-2 bg-slate-100 dark:bg-slate-700 rounded-md p-4">
              {(() => {
                const descripcionServicio = (dataServicio.customDescriptionActive
                  ? dataServicio?.customDescriptionText
                  : dataServicio.servicio.preciosUnitarios.find(
                      (serv) => serv.plan.id === dataServicio.planServicio.id
                    )?.descripcion
                ) || '';
                const lineasDescripcion = descripcionServicio
                  .split('\n')
                  .filter(line => line.trim() !== '');
                if (lineasDescripcion.length > 0) {
                  return lineasDescripcion.map((line, idx) => {
                    const cleanLine = line.replace(/✓/g, '').replace(/\s+$/, '').trim();
                    return (
                      <li key={idx} className="flex items-center gap-2 text-[#16213E] dark:text-slate-200 font-semibold">
                        <span className="mr-2 text-lg text-[#16213E] dark:text-slate-200">•</span>
                        <span className="flex-1 text-[10px]">{cleanLine}</span>
                        <img src="/chackk.svg" alt="check" className="w-4 h-4 ml-1" />
                      </li>
                    );
                  });
                } else {
                  return (
                    <li className="text-slate-400 italic">No hay descripción disponible para este servicio.</li>
                  );
                }
              })()}
            </ul>
            <div className="bg-slate-100 dark:bg-slate-700 rounded px-4 pt-4 pb-1 flex flex-wrap justify-between mt-6">
              <div className="mr-3 mb-3 space-y-2">
                <div className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  Plan
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300">
                  {dataServicio?.planServicio.name}
                </div>
              </div>
              <div className="mr-3 mb-3 space-y-2">
                <div className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  Fecha de Inicio
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300">
                  {format(new Date(dataServicio.fechaInicio), "dd MMMM, yyyy", {
                    locale: es,
                  })}
                </div>
              </div>
              {/* end single */}
              <div className="mr-3 mb-3 space-y-2">
                <div className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  Fecha de Fin
                </div>
                <div className="text-xs text-warning-500">
                  {format(new Date(dataServicio.fechaFin), "dd MMMM, yyyy", {
                    locale: es,
                  })}
                </div>
              </div>
              {/* end single */}
            </div>
          </div>
        </Card>

        <Card title="Detalles" icon="/lt2.svg" className="flex flex-col w-full dark:bg-slate-800 dark:border-slate-700">
          {/* <div className="-mx-6 custom-calender mb-6">
            <CalendarView />
          </div> */}
          <div className="flex flex-col !space-y-4 text-xs">
            <span className="font-medium dark:text-slate-100">Encargad@s</span>
            <ul className=" divide-slate-100 dark:divide-slate-700">
              <li className="px-4 py-2  border-[1px] rounded-md border-[#f0f0f2] dark:border-slate-700">
                <div className="flex space-x-2 rtl:space-x-reverse">
                  {typeof dataServicio.responsable === "object" ? (
                    <div className="flex-1 flex space-x-2 rtl:space-x-reverse">
                      <div className="flex-none">
                        {dataServicio.responsable.foto ? (
                          <img
                            src={dataServicio.responsable.foto.url}
                            alt={"Encargado servicio"}
                            className=" rounded-full h-8 w-8 object-cover "
                          />
                        ) : (
                          <div className="h-full w-10 rounded-md text-lg bg-slate-100 text-slate-900 dark:bg-slate-600 dark:text-slate-200 flex flex-col items-center justify-center font-normal capitalize">
                            {dataServicio.responsable.name.charAt(0) +
                              dataServicio.responsable.name.charAt(1)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <span className="block text-slate-600 text-xs dark:text-slate-300 mb-1 font-medium">
                          {dataServicio.responsable.name}
                        </span>
                        <span className="flex font-normal text-xs dark:text-slate-400 text-slate-500">
                          <span className="text-base inline-block mr-1">
                            <MdOutlineWorkOutline />
                          </span>
                          {convertFirstLetterCapital(
                            dataServicio.responsable.puesto
                          )}
                        </span>
                      </div>
                    </div>
                  ) : (
                    "No existe el usuario encargado / responsable"
                  )}
                  <div className="flex-none">
                    <span className="inline-flex items-center space-x-1 bg-green-500 dark:bg-green-700 bg-opacity-[0.16] text-green-700 dark:text-green-300 text-xs font-normal px-2 py-1 rounded-full rtl:space-x-reverse">
                      <span>
                        {" "}
                        <MdCheck />
                      </span>
                      <span>Responsable</span>
                    </span>
                  </div>
                </div>
              </li>
            </ul>

            <ul className="w-full flex flex-wrap gap-2 ">
              {integrantes &&
                integrantes.length > 0 &&
                integrantes.map(
                  (item, i) =>
                    item.id != dataServicio.responsable.id && (
                      <li
                        key={i}
                        className="px-4 py-2 w-[49%] border-[1px] rounded-md border-[#f0f0f2] dark:border-slate-700"
                      >
                        <div className="flex space-x-2 rtl:space-x-reverse">
                          {typeof item === "object" ? (
                            <div className="flex-1 flex space-x-2 rtl:space-x-reverse">
                              <div className="flex-none">
                                {item?.foto?.url ? (
                                  <img
                                    src={item?.foto?.url}
                                    alt={"Encargado servicio"}
                                    className=" rounded-full h-8 w-8 object-cover "
                                  />
                                ) : (
                                  <div className="h-full w-10 rounded-md text-lg bg-slate-100 text-slate-900 dark:bg-slate-600 dark:text-slate-200 flex flex-col items-center justify-center font-normal capitalize">
                                    {item?.name?.charAt(0) ??
                                      "-" + item?.name?.charAt(1) ??
                                      "-"}
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <span className="block text-slate-600 text-xs dark:text-slate-300 mb-1 font-medium">
                                  {item?.name}
                                </span>
                                <span className="flex font-normal text-xs dark:text-slate-400 text-slate-500">
                                  <span className="text-base inline-block mr-1">
                                    <MdOutlineWorkOutline />
                                  </span>
                                  {item?.puesto}
                                </span>
                              </div>
                            </div>
                          ) : (
                            "--"
                          )}
                          <div className="flex-none">
                            <span className="block text-xs text-slate-600 dark:text-slate-400">
                              {item.date}
                            </span>
                          </div>
                        </div>
                      </li>
                    )
                )}
            </ul>
          </div>

          <div className="flex flex-col !space-y-4 !py-4">
            <span className="font-medium dark:text-slate-100 text-xs">Datos adicionales</span>
            <div>
              <ul className="flex flex-col space-y-2">
                {dataServicio?.fechaFin && (
                  <li className="flex flex-row justify-between items-center">
                    <span className="text-xs font-medium dark:text-slate-200">
                      Días para la entrega:{" "}
                    </span>
                    <span className="text-sm dark:text-slate-200">
                      {differenceInDays(
                        parseISO(dataServicio?.fechaFin),
                        new Date()
                      )}
                    </span>
                  </li>
                )}

                <li className="flex flex-row justify-between items-center">
                  <span className="text-xs font-medium dark:text-slate-200">
                    Duración hasta la fecha:{" "}
                  </span>
                  <span className="text-xs dark:text-slate-200">
                    {differenceInDays(
                      new Date(),
                      parseISO(dataServicio.fechaInicio)
                    )}
                  </span>
                </li>

                <li className="flex flex-row justify-between items-center">
                  <span className="text-xs font-medium dark:text-slate-200">
                    Información enviada:{" "}
                  </span>
                  <span className="text-xs dark:text-slate-200">
                    {dataServicio.informacionEnviada}
                  </span>
                </li>

                <li className="flex flex-row justify-between items-center">
                  <span className="text-xs font-medium dark:text-slate-200">
                    Capacitación hecha:{" "}
                  </span>
                  <span className="text-xs dark:text-slate-200">
                    {dataServicio.capacitacionHecha}
                  </span>
                </li>

                <li className="flex flex-row justify-between items-center">
                  <span className="text-xs font-medium dark:text-slate-200">Sub-area: </span>
                  <span className="text-xs dark:text-slate-200">{dataServicio.subarea}</span>
                </li>
                <li className="flex flex-row justify-between items-center">
                  <span className="text-xs font-medium dark:text-slate-200">Plantilla: </span>
                  <span className="text-xs dark:text-slate-200">
                    {dataServicio.servicio.template}
                  </span>
                </li>
                <li className="flex flex-row justify-between items-center">
                  <span className="text-xs font-medium dark:text-slate-200">Categoría: </span>
                  <span className="text-xs dark:text-slate-200">
                    {dataServicio.servicio.categoria}
                  </span>
                </li>
                <li className="flex flex-row justify-between items-center">
                  <span className="text-xs font-medium dark:text-slate-200">Activo: </span>
                  <span className="text-xs dark:text-slate-200">
                    {dataServicio.active ? "Si" : "No"}
                  </span>
                </li>

                <li className="flex flex-row justify-between items-center">
                  <span className="text-xs font-medium dark:text-slate-200">
                    Es cuenta publicitaria:{" "}
                  </span>
                  <span className="text-xs dark:text-slate-200">
                    {dataServicio.isCuentaPublicitaria ? "Si" : "No"}
                  </span>
                </li>

                {/* <li className="flex flex-row justify-between items-center">
                  <span className="text-sm font-medium">
                    Casos de éxito Monstruo Creativo:{" "}
                  </span>
                  <a
                    href={dataServicio.servicio?.successCaseVideo || ""}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-800 hover:text-blue-600 hover:underline transition-colors text-sm font-bold"
                  >
                    Ver
                  </a>
                </li> */}
                {/* <li>
                  <span className="text-sm font-medium">
                    Video Making-off:{" "}
                  </span>
                  <a
                    href={dataServicio.servicio?.makingOffVideo || ""}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-800 hover:text-blue-600 hover:underline transition-colors text-sm font-bold"
                  >
                    Ir al video
                  </a>
                </li>

                <li>
                  <span className="text-sm font-medium">
                    Video del proyecto:{" "}
                  </span>
                  <a
                    href={dataServicio.servicio?.proyectVideo || ""}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-800 hover:text-blue-600 hover:underline transition-colors text-sm font-bold"
                  >
                    Ir al video
                  </a>
                </li>

                 */}
                {/* <li>
                  <span className="text-sm font-medium">Videos reseña: </span>
                  <a
                    href={dataServicio.servicio?.reviewVideo || ""}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-800 hover:text-blue-600 hover:underline transition-colors text-sm font-bold"
                  >
                    Ir al video
                  </a>
                </li> */}

                <li>
                  <hr className="border-gray-200 dark:border-slate-700" />
                </li>
              </ul>
            </div>

            <span className="font-medium dark:text-slate-100 text-xs">Facturación</span>
            <div>
              <ul className="flex flex-col space-y-2">
                <li className="flex flex-row justify-between items-center">
                  <span className="text-xs font-medium dark:text-slate-200">Tipo de pago: </span>
                  <span className="text-xs dark:text-slate-200">
                    {dataServicio.servicio.tipoPago}
                  </span>
                </li>
                <li className="flex flex-row justify-between items-center">
                  <span className="text-xs font-medium dark:text-slate-200">Facturación: </span>
                  <span className="text-xs dark:text-slate-200">{dataServicio.facturacion}</span>
                </li>

                <li className="flex flex-row justify-between items-center">
                  <span className="text-xs font-medium dark:text-slate-200">IGV: </span>
                  <span className="text-xs dark:text-slate-200">{dataServicio.igv}</span>
                </li>

                <li className="flex flex-row justify-between items-center">
                  <span className="text-xs font-medium dark:text-slate-200">Precio: </span>
                  <span className="text-xs dark:text-slate-200">{dataServicio.customPrice}</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        <Card title="Estado del servicio" icon="/caseIcon.svg" className="flex flex-col w-full dark:bg-slate-800 dark:border-slate-700">
          <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-6">
            <ul className="space-y-3 text-xs">
              <li className="flex items-center justify-between">
                <span className="font-bold lowercase text-slate-700 dark:text-slate-100">estado</span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 lowercase">{dataServicio.estado || '-'}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="lowercase text-slate-500 dark:text-slate-400">fecha inicio</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">{dataServicio.fechaInicio ? format(new Date(dataServicio.fechaInicio), 'dd/MM/yyyy') : '-'}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="lowercase text-slate-500 dark:text-slate-400">fecha fin</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">{dataServicio.fechaFin ? format(new Date(dataServicio.fechaFin), 'dd/MM/yyyy') : '-'}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="lowercase text-slate-500 dark:text-slate-400">fecha lanzamiento</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">{dataServicio.fechaInicio ? format(new Date(dataServicio.fechaInicio), 'dd/MM/yyyy') : '-'}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="lowercase text-slate-500 dark:text-slate-400">fecha renovación</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">{dataServicio.fechaFin ? format(new Date(dataServicio.fechaFin), 'dd/MM/yyyy') : '-'}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="lowercase text-slate-500 dark:text-slate-400">días de duración del proyecto</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">{differenceInDays(new Date(dataServicio.fechaFin), new Date(dataServicio.fechaInicio))} días</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="lowercase text-slate-500 dark:text-slate-400">inicio hace:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">{differenceInDays(new Date(), new Date(dataServicio.fechaInicio))} días</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="lowercase text-slate-500 dark:text-slate-400">finaliza en:</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">{differenceInDays(new Date(dataServicio.fechaFin), new Date()) === 0 ? 'finaliza hoy' : differenceInDays(new Date(dataServicio.fechaFin), new Date()) + ' días'}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="lowercase text-slate-500 dark:text-slate-400">creación</span>
                <span className="font-semibold text-slate-700 dark:text-slate-200">{differenceInDays(new Date(), new Date(dataServicio.createdAt))} días</span>
              </li>
            </ul>
          </div>
        </Card>
        
        <Card title="Links" icon="/linkIcon.svg" className="flex flex-col w-full dark:bg-slate-800 dark:border-slate-700">
          {/* <ul className="flex flex-col space-y-2">
            <li className="flex flex-row justify-between items-center">
              <span className="text-xs font-medium dark:text-slate-200">Formulario</span>
              <span className="text-xs flex items-center gap-2 dark:text-slate-200">
                {serviceForm ? "Sí" : "No"}
                {serviceForm && (
                  <a
                    href={serviceForm}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                    tabIndex={0}
                    aria-label="Ir al formulario"
                  >
                    Link
                  </a>
                )}
              </span>
            </li>
            <li className="flex flex-row justify-between items-center">
              <span className="text-xs font-medium dark:text-slate-200">Link web oficial</span>
              <span className="text-xs flex items-center gap-2 dark:text-slate-200">
                {webOficialLink ? "Sí" : "No"}
                {webOficialLink && (
                  <a
                    href={webOficialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                    tabIndex={0}
                    aria-label="Ir al sitio web oficial"
                  >
                    Link
                  </a>
                )}
              </span>
            </li>
            <li className="flex flex-row justify-between items-center">
              <span className="text-xs font-medium dark:text-slate-200">Link demo - desarrollo</span>
              <span className="text-xs flex items-center gap-2 dark:text-slate-200">
                {demoLink ? "Sí" : "No"}
                {demoLink && (
                  <a
                    href={demoLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                    tabIndex={0}
                    aria-label="Ir al demo de desarrollo"
                  >
                    Link
                  </a>
                )}
              </span>
            </li>
            <li className="flex flex-row justify-between items-center">
              <span className="text-xs font-medium dark:text-slate-200">Link capacitación</span>
              <span className="text-xs flex items-center gap-2 dark:text-slate-200">
                {capacitacionLink ? "Sí" : "No"}
                {capacitacionLink && (
                  <a
                    href={capacitacionLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                    tabIndex={0}
                    aria-label="Ir al link de capacitación"
                  >
                    Link
                  </a>
                )}
              </span>
            </li>
          </ul> */}
          <ProyectLinks 
            servicioData={dataServicio} 
            serviceForm={serviceForm}
            webOficialLink={webOficialLink}
            demoLink={demoLink}
            capacitacionLink={capacitacionLink}
          />
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-5">
        <div className="xl:col-span-8 lg:col-span-7 col-span-12">
          <Card title="Seguimiento de tareas" icon="/lt2.svg" noborder className="overflow-x-auto">
            {/* <TeamTable /> */}
            <table className="w-full text-xs text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="px-4 py-3">
                    Descripción
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Fecha creado
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Hora creado
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Fecha entrega
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Hora entrega
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Estado
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Responsable
                  </th>
                  {/* <th scope="col" className="px-4 py-3">
                    Link
                  </th> */}
                </tr>
              </thead>
              <tbody>
                {tareasList.map((e) => (
                  <tr
                    key={e.id}
                    className="border-b hover:bg-gray-100 hover:dark:bg-gray-950 dark:border-slate-700"
                  >
                    <th
                      scope="row"
                      className="flex items-center px-4 py-2 font-medium text-gray-700 dark:text-gray-300  "
                    >
                      <p className=" !text-wrap">{e?.task?.name}</p>
                    </th>
                    <td className="px-4 py-2">
                      <span className=" text-xs font-medium px-2 py-0.5 rounded ">
                        {format(new Date(e?.task?.createdAt), "dd, MMMM", {
                          locale: es,
                        })}
                      </span>
                    </td>
                    <td className="px-4 py-2 font-medium text-gray-700 dark:text-gray-400 whitespace-nowrap ">
                      <div className="flex items-center">
                        {/* <div className="inline-block w-4 h-4 mr-2 bg-red-700 rounded-full"></div> */}
                        {format(new Date(e?.task?.createdAt), "HH:MM a", {
                          locale: es,
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-2 font-medium text-gray-700 dark:text-gray-400 whitespace-nowrap ">
                      {format(new Date(e.limitDate), "dd, MMMM", {
                        locale: es,
                      })}
                    </td>
                    <td className="px-4 py-2 font-medium text-gray-700 dark:text-gray-400 whitespace-nowrap ">
                      {format(new Date(e.limitDate), "HH:MM a", {
                        locale: es,
                      })}
                    </td>
                    <td className="px-4 py-2 font-medium text-gray-700 dark:text-gray-400 whitespace-nowrap ">
                      <div className="flex items-center">
                        {e.status === "En proceso" && (
                          <>
                            {new Date(e?.limitDate) < new Date() ? (
                              // <div className="inline-block w-3 h-3 mr-2 bg-red-700 rounded-full"></div>
                              //<div className="inline-block w-3 h-3 mr-2 bg-orange-500 rounded-full"></div>
                              <div className="inline-block w-3 h-3 mr-2 bg-green-500 rounded-full"></div>
                            ) : (
                              //<div className="inline-block w-3 h-3 mr-2 bg-blue-500 rounded-full"></div>
                              <div className="inline-block w-3 h-3 mr-2 bg-green-500 rounded-full"></div>
                            )}
                          </>
                        )}
                        {e.status === "Pendiente" && (
                          <>
                            {new Date(e?.limitDate) < new Date() ? (
                              //<div className="inline-block w-3 h-3 mr-2 bg-red-700 rounded-full"></div>
                              <div className="inline-block w-3 h-3 mr-2 bg-green-500 rounded-full"></div>
                            ) : (
                              // <div className="inline-block w-3 h-3 mr-2 bg-orange-500 rounded-full"></div>
                              <div className="inline-block w-3 h-3 mr-2 bg-green-500 rounded-full"></div>
                            )}
                          </>
                        )}
                        {e.status === "Finalizado" && (
                          <div className="inline-block w-3 h-3 mr-2 bg-green-500 rounded-full"></div>
                        )}
                        {e.status === "Eliminado" && (
                          <div className="inline-block w-3 h-3 mr-2 bg-black rounded-full"></div>
                        )}
                        <span className="ml-1 text-gray-500 ">
                          {e.status === "Eliminado"
                            ? //"Eliminado"
                              "Entregado"
                            : e.status === "Finalizado"
                            ? "Finalizado"
                            : new Date(e.limitDate) < new Date()
                            ? //!! "Incumplido"  reemplazo temporal
                              "Entregado"
                            : //e.status
                              "Entregado"}
                        </span>
                      </div>
                    </td>
                    <th
                      scope="row"
                      className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap "
                    >
                      <div className="flex items-center  gap-2  whitespace-nowrap">
                        <FaUser className=" text-orange-500 " />
                        <span>{e.responsible?.name}</span>
                        {/*Boolean(e.responsible?.name ?? "") &&
                          convertFirstLetterCapital(e.responsible?.name ?? "")*/}
                      </div>
                    </th>
                    {/* <td className="px-4 py-2">
                          {e.estado === "Eliminado" ? (
                            <div>
                              <Tooltip content={e?.motivoAnulacion}>
                                <span className=" bg-gray-100 font-semibold text-gray-700 p-1 rounded-md shadow-md text-xs">
                                  Motivo
                                </span>
                              </Tooltip>
                            </div>
                          ) : (
                            <a
                              href={e.link}
                              target="_blank"
                              rel={"noreferrer"}
                              className=" text-blue-600 hover:underline text-sm"
                            >
                              Ver
                            </a>
                          )}
                        </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
            {/* <EtapasTareasSeguimiento idServicio={id} /> */}
          </Card>
        </div>
        <div className="xl:col-span-4 lg:col-span-5 flex flex-col gap-5 col-span-12">
          <div
            onClick={() =>
              window.open("https://g.page/r/CZG5gGrpqwwvEAE/review", "_blank")
            }
            className="hover:cursor-pointer rounded-md"
          >
            {/* <Reuniones lists={citasList} /> */}
            <img
              src={banner}
              alt="banner"
              className="object-cover w-full rounded-md"
            />
          </div>

          <Card title="Reuniones y meets" icon="/letterservices.svg" headerslot={<SelectMonth />}>
            <ActividadServicio tasks={relevantTasks} />
          </Card>

          <Card title="Audios y notas del asistente comercial" icon="/letterservices.svg" headerslot={<SelectMonth />} className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">
            <div className="flex flex-col gap-4">
              {dataServicio.comentarioVendedor && (
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold dark:text-slate-400 text-slate-600 mb-1">
                    Notas:
                  </span>
                  <span className="text-xs dark:text-slate-400 text-slate-600">
                    {dataServicio.comentarioVendedor}
                  </span>
                </div>
              )}

              <hr className="border-slate-200 dark:border-slate-600" />

              {dataServicio?.audios && dataServicio?.audios?.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold dark:text-slate-400 text-slate-600">
                    Audios:
                  </span>
                  {dataServicio?.audios?.map((audio, i) => {
                    return (
                      <div key={audio.id} className="flex flex-col gap-1">
                        <span className="text-xs flex flex-row gap-2 items-center font-semibold dark:text-slate-400 text-slate-600 mb-1">
                          <FaMicrophone /> Audio {i + 1}
                        </span>
                        <audio src={audio.url} controls className="w-full h-8" />
                      </div>
                    )
                  })}
                </div>
              )}
              
              <hr className="border-slate-200 dark:border-slate-600" />

              {dataServicio?.checklistMedia && dataServicio?.checklistMedia?.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold dark:text-slate-400 text-slate-600">
                    Checklist:
                  </span>
                  {dataServicio?.checklistMedia?.map((media, i) => {
                    return (
                      <div key={media.id} className="flex flex-col gap-1">
                        <span className="text-xs flex flex-row gap-2 items-center font-semibold dark:text-slate-400 text-slate-600 mb-1">
                          <FaVolumeUp /> Audio checklist {i + 1}
                        </span>
                        <audio src={media.url} controls className="w-full h-8" />
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ServicioDetails;
