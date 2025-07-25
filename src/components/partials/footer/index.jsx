import React from "react";
import useFooterType from "@/hooks/useFooterType";

const Footer = ({ className = "custom-class" }) => {
  const currentYear = new Date().toLocaleDateString().split("/")[2];

  const [footerType] = useFooterType();
  const footerclassName = () => {
    switch (footerType) {
      case "sticky":
        return "sticky bottom-0 z-[999]";
      case "static":
        return "static";
      case "hidden":
        return "hidden";
    }
  };
  return (
    <footer className={className + " " + footerclassName()}>
    <div className="site-footer px-6 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
      <div className="flex justify-center items-center py-6">
        <span className="text-xs tracking-wide text-slate-400 font-light text-center">
          © {currentYear} Monstruo Creativo · Todos los derechos reservados
        </span>
          {/* <div className="ltr:md:text-right rtl:md:text-end text-center text-sm">
            Hand-crafted & Made by{" "}
            <a
              href="https://codeshaper.net"
              target="_blank"
              className="text-primary-500 font-semibold"
            >
              Codeshaper
            </a>
          </div> */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
