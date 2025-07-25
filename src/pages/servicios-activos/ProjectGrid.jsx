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
import PDFMonstruoCreativo from "../../components/pdfs/PDFMonstruoCreativo";
import ObtenerMultiplicador from "../../utils/ObtenerMultiplicador";
import ObtenerMoneda from "../../utils/ObtenerMoneda";

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

  // PDF
  const [dataCotizacionSelected, setDataCotizacionSelected] = useState(null)
  const [loading, setLoading] = useState(false)

  const [pdfOpen, setPdfOpen] = useState(false)
  const [paises, setPaises] = useState([])
  const [pagosList, setPagosList] = useState([])
  const [allServiciosList, setAllServiciosList] = useState([])
  const [allServiciosCotizacionesList, setAllServiciosCotizacionesList] = useState([])
  const [currencyExchanges, setCurrencyExchanges] = useState({})
  const [currency, setCurrency] = useState("PEN")

  const pdfMap = {
    "67ea9c110e2642a4b0b902e1": "PDFMonstruoCreativo",
    "67ea9c250e2642a4b0b902fa": "PDFW3b",
    "67ea9c2c0e2642a4b0b90313": "PDFMundoDigital",
    "67ea9c320e2642a4b0b9032c": "PDFAllSavfe",
    "67ea9c3e0e2642a4b0b90345": "PDFConviertelo",
    "67ea9c440e2642a4b0b9035e": "PDFLucuma",
  }

  const PDFComponents = {
    PDFMonstruoCreativo,
    // PDFAllSavfe,
    // PDFW3b,
    // PDFMundoDigital,
    // PDFConviertelo,
    // PDFLucuma,
  }

  const defaultPDF = "PDFMonstruoCreativo"
  const selectedPDFKey = pdfMap[dataCotizacionSelected?.marca?.id]
  const SelectedPDFComponent = PDFComponents[selectedPDFKey] || PDFComponents[defaultPDF]

  const currencyExchange = currencyExchanges[currency]

  const getPagos = async () => {
    try {
      const response = await axios.get(`${BACKEND}/pagosCotizaciones?where[cotizacion][equals]=${dataCotizacionSelected?.id}&sort=createdAt&limit=1000`)
      setPagosList(response.data.docs)
    } catch (error) {
      return false
    }
  };

  const getServiciosCotizaciones = async () => {
    try {
      const response = await axios.get(`${BACKEND}/serviciosCotizaciones?where[cotizacion][equals]=${dataCotizacionSelected?.id}&limit=0&depth=4`)
      setAllServiciosCotizacionesList(response.data.docs)
    } catch (error) {
      return false
    }
  };

  const getPaises = async () => {
    try {
      const response = await axios.get(`${BACKEND}/paises?limit=0`)
      setPaises(response.data.docs)
    } catch (error) {
      return false
    }
  }

  const getServicios = async () => {
    try {
      const response = await axios.get(`${BACKEND}/servicios?limit=1000`)
      setAllServiciosList(response.data.docs)
    } catch (error) {
      return false
    }
  };

  const getCurrencyExchange = async () => {
    try {
      const response = await axios.get(`${BACKEND}/tiposCambio?limit=0`)
      const currencyExchanges = response.data.docs.reduce((acc, item) => {
        acc[item.moneda] = item.tipoCambio
        return acc
      }, {})
      setCurrencyExchanges(currencyExchanges)
    } catch (error) {
      return false
    }
  }

  useEffect(() => {
    setLoading(true)
    getPaises()
    getPagos()
    getServiciosCotizaciones()
    getServicios()
    getCurrencyExchange()
    setCurrency(ObtenerMoneda({pais: dataCotizacionSelected?.cliente?.pais || dataCotizacionSelected?.lead?.country, paises: paises}))
    setLoading(false)
  }, [dataCotizacionSelected])

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-100 dark:border-slate-700 p-6 hover:shadow-md transition-shadow">

      {SelectedPDFComponent && dataCotizacionSelected && (
        <SelectedPDFComponent
          onClose={() => {
            setPdfOpen(false)
            setDataCotizacionSelected(null)
          }}
          loading={loading}
          open={pdfOpen}
          cotizacionData={dataCotizacionSelected}
          title={"Vista Previa PDF"}
          igv={false}
          comparativo={false}
          incognitMode={false}
          moneda={currency}
          tipoCambio={currencyExchange}
          paises={paises}
          pagosList={pagosList}
          serviciosList={allServiciosCotizacionesList}
          allServiciosList={allServiciosList}
        />
      )}
      
      {/* Header con ícono naranja y título */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-orange-500 rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-xs">
              {project.servicio.name.charAt(0) + project.servicio.name.charAt(1)}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-[#16213E] dark:text-slate-100 text-xs leading-tight">
              {project.servicio.name}
            </h3>
            <span className="text-xs text-gray-400 dark:text-slate-400 font-semibold tracking-wide">
              PLAN {project.planServicio?.name?.toUpperCase()}
            </span>
          </div>
        </div>
      </div>

      {/* Estado */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium text-gray-400 dark:text-slate-400">Estado:</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`${BackgroundColorStatusMap[project.estado]} ${TextColorStatusMap[project.estado]} flex flex-row items-center justify-center gap-2 px-3 py-1 rounded-md w-fit text-xs font-semibold`}>
            {project.estado}
          </span>
          {project.estado !== "Terminado con exito" && (
            <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-semibold px-3 py-1 rounded-full">
              {differenceInDays(new Date(project.fechaFin), new Date())} días restantes
            </span>
          )}
        </div>
      </div>

      {/* Fechas */}
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon icon="heroicons-outline:calendar" className="w-4 h-4 text-gray-400 dark:text-slate-400" />
            <span className="text-xs text-[#16213E] dark:text-slate-100 font-semibold">
              {format(new Date(project.fechaInicio), "d 'de' MMMM, yyyy", { locale: es })}
            </span>
          </div>
          <div className="w-px h-6 bg-gray-200 dark:bg-slate-700 mx-2"></div>
          <div className="flex items-center gap-2">
            <Icon icon="heroicons-outline:calendar" className="w-4 h-4 text-gray-400 dark:text-slate-400" />
            <span className="text-xs text-[#16213E] dark:text-slate-100 font-semibold">
              {format(new Date(project.fechaFin), "d 'de' MMMM, yyyy", { locale: es })}
            </span>
          </div>
        </div>
      </div>

      {/* Encargado */}
      <div className="mb-4">
        <div className="text-xs text-gray-400 dark:text-slate-400 font-medium mb-2">Encargado:</div>
        <div className="flex items-center gap-3">
          {project.responsable?.foto ? (
            <img
              src={project.responsable.foto.url}
              alt="Encargado"
              className="w-9 h-9 rounded-full object-cover border-2 border-orange-500"
            />
          ) : (
            <div className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-semibold border-2 border-orange-500">
              {project.responsable?.name?.charAt(0) || "?"}
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#16213E] dark:text-slate-100 leading-tight">
              {convertFirstLetterCapital(project.responsable?.name || "Sin asignar")}
            </span>
            <span className="text-xs text-gray-400 dark:text-slate-400 font-medium leading-tight">
              {convertFirstLetterCapital(project.responsable?.puesto || "")}
            </span>
          </div>
        </div>
      </div>

      {/* Estado de facturación y precio */}
      <div className="mb-4">
        <div className="text-xs text-gray-400 dark:text-slate-400 font-medium mb-2">Estado de facturación:</div>
        <div className="flex items-center justify-between w-full">
          <span className="bg-[#FBEAEA] dark:bg-red-900 text-[#E23434] dark:text-red-300 text-xs font-semibold px-3 py-1 rounded-md flex items-center gap-2">
            <span className="w-2 h-2 bg-[#E23434] dark:bg-red-300 rounded-full"></span>
            {project.facturacion || "Deuda"}
          </span>
          <span className="text-sm font-bold text-[#16213E] dark:text-white">S/. {Number(project.customPrice || project.precioTotal || 0).toFixed(2)}</span>
        </div>
      </div>

      {/* Línea divisoria */}
      <div className="border-t border-gray-100 dark:border-slate-700 mb-4"></div>

      {/* Botones de acción */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => {
            setDataCotizacionSelected(project.cotizacion)
            setTimeout(() => {
              setPdfOpen(true)
            }, 1000)
          }}
          className="flex items-center gap-2 text-orange-500 dark:text-orange-300 hover:text-orange-600 dark:hover:text-orange-400 transition-colors"
        >
          <Icon icon="heroicons-outline:eye" className="w-4 h-4" />
          <span className="text-xs font-medium">Ver cotización</span>
        </button>
        <button 
          onClick={() => handleClick(project)}
          className="flex items-center bg-[#FE6400] px-5 py-2 gap-2 rounded-md text-white hover:bg-orange-500 transition-colors"
        >
          <span className="text-xs font-bold">Ver más</span>
          <Icon icon="heroicons-outline:arrow-right" className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ProjectGrid;
