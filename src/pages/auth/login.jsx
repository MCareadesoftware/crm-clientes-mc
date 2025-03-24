import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoginForm from "./common/login-form";
import Social from "./common/social";
import useDarkMode from "@/hooks/useDarkMode";
import { ToastContainer } from "react-toastify";

// image import
// import LogoWhite from "@/assets/images/logo/logo-white.svg";
// import Logo from "@/assets/images/logo/sidebar-logo.webp";
// import Illustration from "@/assets/images/auth/ils1.svg";
// import loginBg from "@/assets/images/auth/login_bg.webp";
import { motion, AnimatePresence } from "framer-motion";

//==================logos apps===================

// import logoAllSavfe from "@/assets/images/webp-logos/Logo-AllSavfe.webp";
// import logoAura from "@/assets/images/webp-logos/Logo-Aura.webp";
// import logoConviertelo from "@/assets/images/webp-logos/Logo-Conviertelo.webp";
// import logoLucuma from "@/assets/images/webp-logos/Logo-Lucuma.webp";
// import logoMundoDigital from "@/assets/images/webp-logos/Logo-MundoDigital.webp";
// import logoNodo from "@/assets/images/webp-logos/Logo-Nodo.webp";
// import logoSeoluciones from "@/assets/images/webp-logos/Logo-Seoluciones.webp";
// import logoW3b from "@/assets/images/webp-logos/Logo-W3B.webp";

// =============================== white logos ==================================

// import logoMCWhite from "@/assets/images/webp-logos/white/logo-MC-1.webp";
// import logoAllSavfeWhite from "@/assets/images/webp-logos/white/Logo-AllSavfe-1.webp";
// import logoAuraWhite from "@/assets/images/webp-logos/white/Logo-Aura-1.webp";
// import logoConvierteloWhite from "@/assets/images/webp-logos/white/Logo-Conviertelo-1.webp";
// import logoLucumaWhite from "@/assets/images/webp-logos/white/Logo-Lucuma-1.webp";
// import logoMundoDigitalWhite from "@/assets/images/webp-logos/white/Logo-MundoDigital-1.webp";
// import logoNodoWhite from "@/assets/images/webp-logos/white/Logo-Nodo-1.webp";
// import logoSeolucionesWhite from "@/assets/images/webp-logos/white/Logo-Seoluciones-1.webp";
// import logoW3bWhite from "@/assets/images/webp-logos/white/Logo-W3B-1.webp";

// ================================== white extended logos ===================================

import logoMCWhiteExtended from "@/assets/images/webp-logos/white-extended/Logo-MC-NGV.webp";
import logoAllSavfeWhiteExtended from "@/assets/images/webp-logos/white-extended/Logo-AllSavfe-NGV.webp";
import logoAuraWhiteExtended from "@/assets/images/webp-logos/white-extended/Logo-AuraBTL-NGV.webp";
import logoConvierteloWhiteExtended from "@/assets/images/webp-logos/white-extended/Logo-Conviertelo-NGV.webp";
import logoLucumaWhiteExtended from "@/assets/images/webp-logos/white-extended/Logo-Lucuma-NGV.webp";
import logoMundoDigitalWhiteExtended from "@/assets/images/webp-logos/white-extended/Logo-MundoDigital-NGV.webp";
import logoNodoWhiteExtended from "@/assets/images/webp-logos/white-extended/Logo-Nodo-NGV.webp";
import logoSeolucionesWhiteExtended from "@/assets/images/webp-logos/white-extended/Logo-Seoluciones-NGV.webp";
import logoW3bWhiteExtended from "@/assets/images/webp-logos/white-extended/Logo-w3b-NGV.webp";

//===============================================

const displayTime = 3000;

