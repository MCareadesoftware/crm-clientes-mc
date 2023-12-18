import React, { useEffect, useState } from "react";
import axios from "axios";
import { BsPlusCircleFill } from "react-icons/bs";
import { BACKEND } from "../../../configs/envConfig";
import EtapaSeguimiento from "./EtapaSeguimiento";

const EtapasTareasSeguimiento = ({  idServicio }) => {
  const [etapasList, setEtapasList] = useState([]);
  const [openDialogEtapa, setOpenDialogEtapa] = useState(false);
  const fetchEtapas = async () => {
    if (idServicio) {
      try {
        const response = await axios.get(
          `${BACKEND}/etapasServiciosCotizaciones?limit=1000&where[servicio][equals]=${idServicio}&sort=createdAt`
        );
        setEtapasList(response.data.docs);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchEtapas();
  }, []);

  return (
    <div className=" max-w-6xl mx-auto  rounded-md ">
      


      {etapasList.map((e) => (
        <EtapaSeguimiento
          key={e.id}
          idServicio={idServicio}
          data={e}
        />
      ))}
     
    </div>
  );
};

export default EtapasTareasSeguimiento;
