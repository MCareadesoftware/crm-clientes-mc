import React, { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Dropdown from "@/components/ui/Dropdown";
// import menu form headless ui
import { Menu } from "@headlessui/react";
import Icon from "@/components/ui/Icon";
import ProgressBar from "@/components/ui/ProgressBar";
import { removeProject, updateProject } from "./store";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { differenceInDays, format } from "date-fns";
import { es } from "date-fns/locale";
import axios from "axios";
import { BACKEND } from "../../configs/envConfig";
import { convertFirstLetterCapital } from "../../helpers/stringsHelper";
import { BackgroundColorStatusMap, itemColorStatusMap, TextColorStatusMap } from "../../utils/ColorData";
const ProjectGrid = ({ project }) => {
  project;
  const dispatch = useDispatch();

  const [start, setStart] = useState(new Date(project.fechaInicio));
  const [end, setEnd] = useState(new Date(project.fechaFin));
  const [totaldays, setTotaldays] = useState(0);

  const [totalTasks, setTotalTasks] = useState(10);
  const [totalTasksCompleted, setTotalTasksCompleted] = useState(0);

  useEffect(() => {
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setTotaldays(diffDays);
  }, [start, end]);

  const navigate = useNavigate();
  // handleClick to view project single page
  const handleClick = (project) => {
    navigate(`/servicios-activos/${project.id}`);
  };

  useEffect(() => {}, []);
  const getTotalTasksCompleted = async () => {
    const response = await axios.get(
      `${BACKEND}/etapaTareaServicioCotizaciones?where[servicio][equals]=${project.id}&limit=10000&depth=0&where[equals]=Finalizado`
    );
    setTotalTasksCompleted(response.data.totalDocs);
  };
  const getTotalTasks = async () => {
    const response = await axios.get(
      `${BACKEND}/etapaTareaServicioCotizaciones?where[servicio][equals]=${project.id}&limit=10000&depth=0&where[not_equals]=Eliminado`
    );
    if (response.data.totalDocs !== 0) setTotalTasks(response.data.totalDocs);
  };

  useEffect(() => {
    getTotalTasks();
    getTotalTasksCompleted();
  }, []);

  return (
    <div>
      <Card>
        {/* Header */}
        <header className="flex justify-between items-center">
          <div className="flex space-x-4 items-center rtl:space-x-reverse">
            <div className="flex-none">
              <div className="h-8 w-8 bg-orange-500 rounded-md text-sm text-white dark:bg-slate-600 dark:text-slate-200 flex flex-col items-center justify-center font-normal capitalize">
                {project.servicio.name.charAt(0) +
                  project.servicio.name.charAt(1)}
              </div>
            </div>
            <div className="font-medium text-base leading-6">
              <div className="dark:text-gray-200 text-gray-900 max-w-[160px] truncate">
                {project.servicio.name}
              </div>
            </div>
          </div>
          {/* description */}
          <div className="text-slate-600 dark:text-slate-400 text-sm ">
            Plan {project.planServicio?.name}
          </div>
        </header>

        {/* Estado */}
        <div className="flex flex-col gap-1 w-full py-2">
          <span className="font-medium text-xs">Estado:</span>
          <div className={`flex flex-row gap-2`}>
            <div className={`${BackgroundColorStatusMap[project.estado]} flex flex-row items-center justify-center gap-2 px-3 py-1 rounded-md`}>
              <div className={`w-2 h-2 ${itemColorStatusMap[project.estado]} rounded-full animate-pulse`}></div>
              <span className="text-slate-800 text-xs font-medium">{project.estado}</span>
            </div>
            {project.estado !== "Terminado con exito" && (
              <div className="bg-green-100 flex flex-row items-center justify-center gap-2 px-3 py-1 rounded-md">
                <div className={`w-2 h-2 bg-green-500 rounded-full animate-pulse`}></div>
                <span className="text-slate-800 text-xs font-medium">
                  {differenceInDays(new Date(project.fechaFin), new Date())} días restantes
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Fechas */}
        <div className="flex space-x-4 gap-1 rtl:space-x-reverse py-2">

          {/* start date */}
          <div className="flex flex-col gap-1">
            <span className="block text-xs font-medium text-slate-600 dark:text-slate-400">Fecha Inicio</span>
            <div className="flex flex-row items-center justify-center gap-2">
              <Icon icon="heroicons-outline:calendar" className="text-slate-600 dark:text-slate-400" />
              <span className="block text-xs font-medium">
                {format(new Date(project.fechaInicio), "dd MMMM , yyyy", {
                  locale: es,
                })}
              </span>
            </div>
          </div>

          <div className="w-px h-full bg-gray-300 dark:bg-slate-600"></div>
          
          {/* end date */}
          <div className="flex flex-col gap-1">
            <span className="block text-xs font-medium text-slate-600 dark:text-slate-400">Fecha fin</span>
            <div className="flex flex-row items-center justify-center gap-2">
              <Icon icon="heroicons-outline:calendar" className="text-slate-600 dark:text-slate-400" />
              <span className="block text-xs font-medium">
                {format(new Date(project.fechaFin), "dd MMMM , yyyy", {
                  locale: es,
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Enbargado */}
        <div className="grid grid-cols-2 gap-1 py-2">
          {/* assignee */}
          {typeof project.responsable === "object" && (
            <div>
              <div className="text-slate-600 dark:text-slate-400 text-xs font-normal mb-1">
                Encargado
              </div>
              <div className=" flex justify-start items-center gap-2 ">
                {project.responsable.foto ? (
                  <img
                    src={project.responsable.foto.url}
                    alt={"Encargado servicio"}
                    className=" rounded-full h-8 w-8 object-cover "
                  />
                ) : (
                  <div className="h-8 w-8 rounded-md text-lg bg-slate-100 text-slate-900 dark:bg-slate-600 dark:text-slate-200 flex flex-col items-center justify-center font-normal capitalize">
                    {project.responsable.name.charAt(0) +
                      project.responsable.name.charAt(1)}
                  </div>
                )}

                <div className="  flex flex-col w-full ">
                  <span className=" text-sm font-medium">
                    {convertFirstLetterCapital(project.responsable.name)}
                  </span>
                  <span
                    style={{ fontSize: "0.6em" }}
                    className=" whitespace-nowrap  text-slate-600 dark:text-slate-400"
                  >
                    {convertFirstLetterCapital(project.responsable.puesto)}
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>
        
        <hr className="my-4" />

        {/* Ver cotización y ver más */}
        <div className="flex flex-row gap-2 justify-between">
          <div className="flex flex-row gap-2 hover:cursor-pointer">
            <Icon icon="heroicons-outline:eye" className="text-orange-500 dark:text-orange-500" />
            <span className="text-slate-600 dark:text-slate-400 text-xs font-medium">Ver cotización</span>
          </div>
          <div className="flex flex-row gap-2 hover:cursor-pointer"  onClick={() => handleClick(project)}>
            <span className="text-slate-600 dark:text-slate-400 text-xs font-medium">Ver más</span>
            <Icon icon="heroicons-outline:arrow-right" className="text-orange-500 dark:text-orange-500" />
          </div>

        </div>
      </Card>
    </div>
  );
};

export default ProjectGrid;
