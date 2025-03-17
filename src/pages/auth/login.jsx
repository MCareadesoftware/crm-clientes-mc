import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import LoginForm from "./common/login-form";
import Social from "./common/social";
import useDarkMode from "@/hooks/useDarkMode";
import { ToastContainer } from "react-toastify";

// image import
import LogoWhite from "@/assets/images/logo/logo-white.svg";
import Logo from "@/assets/images/logo/sidebar-logo.webp";
import Illustration from "@/assets/images/auth/ils1.svg";
import loginBg from "@/assets/images/auth/login_bg.jpg";
import { motion, AnimatePresence } from "framer-motion";

//==================logos apps===================

import logoAllSavfe from "@/assets/images/webp-logos/Logo-AllSavfe.webp";
import logoAura from "@/assets/images/webp-logos/Logo-Aura.webp";
import logoConviertelo from "@/assets/images/webp-logos/Logo-Conviertelo.webp";
import logoLucuma from "@/assets/images/webp-logos/Logo-Lucuma.webp";
import logoMundoDigital from "@/assets/images/webp-logos/Logo-MundoDigital.webp";
import logoNodo from "@/assets/images/webp-logos/Logo-Nodo.webp";
import logoSeoluciones from "@/assets/images/webp-logos/Logo-Seoluciones.webp";
import logoW3b from "@/assets/images/webp-logos/Logo-W3b.webp";

//===============================================

const displayTime = 3000;

const login = () => {
  const [isDark] = useDarkMode();

  const images = [
    Logo,
    logoAllSavfe,
    logoAura,
    logoConviertelo,
    logoLucuma,
    logoMundoDigital,
    logoNodo,
    logoSeoluciones,
    logoW3b,
  ];

  const currentYear = new Date().toLocaleDateString().split("/")[2];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, displayTime);

    return () => clearInterval(interval);
  }, [images.length, displayTime]);

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
            <div className="">
              <img src={loginBg} alt="" className="h-screen object-cover" />
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
                    <AnimatePresence mode="popLayout">
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
                          transition: { duration: 1 },
                        }}
                        exit={{
                          scale: 0.8,
                          opacity: 0,
                          rotateY: 90,
                          z: -100,
                          transition: { duration: 1 },
                        }}
                        className="absolute w-full h-full flex items-center justify-center"
                      >
                        <img
                          src={images[currentImageIndex]}
                          alt={`Slide ${currentImageIndex + 1}`}
                          className="max-w-full max-h-full object-contain"
                        />
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <h4 className="font-medium">Clientes</h4>
                  <div className="text-slate-500 text-base">
                    Ingresa a tu panel de cliente usando Monstruo Cretivo
                    Dashboard
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
                Copyright {currentYear}, Monstruo Creativo Todos los derechos
                reservados .
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default login;
