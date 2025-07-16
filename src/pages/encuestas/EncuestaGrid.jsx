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
import { FaArrowRight, FaCheck, FaClock } from "react-icons/fa";
const EncuestaGrid = ({ project }) => {
  const dispatch = useDispatch();
  console.log(project);
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
            <div className="font-bold text-lg dark:text-slate-200">
              {project.formulario.servicio?.name}
            </div>
          </div>
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
      </header>
      {/* description */}
      <div className="mt-4">
        <div className="text-sm text-slate-600 dark:text-slate-400">
        Formulario de {project.formulario?.tipo === "entrada" && "entrada"}{" "}
        {project.formulario?.tipo === "satisfaccion" && "satisfacción"}
      </div>

        <div className="flex mt-2">
          <div className="flex">
      {project.respondido ? (
              <div className="flex items-center bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300 font-bold px-3 py-1 rounded-full text-xs">
                <span className="w-2 h-2 bg-green-500 dark:bg-green-300 rounded-full mr-1.5"></span>
            <span>Respondido</span>
        </div>
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
      <div className="text-slate-600 dark:text-slate-400 text-sm pt-4 pb-8">
        Plan {project.servicioCotizacion.planServicio?.name}
      </div>

      {/* assignee */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div>
          <span className="block text-xs text-slate-500 dark:text-slate-400">Fecha Inicio</span>
          <div className="flex items-center mt-1">
            <Icon icon="heroicons-outline:calendar" className="text-slate-400 mr-2" />
            <span className="text-sm font-medium">
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
      <div className="mt-6">
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
      </div>

      {/* assignee and total date */}
      <div className="mt-6">
        <span className="block text-xs text-slate-500 dark:text-slate-400 mb-2">Encargado:</span>
        <div className="flex items-center">
        {typeof project.servicioCotizacion.responsable == "object" && (
            <>
              {(() => {
                const responsable = project.servicioCotizacion.responsable;
                const fotoUrl = responsable?.foto?.url;
                const isValidUrl = fotoUrl && typeof fotoUrl === 'string' && fotoUrl.trim() !== '';
                if (isValidUrl) {
                  return (
                    <img
                      src={fotoUrl}
                      alt="Encargado servicio"
                      className="rounded-full h-10 w-10 object-cover"
                    />
                  );
                } else {
                  const name = responsable.name || "";
                  const parts = name.trim().split(" ");
                  const first = parts[0]?.charAt(0) || "";
                  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
                  return (
                    <div className="h-10 w-10 rounded-full bg-amber-500 flex items-center justify-center">
                      <span className="text-white font-medium">
                        {(first + last).toUpperCase()}
                      </span>
            </div>
                  );
                }
              })()}
              <div className="ml-3">
                <div className="font-medium text-sm">
                  {convertFirstLetterCapital(
                    project.servicioCotizacion.responsable.name
                  )}
                </div>
                <div className="text-xs text-slate-500">
                  {convertFirstLetterCapital(
                    project.servicioCotizacion.responsable.puesto
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

export default EncuestaGrid;
