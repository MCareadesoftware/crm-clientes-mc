import React, { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import Dropdown from "@/components/ui/Dropdown";
// import menu form headless ui
import { Menu } from "@headlessui/react";
import Icon from "@/components/ui/Icon";
import ProgressBar from "@/components/ui/ProgressBar";
import { removeProject, updateProject } from "./store";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { differenceInDays, format } from "date-fns";
import { es } from "date-fns/locale";
import axios from "axios";
import { BACKEND } from "../../configs/envConfig";
import { convertFirstLetterCapital } from "../../helpers/stringsHelper";
import { FaArrowRight, FaCheck, FaClock, FaEye } from "react-icons/fa";
const EncuestaGrid = ({ project }) => {
  const dispatch = useDispatch();

  const [start] = useState(new Date(project.fechaInicio));
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
      `${BACKEND}/etapaTareaServicioCotizaciones?where[servicio][equals]=${project.servicioCotizacion.id}&limit=10000&depth=0&where[equals]=Finalizado`
    );
    setTotalTasksCompleted(response.data.totalDocs);
  };

  const getTotalTasks = async () => {
    const response = await axios.get(
      `${BACKEND}/etapaTareaServicioCotizaciones?where[servicio][equals]=${project.servicioCotizacion.id}&limit=10000&depth=0&where[not_equals]=Eliminado`
    );
    if (response.data.totalDocs !== 0) setTotalTasks(response.data.totalDocs);
  };

  useEffect(() => {
    getTotalTasks();
    getTotalTasksCompleted();
  }, []);

  console.log(project)

  return (
    <Card>

      {/* header */}
      <header className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-md flex items-center justify-center" style={{ backgroundColor: "#FE6400" }}>
            <span className="text-white font-bold">
              {project.formulario.servicio?.name.slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div className="ml-3">
            <div className="font-bold text-xs dark:text-slate-200">
              {project.formulario.servicio?.name}
            </div>
          </div>
        </div>
      </header>

      {/* description */}
      <div className="mt-4">
        <div className="text-xs text-slate-600 dark:text-slate-400">
          Formulario de {project.formulario?.tipo === "entrada" && "entrada"}{" "}
          {project.formulario?.tipo === "satisfaccion" && "satisfacción"}
        </div>

        <div className="flex mt-2">
          <div className="flex">
            {project.respondido ? (
              <Link
                to={`/encuestas/answer/${project.id}`}
                className=" bg-green-50 dark:bg-green-700 hover:bg-green-100 dark:hover:bg-green-800 text-green-600 dark:text-white font-bold px-3 py-1 rounded-full flex items-center text-xs transition-colors"
              >
                <span className="flex flex-row items-center justify-center gap-1">Ver respuestas <FaEye className="ml-1" /></span>
              </Link>
            ) : (
              <Link
                to={`/encuestas/answer/${project.id}?idform=${project?.formulario.id}`}
                className="bg-blue-50 dark:bg-blue-700 hover:bg-blue-100 dark:hover:bg-blue-800 text-blue-600 dark:text-white font-bold px-3 py-1 rounded-full flex items-center text-xs transition-colors"
              >
                <span>Responder</span>
                <svg className="ml-1.5 w-4 h-4 text-blue-600 dark:text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* description */}
      <div className="text-slate-600 dark:text-slate-400 text-xs pt-4">
        Plan {project.servicioCotizacion.planServicio?.name}
      </div>

      {/* assignee */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div>
          <span className="block text-xs text-slate-500 dark:text-slate-400">Fecha Inicio</span>
          <div className="flex items-center mt-1">
            <Icon icon="heroicons-outline:calendar" className="text-slate-400 mr-2" />
            <span className="text-xs font-medium">
            {format(
              new Date(project.servicioCotizacion.fechaInicio),
                "d 'de' MMMM, yyyy",
              {
                locale: es,
              }
            )}
          </span>
        </div>
        </div>
        <div>
          <span className="block text-xs text-slate-500 dark:text-slate-400">Fecha fin</span>
          <div className="flex items-center mt-1">
            <Icon icon="heroicons-outline:calendar" className="text-slate-400 mr-2" />
            <span className="text-sm font-medium">
            {format(
              new Date(project.servicioCotizacion.fechaFin),
                "d 'de' MMMM, yyyy",
              {
                locale: es,
              }
            )}
          </span>
          </div>
        </div>
      </div>

      {/* progress bar */}
      {/* <div className="mt-6">
        <span className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Estado del formulario:</span>
        <div className="flex items-center">
          <div className="w-full bg-gray-200 rounded-full h-2 flex-1">
            <div
              className="h-2 rounded-full"
              style={{ width: `${(totalTasksCompleted / totalTasks) * 100}%`, backgroundColor: "#2684FC" }}
            ></div>
          </div>
          <span className="text-xs font-medium ml-2 w-10 text-right">{(totalTasksCompleted / totalTasks) * 100}%</span>
        </div>
      </div> */}

      {/* assignee and total date */}
      <div className="mt-6">
        <span className="block text-xs text-slate-500 dark:text-slate-400 mb-2">Encargado:</span>
        <div className="flex items-center">
        <div className="flex items-center gap-2">
          {project.servicioCotizacion.responsable?.foto?.url ? (
            <img src={project.servicioCotizacion?.responsable?.foto?.url} alt="Encargado" className="h-7 w-7 rounded-full object-cover" />
          ) : (
            <div className="h-7 w-7 rounded-full bg-[#FE6400] text-white flex items-center justify-center font-bold text-xs">
              {project.servicioCotizacion?.responsable?.name?.charAt(0)}{project.servicioCotizacion?.responsable?.name?.charAt(1)}
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-[#072142] leading-tight dark:text-white">{convertFirstLetterCapital(project.servicioCotizacion?.responsable?.name)}</span>
            <span className="text-xs text-slate-400 leading-tight dark:text-white/70">{convertFirstLetterCapital(project.servicioCotizacion?.responsable?.puesto)}</span>
          </div>
        </div>
        </div>
      </div>

    </Card>
  );
};

export default EncuestaGrid;
