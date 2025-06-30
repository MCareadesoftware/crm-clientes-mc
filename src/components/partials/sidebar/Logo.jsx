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
import LogoMCLarge from "@/assets/images/logo/LogoMCLarge.png";
import LogoMCLargeWhite from "@/assets/images/logo/LogoMCLargeWhite.png";

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
          {(!collapsed || menuHover) && (
            <div className="flex items-center">
              <h1>
                <img className="w-40" src={isDark ? LogoMCLargeWhite : LogoMCLarge} alt="Logo Monstruo Creativo" />
              </h1>
            </div>
          )}
        </div>
      </Link>

      {(!collapsed || menuHover) && (
        <button onClick={() => setMenuCollapsed(!collapsed)}>
          <Collapse className="text-orange-500" />
        </button>
      )}
    </div>
  );
};

export default SidebarLogo;
