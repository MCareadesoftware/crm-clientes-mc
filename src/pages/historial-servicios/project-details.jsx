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
import { FaMicrophone, FaUser, FaVolumeUp } from "react-icons/fa";
import banner from "../../assets/images/all-img/Banner-Google.webp";
import { useSelector } from "react-redux";
import ProyectLinks from "@/components/ui/proyect-links";
import Textinput from "@/components/ui/Textinput";
import { toast } from "react-toastify";

const HistorialServicioDetails = () => {
  const { id } = useParams();
  const user = useSelector((state) => state.user.user);
  const [dataServicio, setDataServicio] = useState(null);
  const [citasList, setCitasList] = useState([]);
  const [integrantes, setIntegrantes] = useState([]);

  const [tareasList, setTareasList] = useState([]);
  const [relevantTasks, setRelevantTasks] = useState([]);
  const [linksList, setLinksList] = useState([]);
  const [serviceForm, setServiceForm] = useState(null);
  const [gmails, setGmails] = useState([""]);
  const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  const gmailsErrors = gmails.map((v) =>
    v && !emailRegex.test(v) ? { message: "Ingrese un correo @gmail.com válido" } : null
  );

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
          depth: 4,
          limit: 0,
        },
        { addQueryPrefix: true }
      );

      const response = await axios.get(`${BACKEND}/tareasProyectos${stringifiedQuery}`);
      const relevantTasks = response.data.docs.filter((t) => t.task.isMeeting || t.task.isVisit).filter((t) => t.delivered)
      setRelevantTasks(relevantTasks)

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
      console.log(error);
    }
  };

  const getLinks = async () => { // Obtenemos los links de los clientes
    try {
      const response = await axios.get(`${BACKEND}/LinksServiciosClientes?limit=0&where[cliente][equals]=${user.id}&where[servicio][equals]=${dataServicio?.servicio?.id}`)
      setLinksList(response.data.docs)
    } catch (error) {
      console.log(error)
      return null
    }
  }

  const getCitas = async () => {
    try {
      const response = await axios.get(
        `${BACKEND}/serviciosCotizacionesCitas?limit=1000&where[servicioCotizacion][equals]=${id}&sort=createdAt`
      );
      setCitasList(response.data.docs);
      console.log(response.data.docs);
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

  const UpdateClient = async () => {
    try {
      const clientId = dataServicio?.cotizacion?.cliente?.id || user?.id;
      const payloadGmails = gmails
        .map((v) => (v || "").trim())
        .filter((v) => v !== "")
        .map((v) => ({ gmail: v }));

      await axios.put(`${BACKEND}/clientesUser/${clientId}`, {
        gmails: payloadGmails,
      });

      setDataServicio((prev) => {
        if (!prev?.cotizacion?.cliente) return prev;
        return {
          ...prev,
          cotizacion: {
            ...prev.cotizacion,
            cliente: {
              ...prev.cotizacion.cliente,
              gmails: payloadGmails,
            },
          },
        };
      });

      toast.success("Correos actualizados con éxito");
    } catch (error) {
      console.log(error);
      toast.error("Error al actualizar los correos");
    }
  };

  const handleGmailChange = (index, value) => {
    setGmails((prev) => prev.map((v, i) => (i === index ? value : v)));
  };
  const addGmail = () => setGmails((prev) => [...prev, ""]);
  const removeGmail = (index) =>
    setGmails((prev) => prev.filter((_, i) => i !== index));

  useEffect(() => {
    const arrayGmails = dataServicio?.cotizacion?.cliente?.gmails;
    const singleGmail = dataServicio?.cotizacion?.cliente?.gmail;
    let list = [];
    if (Array.isArray(arrayGmails) && arrayGmails.length > 0) {
      list = arrayGmails.map((e) => (typeof e === "string" ? e : e?.gmail || ""));
    } else if (singleGmail) {
      list = [singleGmail];
    } else {
      list = [""];
    }
    setGmails(list);
  }, [dataServicio?.cotizacion?.cliente?.gmails, dataServicio?.cotizacion?.cliente?.gmail]);

  if (!dataServicio)
    return (
      <div>
        <Loading />
      </div>
    );
  if (typeof dataServicio != "object") return <>no existe el servicio</>;

  return (
    <div className="space-y-5">

      <div className="flex md:flex-row flex-col gap-4 justify-between md:center text-xs">
        <span className="font-semibold dark:text-slate-200">{dataServicio.servicio.name}</span>
        <span className="font-semibold dark:text-slate-200">Plan: <span className="font-bold dark:text-white">{dataServicio.planServicio.name}</span></span>
        <span className="font-semibold dark:text-slate-200">Estado: <span className="font-bold dark:text-white">{dataServicio.estado}</span></span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card title="Descripción del servicio" icon="/letterservices.svg" className="flex text-xs flex-col w-full bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">
          <div className="flex flex-col justify-between text-xs">
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
            {/* end flex */}
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
                <div className="text-xs text-warning-500 dark:text-warning-400">
                  {format(new Date(dataServicio.fechaFin), "dd MMMM, yyyy", {
                    locale: es,
                  })}
                </div>
              </div>
              {/* end single */}
            </div>
          </div>
        </Card>

        <Card title="Detalles" icon="/lt2.svg" className="flex flex-col w-full bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">
          <div className="flex flex-col !space-y-4 text-xs">
            <span className="font-medium dark:text-slate-200">Encargad@s</span>
            <ul className=" divide-slate-100 dark:divide-slate-700">
              <li className="px-4 py-2  border-[1px] rounded-md border-[#f0f0f2]">
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
                    <span className="inline-flex items-center gap-2 bg-[#f4ffef] dark:bg-green-900 px-4 py-2 rounded-lg">
                      <img src="/state.svg" alt="Responsable" className="w-3 h-3" />
                      <span className="text-[#16213E] dark:text-green-200 font-semibold text-xs">Responsable</span>
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
                        className="px-4 py-2 w-[49%] border-[1px] rounded-md border-[#f0f0f2]"
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

          <div className="flex flex-col !space-y-4 !py-4 text-xs">
            <span className="font-medium dark:text-slate-200 text-xs">Datos adicionales</span>
            <div>
              <ul className="flex flex-col space-y-2">
                {dataServicio?.fechaFin && (
                  <li className="flex flex-row justify-between items-center">
                    <span className="text-xs font-medium dark:text-slate-300">
                      Días para la entrega:{" "}
                    </span>
                    <span className="text-sm dark:text-slate-200 ">
                      {differenceInDays(
                        parseISO(dataServicio?.fechaFin),
                        new Date()
                      )}
                    </span>
                  </li>
                )}

                <li className="flex flex-row justify-between items-center">
                                      <span className="text-xs font-medium dark:text-slate-300">
                      Duración hasta la fecha:{" "}
                    </span>
                    <span className="text-xs dark:text-slate-200 ">
                    {differenceInDays(
                      new Date(),
                      parseISO(dataServicio.fechaInicio)
                    )}
                  </span>
                </li>

                <li className="flex flex-row justify-between items-center">
                    <span className="text-xs font-medium dark:text-slate-300">
                      Información enviada:{" "}
                    </span>
                    <span className="text-xs dark:text-slate-200 ">
                    {dataServicio.informacionEnviada}
                  </span>
                </li>

                <li className="flex flex-row justify-between items-center">
                    <span className="text-xs font-medium dark:text-slate-300">
                      Capacitación hecha:{" "}
                    </span>
                    <span className="text-xs dark:text-slate-200 ">
                    {dataServicio.capacitacionHecha}
                  </span>
                </li>

                <li className="flex flex-row justify-between items-center">
                    <span className="text-xs font-medium dark:text-slate-300">Sub-area: </span>
                    <span className="text-xs dark:text-slate-200 ">{dataServicio.subarea}</span>
                </li>
                <li className="flex flex-row justify-between items-center">
                    <span className="text-xs font-medium dark:text-slate-300">Plantilla: </span>
                    <span className="text-xs dark:text-slate-200 ">
                      {dataServicio.servicio.template}
                    </span>
                </li>
                <li className="flex flex-row justify-between items-center">
                    <span className="text-xs font-medium dark:text-slate-300">Categoría: </span>
                    <span className="text-xs dark:text-slate-200 ">
                      {dataServicio.servicio.categoria}
                    </span>
                </li>
                <li className="flex flex-row justify-between items-center">
                    <span className="text-xs font-medium dark:text-slate-300">Activo: </span>
                    <span className="text-xs dark:text-slate-200 ">
                      {dataServicio.active ? "Si" : "No"}
                    </span>
                </li>

                <li className="flex flex-row justify-between items-center">
                    <span className="text-xs font-medium dark:text-slate-300">
                      Es cuenta publicitaria:{" "}
                    </span>
                    <span className="text-xs dark:text-slate-200 ">
                      {dataServicio.isCuentaPublicitaria ? "Si" : "No"}
                    </span>
                </li>
                <li>
                  <hr className="border-slate-200 dark:border-slate-700" />
                </li>
              </ul>
            </div>

            <span className="font-medium dark:text-slate-200 text-xs">Facturación</span>
            <div>
              <ul className="flex flex-col space-y-2">
                <li className="flex flex-row justify-between items-center">
                  <span className="text-xs font-medium dark:text-slate-300">Tipo de pago: </span>
                  <span className="text-xs dark:text-slate-200 ">
                    {dataServicio.servicio.tipoPago}
                  </span>
                </li>
                <li className="flex flex-row justify-between items-center">
                  <span className="text-xs font-medium dark:text-slate-300">Facturación: </span>
                  <span className="text-xs dark:text-slate-200 ">{dataServicio.facturacion}</span>
                </li>
                <li className="flex flex-row justify-between items-center">
                  <span className="text-xs font-medium dark:text-slate-300">IGV: </span>
                  <span className="text-xs dark:text-slate-200 ">{dataServicio.igv}</span>
                </li>
                <li className="flex flex-row justify-between items-center">
                  <span className="text-xs font-medium dark:text-slate-300">Precio: </span>
                  <span className="text-xs dark:text-slate-200 ">{dataServicio.customPrice}</span>
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
          <ProyectLinks 
            servicioData={dataServicio} 
            serviceForm={serviceForm}
            webOficialLink={webOficialLink}
            demoLink={demoLink}
            capacitacionLink={capacitacionLink}
          />
        </Card>

        <Card title="Datos del cliente" icon="/letterservices.svg" className="flex text-xs flex-col w-full bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">
         <span className="font-medium dark:text-slate-200">Gmail para acceso a carpetas de Google Drive</span>
          <div className="mt-2 space-y-2">
            {gmails.map((email, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <div className="flex-1">
                  <Textinput
                    type="email"
                    label={`Correo Gmail ${idx + 1}`}
                    placeholder="tuusuario@gmail.com"
                    classLabel="text-xs"
                    defaultValue={email}
                    onChange={(e) => handleGmailChange(idx, e.target.value)}
                    error={gmailsErrors[idx]}
                    id={`gmail-input-${idx}`}
                    pattern="^[a-zA-Z0-9._%+-]+@gmail\\.com$"
                    title="Ingrese un correo que termine en @gmail.com"
                    className="text-xs"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeGmail(idx)}
                  disabled={gmails.length <= 1}
                  className="px-2 py-2 h-9 mt-[15px] rounded-md bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 disabled:opacity-50"
                >
                  Eliminar
                </button>
              </div>
            ))}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={addGmail}
                className="px-3 py-2 rounded-md bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-200 hover:bg-slate-300"
              >
                Añadir correo
              </button>
              <button
                type="button"
                onClick={UpdateClient}
                disabled={gmailsErrors.some((e) => e) || gmails.every((v) => !v || v.trim() === "")}
                className="px-3 py-2 rounded-md bg-primary-500 text-white hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Guardar
              </button>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-5">

        <div className="xl:col-span-8 lg:col-span-7 col-span-12">
          <Card title="Seguimiento de tareas" icon="/lt2.svg" noborder className="overflow-x-auto bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">
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
              <tbody className="text-xs">
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

          <Card title="Reuniones y meets" icon="/letterservices.svg" headerslot={<SelectMonth />} className="dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200">
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
                    Checklist audios:
                  </span>
                  {dataServicio?.checklistMedia?.map((media, i) => {
                    return (
                      <div key={media.id} className="flex flex-col gap-1">
                        <span className="text-xs flex flex-row gap-2 items-center font-semibold dark:text-slate-400 text-slate-600 mb-1">
                          <FaVolumeUp /> Audio {i + 1}
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

export default HistorialServicioDetails;
