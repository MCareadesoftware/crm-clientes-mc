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
    <Card>
      {/* header */}
      <header className="flex justify-between items-end">
        <div className="flex space-x-4 items-center rtl:space-x-reverse">
          <div className="flex-none">
            <div className="h-10 w-10 rounded-md text-lg bg-slate-100 text-slate-900 dark:bg-slate-600 dark:text-slate-200 flex flex-col items-center justify-center font-normal capitalize">
              {project?.servicio?.name?.charAt(0) +
                project?.servicio?.name?.charAt(1) ?? "--"}
            </div>
          </div>
          <div className="font-medium text-base leading-6">
            <div className="dark:text-slate-200 text-slate-900 max-w-[160px] truncate">
              {project?.servicio?.name ?? "--"}
            </div>
          </div>
        </div>
        <div>
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
              {/* <Menu.Item onClick={() => dispatch(updateProject(project))}>
                <div
                  className="hover:bg-slate-900 dark:hover:bg-slate-600 dark:hover:bg-opacity-70 hover:text-white
                   w-full border-b border-b-gray-500 border-opacity-10   px-4 py-2 text-sm dark:text-slate-300  last:mb-0 cursor-pointer first:rounded-t last:rounded-b flex  space-x-2 items-center
                     capitalize rtl:space-x-reverse"
                >
                  <span className="text-base">
                    <Icon icon="heroicons-outline:pencil-alt" />
                  </span>
                  <span>Edit</span>
                </div>
              </Menu.Item>
              <Menu.Item onClick={() => dispatch(removeProject(project.id))}>
                <div
                  className="hover:bg-slate-900 dark:hover:bg-slate-600 dark:hover:bg-opacity-70 hover:text-white
                   w-full border-b border-b-gray-500 border-opacity-10   px-4 py-2 text-sm dark:text-slate-300  last:mb-0 cursor-pointer first:rounded-t last:rounded-b flex  space-x-2 items-center
                     capitalize rtl:space-x-reverse"
                >
                  <span className="text-base">
                    <Icon icon="heroicons-outline:trash" />
                  </span>
                  <span>Delete</span>
                </div>
              </Menu.Item> */}
            </div>
          </Dropdown>
        </div>
      </header>
      {/* description */}
      <div className="text-slate-600 dark:text-slate-400 text-sm pt-4 pb-8">
        Plan {project.planServicio?.name}
      </div>
      {/* assignee */}
      <div className="flex space-x-4 rtl:space-x-reverse">
        {/* start date */}
        <div>
          <span className="block date-label">Fecha Inicio</span>
          <span className="block date-text">
            {format(new Date(project.fechaInicio), "dd MMMM , yyyy", {
              locale: es,
            })}
          </span>
        </div>
        {/* end date */}
        <div>
          <span className="block date-label">Fecha fin</span>
          <span className="block date-text">
            {format(new Date(project.fechaFin), "dd MMMM , yyyy", {
              locale: es,
            })}
          </span>
        </div>
      </div>
      {/* progress bar */}
      <div className="ltr:text-right rtl:text-left text-xs text-slate-600 dark:text-slate-300 mb-1 font-medium">
        {(totalTasksCompleted / totalTasks) * 100} %
      </div>
      <ProgressBar
        value={(totalTasksCompleted / totalTasks) * 100}
        className="bg-primary-500"
      />
      {/* assignee and total date */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        {/* assignee */}
        {project.responsable && (
          <div>
            <div className="text-slate-600 dark:text-slate-400 text-xs font-normal mb-3">
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
                <span className=" text-sm">
                  {convertFirstLetterCapital(project.responsable.name)}
                </span>
                <span
                  style={{ fontSize: "0.6em" }}
                  className=" whitespace-nowrap  text-blue-400 dark:text-blue-400"
                >
                  {convertFirstLetterCapital(project.responsable.puesto)}
                </span>
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
          </div>
        )}

        {/* total date */}
        <div className="ltr:text-right rtl:text-left">
          <span className="inline-flex items-center space-x-1 bg-green-500 bg-opacity-[0.16] text-green-500 text-xs font-normal px-2 py-1 rounded-full rtl:space-x-reverse">
            <span>
              {" "}
              <Icon icon="heroicons-outline:clock" />
            </span>
            <span>
              {differenceInDays(new Date(project.fechaFin), new Date())}
            </span>
            <span>dias para culminar</span>
          </span>
        </div>
      </div>
    </Card>
  );
};

export default ProjectGrid;
