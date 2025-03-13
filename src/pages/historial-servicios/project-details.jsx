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
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { MdCheck, MdOutlineWorkOutline } from "react-icons/md";
import { convertFirstLetterCapital } from "../../helpers/stringsHelper";
import EtapasTareasSeguimiento from "../../components/modules/servicios/EtapasTareasSeguimiento";
import ActividadServicio from "../../components/modules/servicios/Actividad";
import Reuniones from "../../components/modules/servicios/Reuniones";

const HistorialServicioDetails = () => {
  const { id } = useParams();
  const [dataServicio, setDataServicio] = useState(null);
  const [citasList, setCitasList] = useState([]);
  const [totalTasks, setTotalTasks] = useState(10);
  const [totalTasksCompleted, setTotalTasksCompleted] = useState(0);

  const [trabajadoresList, setTrabajadoresList] = useState([]);
  const [tareasList, setTareasList] = useState([]);
  useEffect(() => {}, []);
  const getTotalTasksCompleted = async () => {
    try {
      const response = await axios.get(
        `${BACKEND}/etapaTareaServicioCotizaciones?where[servicio][equals]=${id}&limit=10000&depth=0&where[equals]=Finalizado`
      );
      setTotalTasksCompleted(response.data.totalDocs);
    } catch (error) {}
  };
  const getTotalTasks = async () => {
    try {
      const response = await axios.get(
        `${BACKEND}/etapaTareaServicioCotizaciones?where[servicio][equals]=${id}&limit=10000&depth=0&where[not_equals]=Eliminado`
      );
      setTotalTasks(response.data.totalDocs);
    } catch (error) {}
  };

  const getTrabajadores = async () => {
    try {
      const response = await axios.get(`${BACKEND}/trabajadores?limit=1000`);
      setTrabajadoresList(response.data.docs);
    } catch (error) {}
  };

  const getTareas = async () => {
    try {
      const response = await axios.get(
        `${BACKEND}/etapaTareaServicioCotizaciones?limit=1000&where[servicio][equals]=${id}&sort=createdAt`
      );
      setTareasList(response.data.docs);
    } catch (error) {}
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
    getTotalTasksCompleted();
    getTrabajadores();
    getTareas();
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
      <div className="grid grid-cols-12 gap-5">
        <Card className="xl:col-span-3 col-span-12 lg:col-span-5 h-full">
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
                  count: (totalTasks - totalTasksCompleted).toString(),

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
        </Card>
        {/* end single column*/}
        <Card
          title="Detalles"
          className="xl:col-span-5 col-span-12 lg:col-span-7 h-full"
        >
          <div>
            <div className="text-base font-medium text-slate-800 dark:text-slate-100 mb-3">
              Descripción del servicio
            </div>

            <br />
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
        <Card title="Encargados " className="xl:col-span-4 col-span-12">
          {/* <div className="-mx-6 custom-calender mb-6">
            <CalendarView />
          </div> */}
          <ul className="divide-y divide-slate-100 dark:divide-slate-700">
            <li className="block py-[10px]">
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
            {dataServicio.integrantes &&
              dataServicio?.integrantes.length > 0 &&
              dataServicio?.integrantes.map((item, i) => (
                <li key={i} className="block py-[10px]">
                  <div className="flex space-x-2 rtl:space-x-reverse">
                    {typeof item.usuario === "object" ? (
                      <div className="flex-1 flex space-x-2 rtl:space-x-reverse">
                        <div className="flex-none">
                          {item.usuario.foto ? (
                            <img
                              src={
                                trabajadoresList.find(
                                  (trab) => trab.id === item.usuario.id
                                )?.foto.url
                              }
                              alt={"Encargado servicio"}
                              className=" rounded-full h-8 w-8 object-cover "
                            />
                          ) : (
                            <div className="h-full w-10 rounded-md text-lg bg-slate-100 text-slate-900 dark:bg-slate-600 dark:text-slate-200 flex flex-col items-center justify-center font-normal capitalize">
                              {item.usuario.name.charAt(0) +
                                item.usuario.name.charAt(1)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <span className="block text-slate-600 text-sm dark:text-slate-300 mb-1 font-medium">
                            {item.usuario.name}
                          </span>
                          <span className="flex font-normal text-xs dark:text-slate-400 text-slate-500">
                            <span className="text-base inline-block mr-1">
                              <MdOutlineWorkOutline />
                            </span>
                            {item.usuario?.puesto}
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
              ))}
          </ul>
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
          <Card title="Seguimiento de tareas" noborder>
            {/* <TeamTable /> */}
            <EtapasTareasSeguimiento idServicio={id} />
          </Card>
        </div>
        <div className="xl:col-span-4 lg:col-span-5 flex flex-col gap-5 col-span-12">
          <Card title="Reuniones" headerslot={<SelectMonth />}>
            <Reuniones lists={citasList} />
          </Card>
          <Card title="Actividad" headerslot={<SelectMonth />}>
            <ActividadServicio lists={tareasList} />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HistorialServicioDetails;
