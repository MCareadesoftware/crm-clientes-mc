import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaUser } from "react-icons/fa";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { convertFirstLetterCapital } from "../../../helpers/stringsHelper";
import Tooltip from "../../ui/Tooltip";
import { BACKEND } from "../../../configs/envConfig";
const EtapaSeguimiento = ({ data, idServicio }) => {
  const [tareasList, setTareasList] = useState([]);

  const fetchTareas = async () => {
    if (data && idServicio) {
      try {
        const response = await axios.get(
          `${BACKEND}/etapaTareaServicioCotizaciones?limit=1000&where[servicio][equals]=${idServicio}&sort=createdAt&where[etapa][equals]=${data.id}`
        );
        setTareasList(response.data.docs);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchTareas();
  }, []);

  const [activeDrawer, setActiveDrawer] = useState({
    open: false,
    dataTarea: null,
  });

  const [openAddTarea, setOpenAddTarea] = useState(false);

  return (
    <div className="  rounded-md my-10 p-2">
      {/* <DrawerEditTarea
        open={activeDrawer.open}
        data={activeDrawer.dataTarea}
        user={user}
        onSuccess={() => fetchTareas()}
        onClose={() => setActiveDrawer((prev) => ({ ...prev, open: false }))}
      /> */}

      <h2 className="  font-semibold text-xl text-gray-600">
        {data && data.name}
      </h2>

      <div className="mx-auto max-w-screen-2xl py-4 lg:pb-12">
        <div className="relative overflow-hidden bg-white shadow-md dark:bg-slate-900 sm:rounded-lg">
          <div className="flex flex-col px-4 py-3 space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 lg:space-x-4">
            <div className="flex items-center flex-1 space-x-4">
              <h5>
                <span className="text-gray-500 dark:text-gray-200 text-sm">
                  Total de tareas:{" "}
                </span>
                <span className=" text-sm">{tareasList.length}</span>
              </h5>
              {/* <h5>
                      <span className="text-gray-500">Total sales:</span>
                      <span className="">$88.4k</span>
                  </h5> */}
            </div>
          </div>
          <div className="overflow-x-auto">
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
                  <th scope="col" className="px-4 py-3">
                    Link
                  </th>
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
                      className="flex  items-center px-4  max-w-xs py-2 font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap "
                    >
                      <div className=" h-full">{e?.name}</div>
                    </th>
                    <td className="px-4 py-2">
                      <span className=" text-xs font-medium px-2 py-0.5 rounded ">
                        {format(new Date(e.createdAt), "dd, MMMM", {
                          locale: es,
                        })}
                      </span>
                    </td>
                    <td className="px-4 py-2 font-medium text-gray-700 dark:text-gray-400 whitespace-nowrap ">
                      <div className="flex items-center">
                        {/* <div className="inline-block w-4 h-4 mr-2 bg-red-700 rounded-full"></div> */}
                        {format(new Date(e.createdAt), "HH:MM a", {
                          locale: es,
                        })}
                      </div>
                    </td>
                    <td className="px-4 py-2 font-medium text-gray-700 dark:text-gray-400 whitespace-nowrap ">
                      {format(new Date(e.fechaEntega), "dd, MMMM", {
                        locale: es,
                      })}
                    </td>
                    <td className="px-4 py-2 font-medium text-gray-700 dark:text-gray-400 whitespace-nowrap ">
                      {format(new Date(e.fechaEntega), "HH:MM a", {
                        locale: es,
                      })}
                    </td>
                    <td className="px-4 py-2 font-medium text-gray-700 dark:text-gray-400 whitespace-nowrap ">
                      <div className="flex items-center">
                        {e.estado === "En proceso" && (
                          <>
                            {new Date(e?.fechaEntega) < new Date() ? (
                              <div className="inline-block w-3 h-3 mr-2 bg-red-700 rounded-full"></div>
                            ) : (
                              <div className="inline-block w-3 h-3 mr-2 bg-blue-500 rounded-full"></div>
                            )}
                          </>
                        )}

                        {e.estado === "Pendiente" && (
                          <>
                            {new Date(e?.fechaEntega) < new Date() ? (
                              <div className="inline-block w-3 h-3 mr-2 bg-red-700 rounded-full"></div>
                            ) : (
                              <div className="inline-block w-3 h-3 mr-2 bg-orange-500 rounded-full"></div>
                            )}
                          </>
                        )}

                        {e.estado === "Finalizado" && (
                          <>
                            <div className="inline-block w-3 h-3 mr-2 bg-green-500 rounded-full"></div>
                          </>
                        )}

                        {e.estado === "Eliminado" && (
                          <div className="inline-block w-3 h-3 mr-2 bg-black rounded-full"></div>
                        )}

                        <span className="ml-1 text-gray-500 ">
                          {e.estado === "Eliminado"
                            ? "Eliminado"
                            : e.estado === "Finalizado"
                            ? "Finalizado"
                            : new Date(e.fechaEntega) < new Date()
                            ? "Incumplido"
                            : e.estado}
                        </span>
                      </div>
                    </td>
                    <th
                      scope="row"
                      className="px-4 py-2 font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap "
                    >
                      <div className="flex items-center  gap-2  whitespace-nowrap">
                        <FaUser className=" text-orange-500 " />
                        {Boolean(e.responsable?.name ?? "") &&
                          convertFirstLetterCapital(e.responsable?.name ?? "")}
                      </div>
                    </th>
                    <td className="px-4 py-2">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EtapaSeguimiento;
