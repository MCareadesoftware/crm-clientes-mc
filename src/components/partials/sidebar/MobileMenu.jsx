import React, { useRef, useEffect, useState } from "react";

import Navmenu from "./Navmenu";
import { menuItems } from "@/constant/data";
import SimpleBar from "simplebar-react";
import useSemiDark from "@/hooks/useSemiDark";
import useSkin from "@/hooks/useSkin";
import useDarkMode from "@/hooks/useDarkMode";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import useMobileMenu from "@/hooks/useMobileMenu";
import Icon from "@/components/ui/Icon";

// import images
import MobileLogo from "@/assets/images/logo/sidebar-logo.webp";
import LogoMCLarge from "@/assets/images/logo/LogoMCLarge.png";
import LogoMCLargeWhite from "@/assets/images/logo/LogoMCLargeWhite.png";
import MobileLogoWhite from "@/assets/images/logo/sidebar-logo.webp";
import svgRabitImage from "@/assets/images/svg/rabit.svg";
import { socialNetworks } from "../../../constant/data";
import { clearUser } from "../../../store/userSlice";
import { toast } from "react-toastify";

const MobileMenu = ({ className = "custom-class" }) => {
  const scrollableNodeRef = useRef();
  const [scroll, setScroll] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    const handleScroll = () => {
      if (scrollableNodeRef.current.scrollTop > 0) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    };
    scrollableNodeRef.current.addEventListener("scroll", handleScroll);
  }, [scrollableNodeRef]);

  const [isSemiDark] = useSemiDark();
  // skin
  const [skin] = useSkin();
  const [isDark] = useDarkMode();
  const [mobileMenu, setMobileMenu] = useMobileMenu();

  const handleLogout = () => {
    dispatch(clearUser());
    setMobileMenu(false);
    navigate("/");
    toast.success("Deslogueado");
  };
  
  return (
    <div className={isSemiDark ? "dark" : ""}>
      <div className={`${className} fixed top-0 bg-white dark:bg-slate-800 shadow-lg h-full w-[248px] flex flex-col`}>
        <div className="logo-segment flex justify-between items-center bg-white dark:bg-slate-800 z-[9] h-[85px] px-4">
          <Link to="/dashboard">
            <div className="flex items-center">
              <h1>
                <img className="w-40" src={isDark ? LogoMCLargeWhite : LogoMCLarge} alt="Logo Monstruo Creativo" />
              </h1>
            </div>
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenu(!mobileMenu)}
            className="cursor-pointer text-slate-900 dark:text-white text-2xl"
          >
            <Icon icon="heroicons:bars-3" className="text-orange-500" />
          </button>
        </div>

        <div
          className={`h-[60px] absolute top-[80px] nav-shadow z-[1] w-full transition-all duration-200 pointer-events-none ${
            scroll ? " opacity-100" : " opacity-0"
          }`}
        ></div>

        <SimpleBar
          className="sidebar-menu px-4 flex-1"
          scrollableNodeProps={{ ref: scrollableNodeRef }}
        >
          <Navmenu menus={menuItems} />
        </SimpleBar>

        {/* Redes sociales en la parte inferior */}
        <div className="px-4 pb-4 mt-auto">
          <div className="flex flex-col bg-slate-50 dark:bg-slate-800 rounded-md p-2">
            <>
              {socialNetworks.map((s) => (
                <a 
                  href={s.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full px-2.5 py-3 rounded-md flex items-center gap-4 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" 
                  key={s.title}
                >
                  <span className="menu-icon flex-grow-0">
                    <img src={s.icon} alt={s.title} className="min-w-[20px] min-h-[20px] w-5 h-5" />
                  </span>
                  <span className="text-box flex-grow text-sm">{s.title}</span>
                  <Icon icon="heroicons:chevron-right" />
                </a>
              ))}
              <button
                type="button"
                onClick={handleLogout}
                className="w-full mt-3 px-2.5 py-3 rounded-md flex justify-between items-center gap-4 bg-red-50 text-red-600 hover:bg-red-100 dark:bg-slate-700 dark:text-red-600 transition-colors"
              >
                <span className="menu-icon flex-grow-0">
                  <Icon icon="heroicons-outline:login" />
                </span>
                <span className="text-box flex-grow text-sm">Cerrar sesión</span>
              </button>
              <div className="w-full mt-4 px-2 py-2 flex flex-row justify-between">
                <span className="text-box text-sm">@monstruocreativo</span>
                <span className="text-box text-sm">2025</span>
              </div>
            </>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
