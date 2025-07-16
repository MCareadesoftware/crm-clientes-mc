import React, { useCallback } from "react";
import { useSelector } from "react-redux";

const opciones = [
  {
    titulo: "Administración",
    descripcion: "Gestión rápida de pagos y facturación.",
    icon: "/wsp_verdeicon.svg",
    link: "https://wa.link/mtmgs4",
  },
  {
    titulo: "Soporte",
    descripcion: "Solucionamos tus dudas técnicas al instante.",
    icon: "/wsp_verdeicon.svg",
    link: "https://wa.link/v2zwqp",
  },
];

const ModalAyuda = ({ open, onClose }) => {
  // Obtener nombre del cliente desde Redux
  const userRedux = useSelector((state) => state.user.user);
  const razonSocial = userRedux?.razonSocial || "Cliente";

  // Función manejadora para abrir enlaces
  const handleOpenLink = useCallback((link, titulo) => {
    window.open(link, '_blank', 'noopener,noreferrer');
    console.log(`${link} boton clicado ${titulo}`);
  }, []);

  // Función manejadora para eventos de teclado
  const handleKeyDown = useCallback((event, link, titulo) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleOpenLink(link, titulo);
    }
  }, [handleOpenLink]);

  // Renderizado condicional después de los hooks
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end bg-black bg-opacity-60">
      {/* Overlay clickeable */}
      <div
        className="fixed inset-0 bg-black bg-opacity-40"
        onClick={onClose}
        tabIndex={-1}
        aria-label="Cerrar modal"
      />
      <div
        className="relative rounded-xl shadow-2xl bg-white w-[350px] max-w-full overflow-hidden mr-4 mb-24"
        onClick={e => e.stopPropagation()}
      >
        {/* Header naranja */}
        <div className="bg-[#FE6400] flex flex-col px-4 pt-3 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <img src="/wsp.svg" alt="WhatsApp" className="w-7 h-7" />
              <span className="text-white font-bold text-lg">¡Hola, {razonSocial}!</span>
            </div>
            <button 
              onClick={onClose} 
              aria-label="Cerrar modal" 
              className="text-white text-2xl font-bold bg-black bg-opacity-30 rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-60 transition"
            >
              ×
            </button>
          </div>
          <p className="text-white text-sm mt-1 mb-0">Estamos listos para ayudarte en lo que necesites.</p>
        </div>
        {/* Opciones de ayuda */}
        <div className="divide-y divide-slate-100">
          {opciones.map((op) => (  
            <div 
              key={op.titulo} 
              className="flex items-start gap-2 px-4 py-3 group cursor-pointer hover:bg-slate-50 transition-colors"
              onClick={() => handleOpenLink(op.link, op.titulo)}
              onKeyDown={(e) => handleKeyDown(e, op.link, op.titulo)}
              tabIndex={0}
              role="button"
              aria-label={`Abrir ${op.titulo} en WhatsApp`}
            >
              {/* Línea verde */}
              <div className="w-1 h-10 mt-1 bg-[#45B800] rounded-full mr-2" />
              {/* Icono y textos */}
              <img src={op.icon} alt="WhatsApp" className="w-7 h-7 mt-1" />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-800 text-base leading-tight">{op.titulo}</div>
                <div className="text-slate-600 text-sm leading-tight mt-0.5">{op.descripcion}</div>
              </div>
              {/* Flecha */}
              <svg width="18" height="18" fill="none" className="mt-2 ml-2">
                <path d="M7 13l4-4-4-4" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModalAyuda;
