import React, { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import ReactPlayer from "react-player/youtube";
import axios from "axios";
import { toast } from "react-toastify";
import { BACKEND } from "../../configs/envConfig";
const EncuestaDetailsPageDetails = ({
  questionData,
  updateRespuesta,
  updateRespuestaListSingle,
  updateRespuestaListMultiple,
  updateMediaId,
  updateMediaObj,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileType, setSelectedFileType] = useState("");
  if (!questionData) return;

  const toggleValueArray = (array, objectToAddOrRemove) => {
    const isObjectPresent = array.some((obj) =>
      isEqual(obj, objectToAddOrRemove)
    );

    if (isObjectPresent) {
      // Object is present, remove it from the array
      const newArray = array.filter(
        (obj) => !isEqual(obj, objectToAddOrRemove)
      );
      updateRespuestaListMultiple(
        questionData.page,
        newArray,
        newArray.reduce((acc, value) => value.puntos + acc, 0)
      );
    } else {
      // Object is not present, add it to the array
      array.push(objectToAddOrRemove);
      updateRespuestaListMultiple(
        questionData.page,
        array,
        array.reduce((acc, value) => value.puntos + acc, 0)
      );
    }
  };

  function isEqual(obj1, obj2) {
    return obj1.respuesta === obj2.respuesta && obj1.puntos === obj2.puntos;
  }

  const handleFileUpload = async (event) => {
    try {
      const file = event.target.files[0];
      if (file.size > 5 * 1000000) {
        window.alert("Archivo superior a 5mb");
        return;
      }
      if (file) {
        // Update state with the selected file
        updateMediaObj(questionData.page, file, file.type);

        const formData = new FormData();
        formData.append("file", file);

        await axios
          .post(`${BACKEND}/formularioServicioRespuestaFoto`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then(({ data }) => {
            updateMediaId(questionData.page, data.doc.id,file,file.type);
            toast.success("Archivo subido");
          });
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al subir esta imagen", {
        style: { zIndex: 9999 },
        position: "top-center",
      });
    }
  };

  return (
    <div className=" dark:bg-gray-800 bg-white  p-4 rounded-md">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-shrink-0">
          <img src="/letter of services.svg" alt="Pregunta" className="w-8 h-8" />
        </div>
        <h1 className=" font-bold text-xl text-gray-800 dark:text-blue-300">
          {questionData?.preguntaTexto}
        </h1>
      </div>
      {questionData.linkYoutube && (
        <div className=" w-full flex justify-center pt-10">
          <div className=" rounded-xl w-full">
            <ReactPlayer
              width={"100%"}
              height={"500px"}
              controls={true}
              style={{ width: "100%", borderRadius: "20px" }}
              url={questionData?.linkYoutube}
            />
          </div>
        </div>
      )}

      {questionData.preguntaMedia &&
        questionData?.preguntaMedia?.mimeType.startsWith("image/") && (
          <div className=" flex justify-center">
            <img
              alt="upload"
              src={questionData.preguntaMedia.url} // Use createObjectURL for local files
              style={{ maxWidth: "100%", maxHeight: "300px" }}
              className=" rounded-md"
            />
          </div>
        )}
      {questionData.preguntaMedia &&
        !questionData?.preguntaMedia?.mimeType.startsWith("image/") && (
          <div className=" w-full flex justify-start py-8 items-center gap-4">
            <a
              target="_blank"
              href={questionData.preguntaMedia.url}
              className=" flex justify-center gap-2 items-center bg-green-50 text-green-700 rounded-md p-2"
            >
              <FaCheckCircle />
              {questionData.preguntaMedia.filename}
            </a>
          </div>
        )}

      {questionData.tipo === "alternativas" && (
        <div>
          {questionData.alternativas.map((alternativa) => (
            <div
              key={alternativa.id}
              className="flex items-center ps-4 border border-gray-200 rounded dark:border-gray-700"
            >
              <input
                id={alternativa.id}
                type="radio"
                checked={questionData.respuesta === alternativa.respuesta}
                value={alternativa.respuesta}
                onChange={(x) =>
                  updateRespuestaListSingle(
                    questionData.page,
                    x.target.value,
                    questionData.alternativas.find(
                      (alt) => alt.respuesta === x.target.value
                    ).puntos
                  )
                }
                name="bordered-radio"
                class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="bordered-radio-1"
                className="w-full py-4 ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                {alternativa.respuesta}
              </label>
            </div>
          ))}
        </div>
      )}
      {questionData.tipo === "respuesta" && (
        <div className=" pt-10">
          <label
            htmlFor="message"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Respuesta
          </label>
          <textarea
            htmlFor="message"
            rows="4"
            value={questionData.respuesta}
            onChange={(e) => {
              updateRespuesta(questionData.page, e.target.value);
            }}
            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Escribe tu respuesta aquí..."
          ></textarea>
        </div>
      )}

      {questionData.tipo === "seleccionMultiple" && (
        <div className=" py-8">
          {questionData.alternativas.map((alt) => (
            <div key={alt.id} class="flex items-center mb-4">
              <input
                id={alt.id}
                checked={questionData.respuestaList.some(
                  (value) => value.respuesta === alt.respuesta
                )}
                type="checkbox"
                onChange={(e) => {
                  toggleValueArray(questionData.respuestaList, {
                    respuesta: e.target.value,
                    puntos: questionData.alternativas.find(
                      (x) => x.respuesta === e.target.value
                    ).puntos,
                  });
                }}
                value={alt.respuesta}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor={alt.id}
                className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                {alt.respuesta}
              </label>
            </div>
          ))}
        </div>
      )}

      {questionData.habilitarMedia && <div className="flex flex-col gap-4 items-center justify-center w-full mt-10">
        {questionData.selectedFile &&
          questionData.selectedFileType.startsWith("image/") && (
            <div>
              <img
                alt="upload"
                src={URL.createObjectURL(questionData.selectedFile)} // Use createObjectURL for local files
                style={{ maxWidth: "100%", maxHeight: "300px" }}
                className=" rounded-md"
              />
            </div>
          )}
        {questionData.selectedFile && (
          <div className=" w-full flex justify-center items-center gap-4">
            <div className=" flex justify-center gap-2 items-center bg-green-50 text-green-700 rounded-md p-2">
              {questionData.selectedFile.name}
              <FaCheckCircle />
            </div>
            <button
              onClick={() => {
                updateMediaObj(questionData.page, null, "");
              }}
              className="p-2 bg-red-50 rounded-md flex justify-center text-red-700 hover:text-red-800"
            >
              <MdClose />
            </button>
          </div>
        )}
        {!questionData.selectedFile && (
          <label
            htmlFor="dropzone-file"
            onDrop={handleFileUpload}
            className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg
                className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 16"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                />
              </svg>
              <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-semibold">
                  Click para subir tu archivo
                </span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                SVG, PNG, JPG , WEBP, PDF, DOC, DOCX, XLS (MAX. 5MB)
              </p>
            </div>
            <input
              onChange={handleFileUpload}
              id="dropzone-file"
              accept=".pdf, .doc, .docx, .xls, image/*"
              type="file"
              className="hidden"
            />
          </label>
        )}
      </div>}
    </div>
  );
};

export default EncuestaDetailsPageDetails;
