import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import useWidth from "@/hooks/useWidth";
import Button from "@/components/ui/Button";
import ProjectGrid from "./ProjectGrid";
import ProjectList from "./ProjectList";
import GridLoading from "@/components/skeleton/Grid";
import TableLoading from "@/components/skeleton/Table";
import { toggleAddModal } from "./store";
import AddProject from "./AddProject";
import { ToastContainer } from "react-toastify";
import EditProject from "./EditProject";
import axios from "axios";

import avatar1 from "@/assets/images/avatar/av-1.svg";
import avatar2 from "@/assets/images/avatar/av-2.svg";
import avatar3 from "@/assets/images/avatar/av-3.svg";
import avatar4 from "@/assets/images/avatar/av-4.svg";
import { BACKEND } from "../../configs/envConfig";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
const HistorialServicios = () => {
  const [filler, setfiller] = useState("grid");
  const { width, breakpoints } = useWidth();
  const [isLoaded, setIsLoaded] = useState(false);
  const userRedux = useSelector((state) => state.user);
  const [page, setPage] = useState(1);
  const [serviciosList, setServiciosList] = useState([]);

  const [serviciosMetaData, setServiciosMetaData] = useState({
    totalPages: 0,
    page: 0,
    hasPrevPage: false,
    hasNextPage: false,
    totalDocs: 0,
  });
  
  const projects = [
    {
      id: 1,
      assignee: [
        {
          image: avatar1,
          label: "Mahedi Amin",
        },
        {
          image: avatar2,
          label: "Sovo Haldar",
        },
        {
          image: avatar3,
          label: "Rakibul Islam",
        },
      ],
      name: "Management Dashboard ",
      des: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.",
      startDate: "2022-10-03",
      endDate: "2022-10-06",
      progress: 75,
      category: [
        {
          value: "team",
          label: "team",
        },
        {
          value: "low",
          label: "low",
        },
      ],
    },
    {
      id: 2,
      assignee: [
        {
          image: avatar1,
          label: "Mahedi Amin",
        },
        {
          image: avatar2,
          label: "Sovo Haldar",
        },
        {
          image: avatar3,
          label: "Rakibul Islam",
        },
      ],
      name: "Business Dashboard ",
      des: "Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.",
      startDate: "2022-10-03",
      endDate: "2022-10-10",
      progress: 50,

      category: [
        {
          value: "team",
          label: "team",
        },
        {
          value: "low",
          label: "low",
        },
      ],
    },
  ];

  useEffect(() => {}, [filler]);

  const getServicios = async () => {
    try {
      setIsLoaded(true);
      if (userRedux) {
        const response = await axios.get(`${BACKEND}/serviciosCotizaciones?where[cotizacion.cliente][equals]=${userRedux.user.id}&limit=10&sort=createdAt&page=${page}`    );
        setServiciosList(response.data.docs);
        setServiciosMetaData({
          totalPages: response.data.totalPages,
          page: response.data.page,
          hasNextPage: response.data.hasNextPage,
          hasPrevPage: response.data.hasPrevPage,
          totalDocs: response.data.totalDocs,
        });
      }
    } catch (error) {
    } finally {
      setIsLoaded(false);
    }
  };

  useEffect(() => {
    getServicios();
  }, [page]);

  const pageRange = [];
  const startPage = Math.max(1, page - 2);
  const endPage = Math.min(
    page + 2,
    serviciosMetaData.totalPages ? serviciosMetaData.totalPages : 5
  );

  for (let i = startPage; i <= endPage; i++) {
    pageRange.push(i);
  }

  return (
    <div>
      <ToastContainer />
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h4 className="font-medium lg:text-xl text-lg capitalize text-slate-900 inline-block ltr:pr-4 rtl:pl-4">
          Historial de Servicios
        </h4>
      </div>
      {isLoaded && filler === "grid" && (
        <GridLoading count={projects?.length} />
      )}
      {isLoaded && filler === "list" && (
        <TableLoading count={projects?.length} />
      )}

      {filler === "grid" && !isLoaded && (
        <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5">
          {serviciosList
            // .filter((project) =>
            //   project.estado != "Abandonado" && project.estado != "Congelado"
            // )
            .map((project, projectIndex) => (
              <ProjectGrid project={project} key={projectIndex} />
            ))}
        </div>
      )}
      {filler === "list" && !isLoaded && (
        <div>
          <ProjectList projects={projects} />
        </div>
      )}

      {serviciosList && serviciosList?.length > 0 && (
        <div className="flex flex-col items-center py-10">
          <span className="text-sm text-gray-700 dark:text-gray-500 mb-2 ">
            Mostrando
            <span className="font-semibold text-gray-900 dark:text-gray-300 ">
              {" "}
              {serviciosList.length}
            </span>{" "}
            de
            <span className="font-semibold text-gray-900 dark:text-gray-300 ">
              {" "}
              {serviciosMetaData.totalDocs}
            </span>{" "}
            cotizaciones
          </span>

          <nav aria-label="Page navigation example">
            <ul className="flex items-center -space-x-px h-10 text-base">
              <li>
                <button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 1}
                  className="flex items-center justify-center px-4 h-10 ml-0 leading-tight text-gray-500 dark:bg-gray-600  dark:border-none bg-white border  border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 "
                >
                  <span className="sr-only">Previous</span>
                  <FaChevronLeft className=" w-3 h-3 text-gray-700 dark:text-gray-400" />
                </button>
              </li>

              {pageRange.map((pageNumber) => (
                <li key={pageNumber}>
                  <button
                    onClick={() => setPage(pageNumber)}
                    className={`flex items-center justify-center px-4 h-10 leading-tight ${
                      page === pageNumber
                        ? "text-white dark:text-gray-300 dark:bg-blue-600  border-blue-300 dark:border-none bg-blue-600 hover:bg-blue-700  "
                        : "text-gray-500 bg-white border dark:bg-gray-300 border-gray-300 dark:border-none hover:bg-gray-100 hover:text-gray-700 "
                    }`}
                  >
                    {pageNumber}
                  </button>
                </li>
              ))}

              <li>
                <button
                  onClick={() => setPage(page + 1)}
                  disabled={!serviciosMetaData.hasNextPage}
                  className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 dark:bg-gray-600 dark:border-none bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 "
                >
                  <span className="sr-only">Next</span>
                  <FaChevronRight className=" w-3 h-3 text-gray-700 dark:text-gray-400" />
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
      {/* <AddProject />
      <EditProject /> */}
    </div>
  );
};

export default HistorialServicios;
