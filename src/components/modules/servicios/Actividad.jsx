import { format } from "date-fns";
import { es } from "date-fns/locale";
import React from "react";
import { FaCalendar, FaExternalLinkAlt, FaPen, FaStickyNote } from "react-icons/fa";
import { SiGooglemeet } from "react-icons/si";

const lists2 = [
  {
    title: "Project start date",
    desc: "This parcel is paid for by the customer. Please contact the customer for any further information.",
    date: "Sep 20, 2021 ",
    time: "12:32 AM",
    status: "ok",
  },
  {
    title: "Project start date",
    date: "Sep 20, 2021 ",
    desc: "This parcel is paid for by the customer. Please contact the customer for any further information.",
    time: "12:32 AM",
    status: "ok",
  },
  {
    title: "Project start date",
    date: "Sep 20, 2021 ",
    desc: "This parcel is paid for by the customer. Please contact the customer for any further information.",
    time: "12:32 AM",
    status: "ok",
  },
  {
    title: "Project start date",
    date: "Sep 20, 2021 ",
    desc: "This parcel is paid for by the customer. Please contact the customer for any further information.",
    time: "12:32 AM",
  },
  {
    title: "Project start date",
    date: "Sep 20, 2021 ",
    desc: "This parcel is paid for by the customer. Please contact the customer for any further information.",
    time: "12:32 AM",
  },
];

const ActividadServicio = ({ tasks }) => {

  // Función para detectar y colorear códigos de tareas
  const colorizeTaskCodes = (text) => {
    if (!text) return text;
    
    // Regex para detectar códigos de tareas (2-3 letras seguidas de números)
    const taskCodeRegex = /\b([A-Z]{2,3}\d{2,3})\b/g;
    
    return text.replace(taskCodeRegex, (match) => {
      return `<span class="text-orange-500 font-semibold">${match}</span>`;
    });
  };

  return (
    <ul className="relative ltr:pl-2 rtl:pr-2">
      {tasks && tasks.length > 0 && tasks.map((i) => (
      //{tasks && tasks.length > 0 && tasks.filter((i) => i.delivered).map((i) => (

        <li
          key={i.id}
          className={`
            ltr:border-l-2 rtl:border-r-2 border-green-600 dark:border-green-400 pb-4 
            last:border-none ltr:pl-[22px] rtl:pr-[22px] relative before:absolute ltr:before:left-[-8px] 
            rtl:before:-right-2 before:top-[0px] before:rounded-full before:w-4 before:h-4
            before:bg-green-600 dark:before:bg-green-400 before:leading-[2px] 
            before:content-[url('@/assets/images/all-img/ck.svg')] `
          }
        >
          <div className="p-[10px] relative top-[-20px]">
            <h2 
              className="text-xs font-semibold dark:text-slate-400-900 text-slate-600 mb-1"
              dangerouslySetInnerHTML={{ 
                __html: colorizeTaskCodes(i.task.name) 
              }}
            />
            <div className="flex flex-col gap-2 items-start mt-2 justify-center">
              <ul className="flex flex-col gap-2 items-start justify-center">
                 {i?.deliverHistorical && i?.deliverHistorical.length > 0 && i?.deliverHistorical?.map((d, indexd) => (
                   <React.Fragment key={indexd}>
                     {d.workerNotes && (
                       <span className="text-xs flex flex-row gap-2 items-center justify-center text-slate-500 dark:text-slate-400">
                        <FaPen className="text-slate-500 dark:text-slate-400"/>
                          {d.workerNotes}
                        </span>
                     )}
                     {d?.evidenceLinks?.length > 0 && d?.evidenceLinks?.map((el, indexel) => (
                       <li key={el.id} className="flex flex-col gap-2">
                          <a 
                            href={el.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-xs flex dark:text-slate-400 text-slate-500 flex-row hover:text-blue-500 hover:underline gap-2 items-center justify-center font-light"
                          >
                            <SiGooglemeet className="text-slate-500 dark:text-slate-400" />
                            Link {indexel + 1}: 
                            <FaExternalLinkAlt className="text-blue-500 dark:text-blue-400"/>
                          </a>
                       </li>
                     ))}
                   </React.Fragment>
                 ))}
                <p className="text-xs flex flex-row gap-2 items-center justify-center capitalize dark:text-slate-400">
                  <FaCalendar className="text-slate-500 dark:text-slate-400"/>
                  {format(
                    new Date(i.task.createdAt),
                    "dd MMMM, yyyy - hh:mm a",
                    { locale: es }
                  )}
                </p>
              </ul>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ActividadServicio;
