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
import { FaUser } from "react-icons/fa";
import banner from "../../assets/images/all-img/Banner-Google.webp";
import { BackgroundColorStatusMap, itemColorStatusMap } from "../../utils/ColorData";

const ServicioDetails = () => {
  const { id } = useParams();
  const [dataServicio, setDataServicio] = useState(null);
  const [citasList, setCitasList] = useState([]);
  const [integrantes, setIntegrantes] = useState([]);

  const [tareasList, setTareasList] = useState([]);
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
                      equals: "Finalizado",
                    },
                  },
                  {
                    status: {
                      equals: "Con retraso",
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

      // const response = await axios.get(
      //   `${BACKEND}/etapaTareaServicioCotizaciones?where[servicio][equals]=${id}&limit=10000&depth=0&where[not_equals]=Eliminado`
      // );
      const response = await axios.get(
        `${BACKEND}/tareasProyectos${stringifiedQuery}`
      );

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

  const getCitas = async () => {
    try {
      const response = await axios.get(
        `${BACKEND}/serviciosCotizacionesCitas?limit=1000&where[servicioCotizacion][equals]=${id}&sort=createdAt`
      );
      setCitasList(response.data.docs);
      console.log(response.data.docs);
    } catch (error) {}
  };

  useEffect(() => {
    getTotalTasks();
    getCitas();
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

  if (!dataServicio)
    return (
      <div>
        <Loading />
      </div>
    );
  if (typeof dataServicio != "object") return <>no existe el servicio</>;

  return (
    <div className=" space-y-5">
      {/* Header */}

      <div className="flex flex-row justify-start items-start border bg-white p-4 rounded-md px-8">
        
        <div className="flex flex-col gap-1 w-1/5">
          <span className="text-xs text-gray-500" > 
            Plan
          </span>
          <span className="text-xs font-medium text-slate-700" > 
            {dataServicio.planServicio.name}
          </span>
        </div>

        <div className="flex flex-col gap-1 border-l border-gray-200 pl-4 w-1/5">
          <span className="text-xs text-gray-500" > 
            Estado
          </span>

          <div className={`${BackgroundColorStatusMap[dataServicio.estado]} flex flex-row items-center justify-center gap-2 px-3 py-1 rounded-md w-fit `}>
          <div className={`w-2 h-2 ${itemColorStatusMap[dataServicio.estado]} rounded-full animate-pulse`}></div>
          <span className="text-slate-800 text-xs font-medium">{dataServicio.estado}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1 border-l border-gray-200 pl-4 w-1/5">
          <span className="text-xs text-gray-500" > 
            Fecha inicio
          </span>
          <div className="flex flex-row items-center justify-start gap-2">
            <Icon icon="heroicons-outline:calendar" className="text-slate-600 dark:text-slate-400" />
            <span className="block text-xs font-medium">
              {format(new Date(dataServicio.fechaInicio), "dd MMMM , yyyy", {
                locale: es,
              })}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1 border-l border-gray-200 pl-4 w-1/5">
          <span className="text-xs text-gray-500" > 
            Fecha fin
          </span>
          <div className="flex flex-row items-center justify-start gap-2">
            <Icon icon="heroicons-outline:calendar" className="text-slate-600 dark:text-slate-400" />
            <span className="block text-xs font-medium">
              {format(new Date(dataServicio.fechaFin), "dd MMMM , yyyy", {
                locale: es,
              })}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-1 border-l border-gray-200 pl-4 w-1/5">
          <span className="text-xs text-gray-500" > 
            Cotización
          </span>
          <div className="flex flex-row gap-2 items-center hover:cursor-pointer">
            <Icon icon="heroicons-outline:eye" className="text-blue-500 dark:text-blue-500" />
            <span className="text-sm font-medium text-slate-700" > 
              Previsualizar
            </span>
          </div>
        </div>
      </div>

      <div className="flex md:flex-row flex-col gap-5">
        {/* <Card className="xl:col-span-3 col-span-12 lg:col-span-5 h-full">
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
            <GroupChart4
              statistics={[
                {
                  title: "Tareas Totales",
                  count: totalTasks.toString(),
                  bg: "bg-info-500",
                  text: "text-info-500",
                  percent: "25.67% ",
                  icon: "heroicons-outline:menu-alt-1",
                },
                {
                  title: "Tareas pendientes ",
                  count: totalTasksPending.toString(),

                  bg: "bg-warning-500",
                  text: "text-warning-500",
                  percent: "8.67%",
                  icon: "heroicons-outline:chart-pie",
                },

                {
                  title: "Tareas completadas",
                  count: totalTasksCompleted.toString(),
                  bg: "bg-success-500 col-span-2",
                  text: "text-success-500",
                  percent: "11.67%  ",
                  icon: "heroicons-outline:calculator",
                },
              ]}
            />
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-md p-4 mt-4">
            <span className="block dark:text-slate-400 text-sm text-slate-600">
              Progress
            </span>
            <DonutChart total={totalTasks} completed={totalTasksCompleted} />
          </div>
        </Card> */}
        {/* end single column*/}
        <Card title="Descripción del servicio" className="flex flex-col w-full">
          <div className="flex flex-col justify-between">
            {/* <div className="text-base font-medium text-slate-800 dark:text-slate-100 mb-3">
              Descripción del servicio
            </div> */}

            <p className="text-sm text-slate-600 dark:text-slate-300  whitespace-pre-line">
              {dataServicio.customDescriptionActive
                ? dataServicio?.customDescriptionText
                : dataServicio.servicio.preciosUnitarios.find(
                    (serv) => serv.plan.id === dataServicio.planServicio.id
                  )?.descripcion}
            </p>
            {/* <div className="flex flex-wrap mt-8">
              <div className="xl:mr-8 mr-4 mb-3 space-y-1">
                <div className="font-semibold text-slate-500 dark:text-slate-400">
                  Existing website
                </div>
                <div className="flex items-center space-x-2 text-xs font-normal text-primary-600 dark:text-slate-300 rtl:space-x-reverse">
                  <Icon icon="heroicons:link" />
                  <a href="#">www.example.com</a>
                </div>
              </div>
              <div className="xl:mr-8 mr-4 mb-3 space-y-1">
                <div className="font-semibold text-slate-500 dark:text-slate-400">
                  Project brief
                </div>
                <div className="flex items-center space-x-2 text-xs font-normal text-primary-600 dark:text-slate-300 rtl:space-x-reverse">
                  <Icon icon="heroicons:link" />
                  <a href="#">www.example.com</a>
                </div>
              </div>
            </div> */}
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
              {/* end single */}
              {/* <div className="mr-3 mb-3 space-y-2">
                <div className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  Budget
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-300">
                  $75,800
                </div>
              </div> */}
              {/* end single */}
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

        <Card title="Detalles" className="flex flex-col w-full">
          {/* <div className="-mx-6 custom-calender mb-6">
            <CalendarView />
          </div> */}
          <div className="flex flex-col !space-y-4">
            <span className="font-medium">Encargad@s</span>
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
                        <span className="block text-slate-600 text-sm dark:text-slate-300 mb-1 font-medium">
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
                    <span className="inline-flex items-center space-x-1 bg-green-500 bg-opacity-[0.16] text-green-700 dark:text-green-300 text-xs font-normal px-2 py-1 rounded-full rtl:space-x-reverse">
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
                                <span className="block text-slate-600 text-sm dark:text-slate-300 mb-1 font-medium">
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
            <span className="font-medium">Datos adicionales</span>
            <div>
              <ul className="flex flex-col space-y-2">
                {dataServicio?.fechaFin && (
                  <li className="flex flex-row justify-between items-center">
                    <span className="text-sm font-medium">
                      Días para la entrega:{" "}
                    </span>
                    <span className="text-sm ">
                      {differenceInDays(
                        parseISO(dataServicio?.fechaFin),
                        new Date()
                      )}
                    </span>
                  </li>
                )}

                <li className="flex flex-row justify-between items-center">
                  <span className="text-sm font-medium">
                    Duración hasta la fecha:{" "}
                  </span>
                  <span className="text-sm ">
                    {differenceInDays(
                      new Date(),
                      parseISO(dataServicio.fechaInicio)
                    )}
                  </span>
                </li>

                <li className="flex flex-row justify-between items-center">
                  <span className="text-sm font-medium">
                    Información enviada:{" "}
                  </span>
                  <span className="text-sm ">
                    {dataServicio.informacionEnviada}
                  </span>
                </li>

                <li className="flex flex-row justify-between items-center">
                  <span className="text-sm font-medium">
                    Capacitación hecha:{" "}
                  </span>
                  <span className="text-sm ">
                    {dataServicio.capacitacionHecha}
                  </span>
                </li>

                <li className="flex flex-row justify-between items-center">
                  <span className="text-sm font-medium">Sub-area: </span>
                  <span className="text-sm ">{dataServicio.subarea}</span>
                </li>
                <li className="flex flex-row justify-between items-center">
                  <span className="text-sm font-medium">Plantilla: </span>
                  <span className="text-sm ">
                    {dataServicio.servicio.template}
                  </span>
                </li>
                <li className="flex flex-row justify-between items-center">
                  <span className="text-sm font-medium">Categoría: </span>
                  <span className="text-sm ">
                    {dataServicio.servicio.categoria}
                  </span>
                </li>
                <li className="flex flex-row justify-between items-center">
                  <span className="text-sm font-medium">Activo: </span>
                  <span className="text-sm ">
                    {dataServicio.active ? "Si" : "No"}
                  </span>
                </li>

                <li className="flex flex-row justify-between items-center">
                  <span className="text-sm font-medium">
                    Es cuenta publicitaria:{" "}
                  </span>
                  <span className="text-sm ">
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
                  <hr />
                </li>
              </ul>
            </div>

            <span className="font-medium">Facturación</span>
            <div>
              <ul className="flex flex-col space-y-2">
                <li className="flex flex-row justify-between items-center">
                  <span className="text-sm font-medium">Tipo de pago: </span>
                  <span className="text-sm ">
                    {dataServicio.servicio.tipoPago}
                  </span>
                </li>
                <li className="flex flex-row justify-between items-center">
                  <span className="text-sm font-medium">Facturación: </span>
                  <span className="text-sm ">{dataServicio.facturacion}</span>
                </li>

                <li className="flex flex-row justify-between items-center">
                  <span className="text-sm font-medium">IGV: </span>
                  <span className="text-sm ">{dataServicio.igv}</span>
                </li>

                <li className="flex flex-row justify-between items-center">
                  <span className="text-sm font-medium">Precio: </span>
                  <span className="text-sm ">{dataServicio.customPrice}</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
      {/* <div className="grid xl:grid-cols-3 grid-cols-1 gap-5">
        <Card title="Task list" headerslot={<SelectMonth />}>
          <TaskLists />
        </Card>
        <Card title="Messages" headerslot={<SelectMonth />}>
          <MessageList />
        </Card>
        <Card title="Activity" headerslot={<SelectMonth />}>
          <TrackingParcel />
        </Card>
      </div> */}
      <div className="grid grid-cols-12 gap-5">
        <div className="xl:col-span-8 lg:col-span-7 col-span-12">
          <Card
            title="Seguimiento de tareas"
            noborder
            className="overflow-x-auto"
          >
            {/* <TeamTable /> */}
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
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
                    className="border-b  hover:bg-gray-100 hover:dark:bg-gray-950"
                  >
                    <th
                      scope="row"
                      className="flex  items-center px-4   py-2 font-medium text-gray-700 dark:text-gray-300  "
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
                              <div className="inline-block w-3 h-3 mr-2 bg-orange-500 rounded-full"></div>
                            ) : (
                              <div className="inline-block w-3 h-3 mr-2 bg-blue-500 rounded-full"></div>
                            )}
                          </>
                        )}
                        {e.status === "Pendiente" && (
                          <>
                            {new Date(e?.limitDate) < new Date() ? (
                              //<div className="inline-block w-3 h-3 mr-2 bg-red-700 rounded-full"></div>
                              <div className="inline-block w-3 h-3 mr-2 bg-orange-500 rounded-full"></div>
                            ) : (
                              <div className="inline-block w-3 h-3 mr-2 bg-orange-500 rounded-full"></div>
                            )}
                          </>
                        )}
                        {e.status === "Finalizado" && (
                          <div className="inline-block w-3 h-3 mr-2 bg-green-500 rounded-full"></div>
                        )}
                        {e.status === "Con retraso" && (
                          <div className="inline-block w-3 h-3 mr-2 bg-green-500 rounded-full"></div>
                        )}
                        {e.status === "Eliminado" && (
                          <div className="inline-block w-3 h-3 mr-2 bg-black rounded-full"></div>
                        )}
                        <span className="ml-1 text-gray-500 ">
                          {e.status === "Eliminado"
                            ? "Eliminado"
                            : e.status === "Finalizado"
                            ? "Finalizado"
                            : e.status === "Con retraso"
                            ? "Finalizado"
                            : new Date(e.limitDate) < new Date()
                            ? //? "Incumplido"
                              "Pendiente"
                            : e.status}
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

          <Card title="Actividad" headerslot={<SelectMonth />}>
            <ActividadServicio lists={tareasList} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ServicioDetails;
