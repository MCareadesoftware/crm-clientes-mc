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
const ProjectGrid = ({ project }) => {
  project;

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
    navigate(`/historial-servicios/${project.id}`);
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
    <div className="hover:cursor-pointer" onClick={() => handleClick(project)} tabIndex={0} role="button" aria-label={`Ver detalles de ${project.servicio.name}`}> 
      <Card className="p-5 rounded-xl border border-slate-100 shadow-sm bg-white transition hover:shadow-md relative dark:bg-slate-800 dark:border-slate-700">
        {/* Plan en la esquina superior derecha */}
        <span className="absolute top-4 right-4 text-xs text-slate-500 font-medium dark:text-white">Plan {project.planServicio?.name}</span>
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div className="h-8 w-8 rounded bg-[#FE6400] flex items-center justify-center text-white font-bold text-sm">
            {project.servicio.name.charAt(0)}{project.servicio.name.charAt(1)}
          </div>
          <span className="font-semibold text-slate-900 text-base dark:text-white">{project.servicio.name}</span>
          {/* <span className="text-slate-600 dark:text-slate-400 text-sm ">{project.planServicio?.name}</span> */}
        </div>
          {/* <div>
          <Dropdown
            classMenuItems=" w-[130px]"
            label={
              <span className="text-lg inline-flex flex-col items-center justify-center h-8 w-8 rounded-full bg-gray-500-f7 dark:bg-slate-900 dark:text-slate-400">
                <Icon icon="heroicons-outline:dots-vertical" />
              </span>
            }
          >
            <div>
              <Menu.Item onClick={() => handleClick(project)}>
                <div
                  className="hover:bg-slate-900 dark:hover:bg-slate-600 dark:hover:bg-opacity-70 hover:text-white
                   w-full border-b border-b-gray-500 border-opacity-10   px-4 py-2 text-sm dark:text-slate-300  last:mb-0 cursor-pointer first:rounded-t last:rounded-b flex  space-x-2 items-center
                     capitalize rtl:space-x-reverse"
                >
                  <span className="text-base">
                    <Icon icon="heroicons:eye" />
                  </span>
                  <span>Ver</span>
                </div>
              </Menu.Item>
              
            </div>
          </Dropdown>
        </div> */}
        {/* Estado */}
        <div className="mb-2 flex items-center gap-2">
          <span className="text-xs text-slate-700 dark:text-white">Estado:</span>
          <span className={`
            ${
              project.estado == "Terminado con exito"
                ? "text-green-500"
                : project.estado == "Abandonado"
                ? "text-orange-600"
                : project.estado == "Congelado"
                ? "text-blue-400"
                : "text-gray-700"
            }
          `}>
            {project.estado}
          </span>
        </div>
        {/* Fechas */}
        <div className="flex items-center mb-3">
          <div className="flex-1 flex flex-col text-xs text-slate-700 dark:text-white">
            <span className="text-slate-500 dark:text-white">Fecha inicio:</span>
            <div className="flex items-center gap-1 mt-1">
              <svg className="w-4 h-4 text-slate-400 dark:text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
              <span className="text-slate-900 font-bold dark:text-white">{format(new Date(project.fechaInicio), "d 'de' MMMM, yyyy", { locale: es })}</span>
            </div>
          </div>
          <div className="h-7 border-l border-slate-200 mx-3 dark:border-slate-600"></div>
          <div className="flex-1 flex flex-col text-xs text-slate-700 dark:text-white">
            <span className="text-slate-500 dark:text-white">Fecha fin:</span>
            <div className="flex items-center gap-1 mt-1">
              <svg className="w-4 h-4 text-slate-400 dark:text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
              <span className="text-slate-900 font-bold dark:text-white">{format(new Date(project.fechaFin), "d 'de' MMMM, yyyy", { locale: es })}</span>
            </div>
          </div>
        </div>
        {/* progress bar */}
        {/* <div className="ltr:text-right rtl:text-left text-xs text-slate-600 dark:text-slate-300 mb-1 font-medium">
          100 %
        </div>
        <ProgressBar value={100} className="bg-primary-500" /> */}
        {/* Encargado */}
        <div className="text-xs text-slate-700 mb-1 dark:text-white mt-8">Encargado:</div>
        <div className="flex items-center gap-2">
          {project.responsable?.foto?.url ? (
            <img src={project.responsable.foto.url} alt="Encargado" className="h-7 w-7 rounded-full object-cover" />
          ) : (
            <div className="h-7 w-7 rounded-full bg-[#FE6400] text-white flex items-center justify-center font-bold text-xs">
              {project.responsable?.name?.charAt(0)}{project.responsable?.name?.charAt(1)}
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#072142] leading-tight dark:text-white">{convertFirstLetterCapital(project.responsable?.name)}</span>
            <span className="text-xs text-slate-400 leading-tight dark:text-white/70">{convertFirstLetterCapital(project.responsable?.puesto)}</span>
          </div>
        </div>
        {/* <div className="flex justify-start -space-x-1.5 rtl:space-x-reverse">
          {assignee?.map((user, userIndex) => (
            <div
              className="h-6 w-6 rounded-full ring-1 ring-slate-100"
              key={userIndex}
            >
              <img
                src={user.image}
                alt={user.label}
                className="w-full h-full rounded-full"
              />
            </div>
          ))}
          <div className="bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-300 text-xs ring-2 ring-slate-100 dark:ring-slate-700 rounded-full h-6 w-6 flex flex-col justify-center items-center">
            +2
          </div>
        </div> */}
        {/* total date */}
        <div className="ltr:text-right rtl:text-left">
          <span className="inline-flex items-center space-x-1 bg-green-500 bg-opacity-[0.16] text-green-500 text-xs font-normal px-2 py-1 rounded-full rtl:space-x-reverse">
            Finalizado
          </span>
        </div>
      </Card>
    </div>
  );
};

export default ProjectGrid;
