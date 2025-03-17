import React from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/Icon";
import useDarkMode from "@/hooks/useDarkMode";
import useSidebar from "@/hooks/useSidebar";
import useSemiDark from "@/hooks/useSemiDark";
import useSkin from "@/hooks/useSkin";
import collapse from "@/assets/images/svg/collapse.svg";
// import images
import MobileLogo from "@/assets/images/logo/sidebar-logo.webp";
import MobileLogoWhite from "@/assets/images/logo/sidebar-logo.webp";
import Collapse from "../../../assets/images/svg/Collapse";

const SidebarLogo = ({ menuHover }) => {
  const [isDark] = useDarkMode();
  const [collapsed, setMenuCollapsed] = useSidebar();
  // semi dark
  const [isSemiDark] = useSemiDark();
  // skin
  const [skin] = useSkin();
  return (
    <div
      className={`  flex justify-between  items-center gap-2 bg-white dark:bg-slate-800 z-[9] py-6  px-4 
      ${menuHover ? "" : ""}
      ${
        skin === "bordered"
          ? " border-b border-r-0 border-slate-200 dark:border-slate-700"
          : " border-none"
      }
      
      `}
    >
      <Link to="/servicios-activos">
        <div className="flex items-center space-x-4">
          <div className="logo-icon">
            {!isDark && !isSemiDark ? (
              <img className=" w-8 h-8" src={MobileLogo} alt="" />
            ) : (
              <img className=" w-8 h-8" src={MobileLogoWhite} alt="" />
            )}
          </div>

          {(!collapsed || menuHover) && (
            <div>
              <h1 className=" text-base font-semibold text-slate-900 dark:text-slate-100">
                Monstruo Creativo
              </h1>
            </div>
          )}
        </div>
      </Link>

      {(!collapsed || menuHover) && (
        <button onClick={() => setMenuCollapsed(!collapsed)}>
          <Collapse />
        </button>
      )}
    </div>
  );
};

export default SidebarLogo;
