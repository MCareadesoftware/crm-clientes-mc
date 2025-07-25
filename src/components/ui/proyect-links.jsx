import { FaExternalLinkAlt, FaEyeSlash } from "react-icons/fa";

const LinkItem = ({ title, link }) => {

  return (
    <div className="flex flex-row w-full bg-gray-50 dark:bg-slate-700 shadow-sm rounded-lg border border-gray-200 dark:border-slate-600 hover:shadow-md transition-all">
      <div className="w-full flex items-center justify-between px-2 py-2">
        <span className="text-xs font-medium text-gray-700 dark:text-slate-200 break-words">{title}</span>
        <span className="text-xs flex items-center gap-2 dark:text-slate-200">
          {!link && <FaEyeSlash className="text-gray-500" />}
          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline"
              tabIndex={0}
              aria-label="Ir al formulario"
            >
              <FaExternalLinkAlt />
            </a>
          )}
        </span>
      </div>
    </div>
  )
} 

const ProyectLinks = ({ servicioData, serviceForm, webOficialLink, demoLink, capacitacionLink }) => {

  const category = servicioData.servicio.categoria

  // Software: Flujo. Roadmap, EsquemaBD, Manual Uso, Capacitacion
  // Webs: Diseño gráfico
  // UI/UX: Figma
  // SEO: Investigación, reporte inicial, reporte final
  // Ads: Plan Trabajo, Informes
  // SMM: Parrilla de contenido
  // Audiovisuales: Audiovisual terminado

  return (
    <div className="flex flex-col gap-2">

      <LinkItem
        title="Formulario" 
        link={serviceForm || null} 
      />
      
      {category === "Software" && (
        <>
          <LinkItem 
            title="Flujo" 
            link={servicioData.linkFlujo || null} 
          />
          <LinkItem 
            title="Roadmap" 
            link={servicioData.linkRoadmap || null} 
          />
          <LinkItem 
            title="Esquema Base de Datos" 
            link={servicioData.linkEsquemaBaseDatos || null} 
          />
          <LinkItem 
            title="Manual de uso" 
            link={servicioData.linkManualUso || null} 
          />
          <LinkItem 
            title="Capacitacion" 
            link={servicioData.linkCapacitacion || null} 
          />
        </>
      )}

      {category === "Web" && (
        <>
          <LinkItem
            title="Link web oficial" 
            link={webOficialLink || null} 
          />
          <LinkItem
            title="Link demo" 
            link={demoLink || null} 
          />
          <LinkItem
            title="Link capacitación" 
            link={capacitacionLink || null} 
          />
        </>
      )}

      {category === "UI/UX" && (
        <LinkItem 
          title="Figma" 
          link={servicioData.linkFigma || null} 
        />
      )}

      {category === "SEO" && (
        <>
          <LinkItem 
            title="Investigación" 
            link={servicioData.linkInvestigacion || null} 
          />
          <LinkItem 
            title="Reporte inicial" 
            link={servicioData.linkReporteInicial || null} 
          />
          <LinkItem 
            title="Reporte final" 
            link={servicioData.linkReporteFinal || null} 
          />  
        </>
      )}

      {category === "ADS" && (
        <>
          <LinkItem 
            title="Informes" 
            link={servicioData.linkInformes || null} 
          />
          <LinkItem 
            title="Plan de trabajo" 
            link={servicioData.linkPlanTrabajo || null} 
          />
        </>
      )}

      {category === "SMM" && (
        <LinkItem 
          title="Parrilla de contenido" 
          link={servicioData.linkParrillaContenido || null} 
        />
      )}

      {category === "Audiovisual" && (
        <LinkItem 
          title="Audiovisual terminado" 
          link={servicioData.linkAudiovisualTerminado || null} 
        />
      )}
    </div>
  )
}

export default ProyectLinks;