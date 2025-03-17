import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Pagination from "../../components/ui/Pagination";
import axios from "axios";
import { BACKEND } from "../../configs/envConfig";
import EncuestaDetailsPageDetails from "./encuesta-details-pageQuestion";
import { toast } from "react-toastify";
import { FaCheck } from "react-icons/fa";
import { motion } from "framer-motion";

const EncuestaAnswerDetails = () => {
  const { id } = useParams();

  const pageVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3 } },
  };

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [answersList, setAnswerList] = useState([]);
  const [tipoFormulario, setTipoFormulario] = useState("");
  const idForm = searchParams.get("idform");
  const [encuestaDetails, setEncuestaDetails] = useState(null);

  const getEncuestaDetails = async () => {
    const responseEncuestaDetails = await axios.get(
      `${BACKEND}/formularioServicioRespuestas/${id}`
    );
    setEncuestaDetails(responseEncuestaDetails.data);
  };
  const getAllQuestions = async () => {
    try {
      if (idForm) {
        const responsetQuestions = await axios.get(
          `${BACKEND}/formularioServicioPregunta?where[formulario][equals]=${idForm}&limit=1000&sort=createdAt`
        );
        setTotalPages(responsetQuestions.data.docs.length);

        if (responsetQuestions.data.docs.length > 0) {
          setTipoFormulario(responsetQuestions.data.docs[0].formulario.tipo);
        }
        setAnswerList(
          responsetQuestions.data.docs.map((e, index) => ({
            page: index + 1,
            pregunta: e.id,
            beneficiado: e?.beneficiado ? e?.beneficiado : "",
            preguntaTexto: e.pregunta,
            preguntaMedia: e?.media ? e.media : null,
            linkYoutube: e?.linkYoutube ? e.linkYoutube : "",
            isPuntaje: e.formulario.tipo === "entrada" ? false : true,
            tipo: e.tipo,
            puntaje: 0,
            respuesta: "",
            respuestaList: [],
            selectedFile: null,
            selectedFileType: "",
            alternativas: e?.alternativas ? e.alternativas : [],
            habilitarMedia: e?.habilitarMedia ? true : false,
            idMedia: null,
          }))
        );
      }
    } catch (error) {}
  };

  useEffect(() => {
    getAllQuestions();
    getEncuestaDetails();
  }, []);

  const updateRespuesta = (pageToUpdate, newValue) => {
    // Use map to create a new array with the updated object
    const updatedData = answersList.map((obj) => {
      if (obj.page === pageToUpdate) {
        // Update the information for the object with the matching id
        return { ...obj, respuesta: newValue };
      }
      return obj; // Return unchanged objects
    });

    // Set the state with the updated array
    setAnswerList(updatedData);
  };

  const updateMediaId = (pageToUpdate, idMedia, file, fileType) => {
    try {
      // Use map to create an array of Promises
      const updatedData = answersList.map((obj) => {
        if (obj.page === pageToUpdate) {
          // Update the information for the object with the matching id
          const updatedObj = {
            ...obj,
            idMedia: idMedia,
            selectedFile: file,
            selectedFileType: fileType,
          };
          return updatedObj;
        }
        return obj; // Return unchanged objects
      });

      // Wait for all Promises to resolve

      // Set the state with the updated array
      setAnswerList(updatedData);
    } catch (error) {
      console.error("Error in updateMediaId:", error);
    }
  };

  const updateMediaObj = (pageToUpdate, file, fileType) => {
    // Use map to create a new array with the updated object
    const updatedData1 = answersList.map((obj) => {
      if (obj.page === pageToUpdate) {
        // Update the information for the object with the matching id
        return { ...obj, selectedFile: file, selectedFileType: fileType };
      }
      return obj; // Return unchanged objects
    });
    // Set the state with the updated array
    setAnswerList(updatedData1);
  };

  const updateRespuestaListSingle = (pageToUpdate, newValue, puntaje) => {
    // Use map to create a new array with the updated object
    const updatedData = answersList.map((obj) => {
      if (obj.page === pageToUpdate) {
        // Update the information for the object with the matching id
        return { ...obj, respuesta: newValue, puntaje: puntaje };
      }
      return obj; // Return unchanged objects
    });

    // Set the state with the updated array
    setAnswerList(updatedData);
  };
  const updateRespuestaListMultiple = (pageToUpdate, newValue, puntaje) => {
    // Use map to create a new array with the updated object
    const updatedData = answersList.map((obj) => {
      if (obj.page === pageToUpdate) {
        // Update the information for the object with the matching id
        return { ...obj, respuestaList: newValue, puntaje: puntaje };
      }
      return obj; // Return unchanged objects
    });

    // Set the state with the updated array
    setAnswerList(updatedData);
  };

  const finalizar = async () => {
    try {
      if (idForm) {
        await axios.put(`${BACKEND}/formularioServicioRespuestas/${id}`, {
          respuestas: answersList.map((ans) => ({
            pregunta: ans.pregunta,
            respuesta:
              ans.tipo === "seleccionMultiple"
                ? ans.respuestaList.map((obj) => obj.respuesta).join(", ")
                : ans.respuesta,
            puntaje: ans.puntaje,
            isPuntaje: tipoFormulario === "entrada" ? false : true,
            tipo: ans.tipo,
            media: ans.idMedia,
            puntajeComercial: answersList
              .filter((e) => e.beneficiado !== "")
              .filter((e1) => e1.beneficiado === "Comercial")
              .reduce((acc, value) => value.puntaje + acc, 0),
            puntajeEspecialista: answersList
              .filter((ex) => ex.beneficiado !== "")
              .filter((e2) => e2.beneficiado === "Especialista")
              .reduce((acc, value) => value.puntaje + acc, 0),
          })),
          respondido: true,
        });

        await getEncuestaDetails();
        toast.success(
          "Respuestas registradas correctamente. Gracias por responder"
        );
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al guardar tus respuestas");
    }
  };

  if (!encuestaDetails) return;

  if (encuestaDetails.respondido)
    return (
      <div className="  min-h-[600px] max-w-5xl mx-auto flex justify-center items-center">
        {" "}
        <div className=" flex justify-center items-center text-green-600  bg-opacity-10 bg-green-500 dark:bg-opacity-20 shadow-lg dark:text-green-300 p-4  rounded-md dark:bg-green-700 gap-4">
          Respondido <FaCheck className=" " />
        </div>
      </div>
    );
  return (
    <div className="flex flex-col gap-4">
      <h5>Formulario {encuestaDetails.formulario?.servicio?.name}</h5>
      <motion.div
        key={currentPage} // Importante para que React detecte los cambios de página
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        className=" mx-auto  max-w-5xl w-full dark:bg-gray-800 bg-white p-6 rounded-xl space-y-4"
      >
        <EncuestaDetailsPageDetails
          updateMediaId={updateMediaId}
          updateMediaObj={updateMediaObj}
          updateRespuesta={updateRespuesta}
          updateRespuestaListSingle={updateRespuestaListSingle}
          updateRespuestaListMultiple={updateRespuestaListMultiple}
          questionData={answersList.find((e) => e.page === currentPage)}
        />
        {currentPage && totalPages && currentPage < totalPages && (
          <div className="flex flex-row gap-8 w-full justify-center">
            <button
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className={`${
                currentPage === 1 &&
                "!text-gray-500 !bg-gray-200 !cursor-not-allowed"
              } hover:bg-opacity-10 transition duration-300 flex justify-center gap-2 items-center  font-bold p-2 rounded-md max-w-[200px] w-full bg-[#789be9] bg-opacity-20 text-[#5182ea] shadow-md`}
              disabled={currentPage === 1}
            >
              Anterior
            </button>

            <button
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className={`${
                currentPage === totalPages &&
                "!text-gray-500 !bg-gray-200 !cursor-not-allowed"
              } hover:bg-opacity-10 transition duration-300 flex justify-center gap-2 items-center  font-bold p-2 rounded-md max-w-[200px] w-full bg-[#789be9] bg-opacity-20 text-[#5182ea] shadow-md`}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </button>
          </div>
        )}
        {/* <div className="text-xs text-gray-500 w-full text-center pt-4">
          Pregunta {currentPage} de {totalPages}
        </div> */}
      </motion.div>

      {answersList.length > 0 && currentPage === answersList.length && (
        <div className=" flex justify-center pt-10 ">
          <button
            type="button"
            onClick={finalizar}
            className=" hover:bg-opacity-10 transition duration-300 flex justify-center gap-2 items-center  font-bold p-2 rounded-md max-w-xs w-full bg-green-600 bg-opacity-20 text-green-600 dark:text-green-300 shadow-lg"
          >
            Finalizar
          </button>
        </div>
      )}

      {/* <div className=" flex justify-center mt-10">
        <Pagination
          totalPages={totalPages}
          handlePageChange={setCurrentPage}
          currentPage={currentPage}
        />
      </div> */}
    </div>
  );
};

export default EncuestaAnswerDetails;
