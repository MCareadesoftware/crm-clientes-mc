import React from "react";
import Icon from "@/components/ui/Icon";
import SwitchDark from "./Tools/SwitchDark";
import HorizentalMenu from "./Tools/HorizentalMenu";
import useWidth from "@/hooks/useWidth";
import useSidebar from "@/hooks/useSidebar";
import useNavbarType from "@/hooks/useNavbarType";
import useMenulayout from "@/hooks/useMenulayout";
import useSkin from "@/hooks/useSkin";
import Logo from "./Tools/Logo";
import SearchModal from "./Tools/SearchModal";
import Profile from "./Tools/Profile";
import Notification from "./Tools/Notification";
import Message from "./Tools/Message";
import Language from "./Tools/Language";
import useRtl from "@/hooks/useRtl";
import useMobileMenu from "@/hooks/useMobileMenu";
import MonoChrome from "./Tools/MonoChrome";
import Collapse from "../../../assets/images/svg/Collapse.jsx";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { useSelector } from "react-redux";

const Header = ({ className = "custom-class" }) => {
  const [collapsed, setMenuCollapsed] = useSidebar();
  const { width, breakpoints } = useWidth();
  const [navbarType] = useNavbarType();
  const navbarTypeClass = () => {
    switch (navbarType) {
      case "floating":
        return "floating  has-sticky-header";
      case "sticky":
        return "sticky top-0 z-[999]";
      case "static":
        return "static";
      case "hidden":
        return "hidden";
      default:
        return "sticky top-0";
    }
  };
  const [menuType] = useMenulayout();
  const [skin] = useSkin();
  const [isRtl] = useRtl();

  const [mobileMenu, setMobileMenu] = useMobileMenu();
  const userRedux = useSelector((state) => state.user.user);
  const razonSocial = userRedux?.razonSocial || "";

  const handleOpenMobileMenu = () => {
    setMobileMenu(!mobileMenu);
  };

  const borderSwicthClass = () => {
    if (skin === "bordered" && navbarType !== "floating") {
      return "border-b border-slate-200 dark:border-slate-700";
    } else if (skin === "bordered" && navbarType === "floating") {
      return "border border-slate-200 dark:border-slate-700";
    } else {
      return "dark:border-b dark:border-slate-700 dark:border-opacity-60";
    }
  };
  return (
    <header className={className + " " + navbarTypeClass()}>
      <div
        className={`app-header md:px-6 px-[15px] dark:bg-slate-800 shadow-base dark:shadow-base3 bg-white ${borderSwicthClass()} min-h-[64px] flex items-center`}
      >
        <div className="flex items-center w-full gap-4 min-h-[64px]">
          {/* Botón menú/Logo */}
          {menuType === "vertical" && (
            <div className="flex items-center md:space-x-4 space-x-2 rtl:space-x-reverse">
              {collapsed && width >= breakpoints.xl && (
                <button
                  className="text-xl text-slate-900 dark:text-white"
                  onClick={() => setMenuCollapsed(!collapsed)}
                >
                  <img src="/menu.svg" alt="Expandir/collapse sidebar" className="w-8 h-8" />
                </button>
              )}
              {width < breakpoints.xl && <Logo />}
              {width < breakpoints.xl && width >= breakpoints.md && (
                <div
                  className="cursor-pointer text-slate-900 dark:text-white text-2xl"
                  onClick={handleOpenMobileMenu}
                >
                  <img src="/menu.svg" alt="Abrir menú" className="w-8 h-8" />
                </div>
              )}
            </div>
          )}
          {menuType === "horizontal" && (
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Logo />
              {width <= breakpoints.xl && (
                <div
                  className="cursor-pointer text-slate-900 dark:text-white text-2xl"
                  onClick={handleOpenMobileMenu}
                >
                  <img src="/menu.svg" alt="Abrir menú" className="w-8 h-8" />
                </div>
              )}
            </div>
          )}
          {/* Breadcrumb personalizado después del icono de colisión y antes del banner */}
          <div className="flex items-center space-x-2 ml-2 max-w-xs">
            <span className="text-sm text-slate-400">Cliente</span>
            <span className="text-slate-400">
              <svg width="16" height="16" fill="none"><path d="M6 12l4-4-4-4" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
            <span
              className="text-xs font-bold text-slate-900 dark:text-white truncate whitespace-nowrap overflow-hidden max-w-[160px]"
              tabIndex={0}
              aria-label={`Nombre del cliente: ${razonSocial}`}
              title={razonSocial}
            >
              {razonSocial}
            </span>
          </div>
          {/* Banner alineado a la derecha */}



          <div className="flex justify-end w-full pr-4">
            <button
              type="button"
              tabIndex={0}
              aria-label="Ir a Google Ads WhatsApp"
              onClick={() => window.open('https://wa.link/awiq4g', '_blank')}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') window.open('https://wa.link/awiq4g', '_blank'); }}
              className="focus:outline-none"
            >
              <img src="/Banner.png" alt="Banner Google Ads" className="h-full max-w-xs rounded-lg shadow-md hidden md:block" />
            </button>
          </div>

          {/* Iconos y usuario */}
          <div className="nav-tools flex items-center lg:space-x-6 space-x-3 rtl:space-x-reverse flex-shrink-0">
            <SwitchDark />
            <MonoChrome />
            {width >= breakpoints.md && <Profile />}
            {width <= breakpoints.md && (
              <div
                className="cursor-pointer text-slate-900 dark:text-white text-2xl"
                onClick={handleOpenMobileMenu}
              >
                <img src="/menu.svg" alt="Abrir menú" className="w-8 h-8" />
              </div>
            )}
          </div>
        </div>
        {/* Menú horizontal si aplica */}
        {menuType === "horizontal" && width >= breakpoints.xl ? (
          <HorizentalMenu />
        ) : null}
      </div>
    </header>
  );
};

export default Header;