const login = () => {
  const [isDark] = useDarkMode();

  const imagesWhite = [
    logoMCWhiteExtended,
    logoAllSavfeWhiteExtended,
    logoAuraWhiteExtended,
    logoConvierteloWhiteExtended,
    logoLucumaWhiteExtended,
    logoMundoDigitalWhiteExtended,
    logoNodoWhiteExtended,
    logoSeolucionesWhiteExtended,
    logoW3bWhiteExtended,
  ];

  // const backgroundColors = [
  //   "#ff6400",
  //   "#6950e8",
  //   "#270059",
  //   "#be1a18",
  //   "#ff7900",
  //   "#0ec6aa",
  //   "#fa1e37",
  //   "#121b3a",
  //   "#ea1341",
  // ];

  // const images = [
  //   Logo,
  //   logoAllSavfe,
  //   logoAura,
  //   logoConviertelo,
  //   logoLucuma,
  //   logoMundoDigital,
  //   logoNodo,
  //   logoSeoluciones,
  //   logoW3b,
  // ];

  const names = [
    "Monstruo Creativo",
    "All Savfe",
    "Aura BTL",
    "Conviertelo",
    "Lucuma",
    "Mundo Digital",
    "Nodo",
    "Seoluciones",
    "W3b.PE",
  ];

  const currentYear = new Date().toLocaleDateString().split("/")[2];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentNameIndex, setCurrentNameIndex] = useState(0);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  //     setCurrentNameIndex((prevIndex) => (prevIndex + 1) % names.length);
  //   }, displayTime);

  //   return () => clearInterval(interval);
  // }, [images.length]);

  useEffect(() => {
    let interval = null;

    // Función para cambiar la imagen
    const updateImage = () => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imagesWhite.length);
      setCurrentNameIndex((prevIndex) => (prevIndex + 1) % names.length);
    };

    // Función para manejar la visibilidad de la página
    const handleVisibilityChange = () => {
      if (document.hidden) {
        if (interval) clearInterval(interval); // Pausar intervalo
      } else {
        updateImage(); // Asegurar que la imagen cambie al volver
        interval = setInterval(updateImage, displayTime); // Reanudar intervalo
      }
    };

    // Iniciar el intervalo cuando el componente se monta
    interval = setInterval(updateImage, displayTime);

    // Escuchar cambios de visibilidad de la página
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (interval) clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [imagesWhite.length]);

  return (
    <>
      <ToastContainer />
      <div className="loginwrapper">
        <div className="lg-inner-column">
          <div className="left-column relative z-[1]">
            {/* <div className="max-w-[520px] pt-20 ltr:pl-20 rtl:pr-20">
              <h4>
                Unlock your Project
                <span className="text-slate-800 dark:text-slate-400 font-bold">
                  performance
                </span>
              </h4>
            </div> */}
            <div className="h-screen w-full flex">
              {/* <img src={loginBg} alt="" className="h-screen object-cover" /> */}

              <AnimatePresence mode="wait">
                <motion.div
                  style={{
                    backgroundColor:
                      currentImageIndex == 0
                        ? backgroundColors.at(-1)
                        : backgroundColors?.[currentImageIndex - 1],
                  }}
                  key={currentImageIndex}
                  // initial={{
                  //   scale: 1,
                  //   opacity: 0,
                  //   //z: -100,
                  //   // Se eliminó rotateY: -90
                  // }}
                  animate={{
                    scale: 1,
                    opacity: 1,
                    //z: 0,
                    // Se eliminó rotateY: 0
                    backgroundColor: backgroundColors[currentImageIndex],
                    transition: { duration: 0.5 },
                  }}
                  // exit={{
                  //   scale: 1,
                  //   opacity: 0,
                  //   //z: -100,
                  //   // Se eliminó rotateY: 90
                  //   transition: { duration: 0.5 },
                  // }}
                  className="relative  w-full h-full flex flex-col gap-2 items-center justify-center"
                >
                  <div className="max-w-[600px] w-full p-4 space-y-4">
                    <motion.div
                      initial={{
                        scale: 0.8,
                        opacity: 0,
                        rotateY: -90,
                        z: -100,
                      }}
                      animate={{
                        scale: 1,
                        opacity: 1,
                        rotateY: 0,
                        z: 0,
                        transition: { duration: 0.5 },
                      }}
                      exit={{
                        scale: 0.8,
                        opacity: 0,
                        rotateY: 90,
                        z: -100,
                        transition: { duration: 0.5 },
                        opacity: 0,
                      }}
                      className="relative flex w-full justify-center pb-[30px]"
                    >
                      <img
                        src={imagesWhite[currentImageIndex]}
                        alt={`Slide ${currentImageIndex + 1}`}
                        className="h-[150px] "
                      />
                    </motion.div>
                    <h3 className="!text-white">¡Bienvenido de nuevo!</h3>
                    <p className="text-white">
                      <span className="text-xl text-white">
                        <b>Estás en el lugar correcto</b>
                      </span>
                      <br />
                      Construimos soluciones que transforman ideas en
                      realidades. Únete a nosotros y lleva tu negocio al
                      siguiente nivel.
                    </p>
                  </div>

                  {/* Fondo con transición por opacidad */}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          <div className="right-column relative">
            <div className="inner-content h-full flex flex-col bg-white dark:bg-slate-800">
              <div className="auth-box h-full flex flex-col justify-center">
                <div className="mobile-logo text-center mb-6 lg:hidden block"></div>
                <div className="text-center 2xl:mb-10 mb-4 space-y-6">
                  {/* <Link to="/" className="my-[20px]">
                    <img src={Logo} alt="" className="mx-auto w-10 h-10" />
                  </Link> */}

                  <div className="relative w-full h-[100px] overflow-hidden">
                    {/* <AnimatePresence mode="wait">
                      <motion.div
                        key={currentImageIndex}
                        initial={{
                          scale: 0.8,
                          opacity: 0,
                          rotateY: -90,
                          z: -100,
                        }}
                        animate={{
                          scale: 1,
                          opacity: 1,
                          rotateY: 0,
                          z: 0,
                          transition: { duration: 0.5 },
                        }}
                        exit={{
                          scale: 0.8,
                          opacity: 0,
                          rotateY: 90,
                          z: -100,
                          transition: { duration: 0.5 },
                          opacity: 0,
                        }}
                        className="absolute w-full h-full flex items-center justify-center"
                      >
                        <img
                          src={images[currentImageIndex]}
                          alt={`Slide ${currentImageIndex + 1}`}
                          className="max-w-full max-h-full object-contain"
                        />
                      </motion.div>
                    </AnimatePresence> */}
                  </div>

                  <h3 className="font-medium">Clientes</h3>
                  <div className="text-slate-500 text-base">
                    Ingresa a tu panel de cliente para revisar tus servicios
                    adquiridos
                  </div>
                </div>
                <LoginForm />
                {/* <div className="relative border-b-[#9AA2AF] border-opacity-[16%] border-b pt-6">
                  <div className="absolute inline-block bg-white dark:bg-slate-800 dark:text-slate-400 left-1/2 top-1/2 transform -translate-x-1/2 px-4 min-w-max text-sm text-slate-500 font-normal">
                    Or continue with
                  </div>
                </div> */}
                {/* <div className="max-w-[242px] mx-auto mt-8 w-full">
                  <Social />
                </div> */}
                {/* <div className="md:max-w-[345px] mx-auto font-normal text-slate-500 dark:text-slate-400 mt-12 uppercase text-sm">
                  ¿Aun no eres cliente?{" "}
                  <a
                    target="_blank"
                    href="api.whatsapp.com/send/?phone=51941046235&text=Hola+vengo+desde+la+pagina+web%2C+y+estoy+interesado+en+ser+cliente"
                    className="text-slate-900 dark:text-white font-medium hover:underline"
                  >
                    Registrate
                  </a>
                </div> */}
              </div>
              <div className="auth-footer text-center">
                Copyright © {currentYear}, <b>{names[currentNameIndex]}</b>.
                Todos los derechos reservados .
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default login;
