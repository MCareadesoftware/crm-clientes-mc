import React from "react";

const ModalDescuento = ({ open, onClose }) => {
  if (!open) return null;
  const animateButton = {
    animation: 'pulse-scale 1.5s infinite ease-in-out, wiggle 3s infinite'
  };

  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay clickeable */}
      <div
        className="fixed inset-0 bg-black bg-opacity-60"
        onClick={onClose}
        tabIndex={-1}
        aria-label="Cerrar modal"
      />
      <div
        className="relative rounded-lg shadow-lg flex flex-col md:flex-row items-center justify-center p-0 overflow-hidden"
        style={{ width: '90vw', maxWidth: 500, minHeight: 260, maxHeight: 400, background: 'linear-gradient(135deg, #FE6400 60%, #FFB347 100%)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Botón de cierre */}
        <button
          onClick={onClose}
          aria-label="Cerrar modal"
          className="absolute top-2 right-2 text-white text-2xl font-bold bg-black bg-opacity-40 rounded-full w-8 h-8 flex items-center justify-center hover:bg-opacity-70 transition z-10"
        >
          ×
        </button>
        {/* SVG decorativo lupa (esquina sup izq) */}
        <img src="/lupa.svg" alt="Lupa" className="absolute top-2 w-20 h-20 opacity-80" style={{ left: '-12px' }} />
        {/* SVG decorativo video (esquina sup der) */}
        <img src="/video.svg" alt="Video" className="absolute right-12 top-2 w-8 h-8 opacity-80" />
        {/* SVG decorativo iconomomorado (esquina inf der) */}
        <img src="/iconomomorado.svg" alt="Decoración" className="absolute right-2 bottom-2 w-10 h-10 opacity-80" />
        {/* Columna izquierda: logo Google Ads */}
        <div className="flex flex-col items-center justify-center md:w-1/2 w-full py-6 md:py-0">
          <div className="bg-white rounded-full flex items-center justify-center w-36 h-36 shadow-lg mx-auto">
            <img src="/Google_Ads_logo 1.svg" alt="Google Ads" className="w-74 h-74 object-contain" />
          </div>
        </div>
        {/* Columna derecha: textos y botón */}
        <div className="flex flex-col items-center md:items-start justify-center md:w-1/2 w-full px-6 py-4">
          <h2 className="text-white text-xl md:text-2xl font-bold mb-2 text-center md:text-left leading-tight">Tu impulso digital<br />empieza hoy</h2>
          <p className="text-white text-base md:text-sm mb-1 text-center md:text-left">Activa tu primera campaña en Google Ads con</p>
          <span className="text-white text-lg md:text-xl font-bold mb-2 text-center md:text-left">10% de descuento</span>
          <button
  onClick={() => {
    window.open('https://wa.link/awiq4g', '_blank');
  }}
  className="bg-[#1A357B] hover:bg-[#0d1d3a] text-white font-bold py-2 px-4 rounded-lg shadow-md mt-2 w-full md:w-auto text-sm md:text-base animate-attract"
  tabIndex={0}
  aria-label="Solicita tu cupón ahora"
>
  SOLICITA TU CUPÓN AHORA
</button>


        </div>
      </div>
    </div>
  );
};




export default ModalDescuento;
