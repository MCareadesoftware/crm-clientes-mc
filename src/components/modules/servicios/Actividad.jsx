import { format } from "date-fns";
import { es } from "date-fns/locale";
import React from "react";
import { FaExternalLinkAlt } from "react-icons/fa";

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

  return (
    <ul className="relative ltr:pl-2 rtl:pr-2">
      {tasks && tasks.length > 0 && tasks.map((i) => (
      //{tasks && tasks.length > 0 && tasks.filter((i) => i.delivered).map((i) => (

        <li
          key={i.id}
          className={`
            ${
              i.estado === "Finalizado"
                ? "before:opacity-100"
                : " before:opacity-50"
            }
            ltr:border-l-2 rtl:border-r-2 border-slate-100 dark:border-slate-700 pb-4 
            last:border-none ltr:pl-[22px] rtl:pr-[22px] relative before:absolute ltr:before:left-[-8px] 
            rtl:before:-right-2 before:top-[0px] before:rounded-full before:w-4 before:h-4
            before:bg-slate-900 dark:before:bg-slate-600 before:leading-[2px] 
            before:content-[url('@/assets/images/all-img/ck.svg')] `
          }
        >
          <div className="p-[10px] relative top-[-20px]">
            <h2 className="text-xs font-semibold dark:text-slate-400-900 text-slate-600 mb-1">
              {i.task.name}
            </h2>
            <div className="flex flex-col gap-2 items-start justify-center">
              <ul className="flex flex-col gap-2 items-start justify-center">
                 {i?.deliverHistorical && i?.deliverHistorical.length > 0 && i?.deliverHistorical?.map((d, indexd) => (
                   <React.Fragment key={indexd}>
                     {d.workerNotes && (
                       <span className="text-xs text-slate-500 dark:text-slate-400 mb-1">{d.workerNotes}</span>
                     )}
                     {d?.evidenceLinks?.length > 0 && d?.evidenceLinks?.map((el, indexel) => (
                       <li key={el.id} className="flex flex-col gap-2">
                          <a 
                            href={el.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-xs flex flex-row hover:text-blue-500 hover:underline gap-2 items-center justify-center font-light dark:text-slate-300 text-slate-600"
                          >
                           Link {indexel + 1}: <FaExternalLinkAlt />
                          </a>
                       </li>
                     ))}
                   </React.Fragment>
                 ))}
                <p className="text-xs capitalize dark:text-slate-400">
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
