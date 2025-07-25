import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import Pagination from "../../components/ui/Pagination";
import axios from "axios";
import { BACKEND } from "../../configs/envConfig";
import EncuestaDetailsPageDetails from "./encuesta-details-pageQuestion";
import { toast } from "react-toastify";
import { FaCheck, FaDownload, FaExternalLinkAlt } from "react-icons/fa";
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
          `${BACKEND}/formularioServicioPregunta?where[formulario][equals]=${idForm}&limit=1000&sort=createdAt&where[active][not_equals]=false`
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
      <div className="mx-auto w-full px-4 py-6 overflow-y-auto">

        {/* Centro: banner servicio */}
        <div className="z-10 flex-1 flex flex-col items-center justify-center gap-6 mb-8">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-6 w-full max-w-6xl">
            {encuestaDetails.formulario?.linkVideoFinal && (
              <div className="bg-[#FE6400] rounded-xl shadow-lg flex flex-col items-center justify-center px-8 py-6 w-full lg:w-1/2 max-w-md">
                <span className="bg-white bg-opacity-40 text-white text-xs px-3 py-1 rounded-full mb-2" style={{color:'#fff'}}>{encuestaDetails.formulario?.servicio?.name}</span>
                {(() => {
                  const videoUrl = encuestaDetails.formulario?.linkVideoFinal;
                  // Extraer el ID del video de YouTube
                  const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
                  const match = videoUrl.match(youtubeRegex);
                  
                  if (match) {
                    const videoId = match[1];
                    return (
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`}
                        title="YouTube video player"
                        className="w-full h-[20rem] lg:h-[24rem] rounded-lg"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    );
                  } else {
                    // Fallback en caso de que el formato no sea reconocido
                    return (
                      <div className="w-full h-[20rem] lg:h-[24rem] rounded-lg bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">Enlace de YouTube no válido</span>
                      </div>
                    );
                  }
                })()}
              </div>
            )}
            {encuestaDetails?.formulario?.formularioPdf && (
              <div className="w-full lg:w-1/2 max-w-md">
                <div className="bg-[#FE6400] rounded-xl shadow-lg flex flex-col items-center justify-center px-8 py-6 w-full">
                  <span className="bg-white bg-opacity-40 text-white text-xs px-3 py-1 rounded-full mb-2" style={{color:'#fff'}}>Formulario PDF</span>
                  <iframe
                    src={`${encuestaDetails?.formulario?.formularioPdf?.url}`}
                    title="PDF Formulario"
                    className="w-full h-[20rem] lg:h-[24rem] rounded-lg"
                    frameBorder="0"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {encuestaDetails?.respuestas && encuestaDetails?.respuestas.length > 0 ? (
            encuestaDetails.respuestas.map((e, index) => (
              <div
                key={e.id}
                className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md shadow-sm p-4 transition hover:shadow-md"
              >
                <h3 className="text-xs font-semibold text-primary-500 mb-2">
                  {index + 1}. {e.pregunta.pregunta}
                </h3>

                <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">{e.respuesta}</p>

                {e.media && (
                  <div className="flex flex-col gap-2">
                    {e.media.mimeType.startsWith("image/") && (
                      <a
                        href={e.media.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex justify-start"
                      >
                        <img
                          src={e.media.url}
                          alt="uploaded"
                          className="rounded-md max-h-40 object-contain"
                        />
                      </a>
                    )}
                    <a
                      href={e.media.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:underline break-words"
                    >
                      {e.media.filename}
                    </a>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 py-10">
              No hay respuestas disponibles.
            </div>
          )}
        </div>
      </div>
    );
    
  return (
    
    <div className="w-full flex flex-col">

      <h5>Formulario {encuestaDetails.formulario?.servicio?.name}</h5>

      {/* Título principal fuera del contenedor */}
      <div className="w-full flex flex-col items-center p-7">
        <div className="w-full max-w-4xl px-4 flex flex-col gap-4">
          
          {/* Flayer estático superior */}
          <div className="w-full flex flex-col items-center justify-center">
            <div className="relative w-full flex items-center justify-between bg-white rounded-xl overflow-hidden mb-6" style={{ minHeight: 180 }}>
              
              {/* Fondo decorativo inferior */}
              <img src="/Ellipse 9.svg" alt="fondo" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full pointer-events-none select-none" style={{zIndex:1}} />
              
              {/* Persona izquierda */}
              <div className="z-10 flex-1 flex justify-center items-end min-w-[120px] hidden lg:flex">
                <img src="/Layer_1.svg" alt="persona" className="w-32 md:w-40 lg:w-44 xl:w-48" />
              </div>

              {/* Centro: banner servicio */}
              <div className="z-10 flex-1 flex flex-col items-center justify-center">
                <div className="bg-[#FE6400] rounded-xl shadow-lg flex flex-col items-center justify-center px-8 py-6 min-w-[280px] lg:min-w-[520px] max-w-xs lg:max-w-xs">
                  <span className="bg-white bg-opacity-40 text-white text-xs px-3 py-1 rounded-full mb-2" style={{color:'#fff'}}>{encuestaDetails.formulario?.servicio?.name}</span>
                  {/* <span className="text-white font-bold text-2xl md:text-3xl text-center">{encuestaDetails.formulario?.servicio?.name || 'Servicio'}</span> */}
                  {encuestaDetails.formulario?.linkVideo && (
                    (() => {
                      const videoUrl = encuestaDetails.formulario?.linkVideo;
                      // Extraer el ID del video de YouTube
                      const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
                      const match = videoUrl.match(youtubeRegex);
                      
                      if (match) {
                        const videoId = match[1];
                        return (
                          <iframe
                            src={`https://www.youtube.com/embed/${videoId}`}
                            //src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`}
                            title="YouTube video player"
                            className="w-full h-[18rem] rounded-lg"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        );
                      } else {
                        // Fallback en caso de que el formato no sea reconocido
                        return (
                          <div className="w-full h-[18rem] rounded-lg bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500">Enlace de YouTube no válido</span>
                          </div>
                        );
                      }
                    })()
                  )}
                </div>
              </div>

              {/* Planta derecha */}
              <div className="z-10 flex-1 flex justify-center items-end min-w-[80px] hidden lg:flex">
                <img src="/planta.svg" alt="planta" className="w-20 md:w-24 lg:w-28 xl:w-32" />
              </div>

            </div>

          </div>
          
          {/* Fin flayer */}

        <motion.div
          key={currentPage} // Importante para que React detecte los cambios de página
          initial="initial"
          animate="animate"
          exit="exit"
          variants={pageVariants}
          className="w-full mx-auto dark:bg-gray-800 bg-white p-6 rounded-xl space-y-4"
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
                className={`${currentPage === 1 && "!text-gray-500 !bg-gray-200 !cursor-not-allowed"} 
                flex justify-center gap-2 items-center font-bold p-2 rounded-md max-w-[200px] w-full 
                bg-white text-[#FE6400] border border-[#FFE3C2] shadow-sm hover:bg-orange-50 transition duration-300`}
                disabled={currentPage === 1}
              >
                <img src="/keyboard_backspace.svg" alt="Anterior" className="mr-2 w-6 h-6" />
                <span className="text-sm">Anterior</span>
              </button>

              <button
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className={`${currentPage === totalPages && "!text-gray-500 !bg-gray-200 !cursor-not-allowed"} 
                flex justify-center gap-2 items-center font-bold text-xl p-2 rounded-md max-w-[200px] w-full 
                bg-[#FE6400] text-white border border-[#FE6400] shadow-sm hover:bg-orange-600 transition duration-300`}
                disabled={currentPage === totalPages}
              >
                <span className="text-sm">Siguiente</span>
                <img src="/flechaderecha.svg" alt="Flecha" className="ml-2 w-6 h-6" />
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
      </div>
    </div>
  );
};

export default EncuestaAnswerDetails;
