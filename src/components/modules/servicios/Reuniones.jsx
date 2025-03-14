import React from "react";
import { Link } from "react-router-dom";
import { message } from "@/constant/data";
import { MdCalendarMonth } from "react-icons/md";
import { format, isSameDay, isSameMonth } from "date-fns";
import { es } from "date-fns/locale";

const Reuniones = ({ lists }) => {
  const newMessage = message.slice(0, 5);
  return (
    <div>
      <ul className="divide-y divide-slate-100 dark:divide-slate-700 -mx-6 -mb-6">
        {lists?.map((item, i) => (
          <li key={item.id}>
            <div className="   hover:text-slate-800 text-slate-600 dark:text-slate-300 block w-full px-4 py-3 text-sm mb-2 last:mb-0 cursor-pointer">
              <div className="flex ltr:text-left rtl:text-right">
                <div className="flex-none ltr:mr-3 rtl:ml-3">
                  <div className="h-8 w-8 flex justify-center items-center bg-white dark:bg-slate-700 rounded-full relative">
                    <MdCalendarMonth />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="text-slate-800 dark:text-slate-300 text-sm font-medium mb-1`">
                    {item.task.name}
                  </div>
                  <div className="text-xs hover:text-[#68768A] font-normal text-slate-600 dark:text-slate-300">
                    {item?.task?.description ?? ""}
                  </div>
                  <div className="text-slate-400 dark:text-slate-400 text-xs mt-1">
                    {isSameDay(
                      new Date(item.task.createdAt),
                      new Date(item.limitDate)
                    ) &&
                    isSameMonth(
                      new Date(item.task.createdAt),
                      new Date(item.limitDate)
                    ) ? (
                      <>
                        {" "}
                        {format(new Date(item.task.createdAt), "hh:mm a", {
                          locale: es,
                        })}{" "}
                        -{" "}
                        {format(new Date(item.limitDate), "hh:mm a", {
                          locale: es,
                        })}
                        {" ,  "}
                        {format(
                          new Date(item.task.createdAt),
                          "MMMM dd, yyyy",
                          {
                            locale: es,
                          }
                        )}{" "}
                      </>
                    ) : (
                      <>
                        {format(
                          new Date(item.task.createdAt),
                          "hh:mm a , MMMM dd",
                          {
                            locale: es,
                          }
                        )}
                        {" - "}
                        {format(new Date(item.limitDate), "hh:mm a , MMMM dd", {
                          locale: es,
                        })}
                        {" | "}
                        {format(new Date(item.task.createdAt), "yyyy", {
                          locale: es,
                        })}
                      </>
                    )}
                  </div>

                  <div className=" my-3">
                    {item?.link && (
                      <a
                        target="_blank"
                        className=" hover:bg-green-200 dark:bg-green-600 dark:bg-opacity-10 dark:text-green-300 dark:hover:bg-opacity-20  rounded-full bg-green-100 text-xs font-semibold text-green-700 p-2 "
                        href={item.link}
                      >
                        {" "}
                        Unirse a la reunion{" "}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Reuniones;
