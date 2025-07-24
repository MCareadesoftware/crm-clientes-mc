import React, { useState, useEffect } from "react";
import { useLocation, NavLink, useParams } from "react-router-dom";
import { menuItems } from "@/constant/data";
import Icon from "@/components/ui/Icon";
import axios from "axios";
import { BACKEND } from "../../configs/envConfig";

const Breadcrumbs = () => {
  const location = useLocation();
  const { id } = useParams();
  const locationName = location.pathname.replace("/", "");

  const [isHide, setIsHide] = useState(null);
  const [groupTitle, setGroupTitle] = useState("");
  const [serviceName, setServiceName] = useState("");

  useEffect(() => {
    const currentMenuItem = menuItems.find(
      (item) => item.link === locationName
    );

    const currentChild = menuItems.find((item) =>
      item.child?.find((child) => child.childlink === locationName)
    );

    if (currentMenuItem) {
      setIsHide(currentMenuItem.isHide);
    } else if (currentChild) {
      setIsHide(currentChild?.isHide || false);
      setGroupTitle(currentChild?.title);
    }

    if (id) {
      // console.log("ID de la URL:", id);
      
      // Si estamos en historial-servicios o servicios-activos con ID, obtener el nombre del servicio
      if (location.pathname.includes("/historial-servicios/") || location.pathname.includes("/servicios-activos/")) {
        getServiceName(id);
      }
    }
  }, [location, locationName, id]);

  const getServiceName = async (serviceId) => {
    try {
      const response = await axios.get(`${BACKEND}/serviciosCotizaciones/${serviceId}`);
      if (response.data && response.data.servicio) {
        setServiceName(response.data.servicio.name);
      }
    } catch (error) {
      console.error("Error obteniendo nombre del servicio:", error);
      setServiceName("Servicio");
    }
  };

  return (
    <>
      {!isHide ? (
        <div className="md:mb-6 mb-4 flex space-x-3 rtl:space-x-reverse">
          <ul className="breadcrumbs">
            <li className="text-primary-500">
              <NavLink to="/servicios-activos" className="text-lg">
                <img src="/other_houses.svg" alt="Inicio" className="w-5 h-5" />
              </NavLink>
              <span className="breadcrumbs-icon rtl:transform rtl:rotate-180">
                <Icon icon="heroicons:chevron-right" />
              </span>
            </li>
            {/* Breadcrumb especial para encuestas/answer */}
            {location.pathname.includes("/encuestas/answer/") ? (
              <>
                <li className="text-primary-500">
                  <NavLink to="/encuestas" className="capitalize">Encuestas</NavLink>
                  <span className="breadcrumbs-icon rtl:transform rtl:rotate-180">
                    <Icon icon="heroicons:chevron-right" />
                  </span>
                </li>
                <li className="capitalize text-slate-500 dark:text-slate-400">Formulario Google Ads</li>
              </>
            ) : (location.pathname.includes("/historial-servicios/") || location.pathname.includes("/servicios-activos/")) && id ? (
              <>
                <li className="text-primary-500">
                  <NavLink to={location.pathname.includes("/historial-servicios/") ? "/historial-servicios" : "/servicios-activos"} className="capitalize">
                    {location.pathname.includes("/historial-servicios/") ? "Historial de servicios" : "Servicios activos"}
                  </NavLink>
                  <span className="breadcrumbs-icon rtl:transform rtl:rotate-180">
                    <Icon icon="heroicons:chevron-right" />
                  </span>
                </li>
                <li className="capitalize text-slate-500 dark:text-slate-400">
                  {serviceName || "Cargando..."}
                </li>
              </>
            ) : (
              <>
                {groupTitle && (
                  <li className="text-primary-500">
                    <button type="button" className="capitalize">
                      {groupTitle}
                    </button>
                    <span className="breadcrumbs-icon rtl:transform rtl:rotate-180">
                      <Icon icon="heroicons:chevron-right" />
                    </span>
                  </li>
                )}
                <li className="capitalize text-slate-500 dark:text-slate-400">
                  {locationName}
                </li>
              </>
            )}
          </ul>
        </div>
      ) : null}
    </>
  );
};

export default Breadcrumbs;
