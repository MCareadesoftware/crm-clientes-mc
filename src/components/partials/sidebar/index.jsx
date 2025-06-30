import React, { useRef, useEffect, useState } from "react";
import SidebarLogo from "./Logo";
import Navmenu from "./Navmenu";
import { menuItems } from "@/constant/data";
import SimpleBar from "simplebar-react";
import useSidebar from "@/hooks/useSidebar";
import useSemiDark from "@/hooks/useSemiDark";
import useSkin from "@/hooks/useSkin";
import svgRabitImage from "@/assets/images/svg/rabit.svg";
import { NavLink } from "react-router-dom";
import { socialNetworks } from "../../../constant/data";
import Icon from "@/components/ui/Icon";

const Sidebar = () => {
  const scrollableNodeRef = useRef();
  const [scroll, setScroll] = useState(false);

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

  const [collapsed, setMenuCollapsed] = useSidebar();
  const [menuHover, setMenuHover] = useState(false);

  // semi dark option
  const [isSemiDark] = useSemiDark();
  // skin
  const [skin] = useSkin();
  return (
    <div className={isSemiDark ? "dark" : ""}>
      <div
        className={`sidebar-wrapper bg-white dark:bg-slate-800 flex flex-col h-full ${
          collapsed ? "w-[72px] close_sidebar" : "w-[256px]"
        }
      ${menuHover ? "" : ""}
      ${
        skin === "bordered"
          ? "border-r border-slate-200 dark:border-slate-700"
          : "shadow-base"
      }
      `}
        onMouseEnter={() => {
          setMenuHover(true);
        }}
        onMouseLeave={() => {
          setMenuHover(false);
        }}
      >
        <SidebarLogo />
        <div
          className={`h-[60px]  absolute top-[80px] nav-shadow z-[1] w-full transition-all duration-200 pointer-events-none ${
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
                <NavLink className="w-full px-2.5 py-3 rounded-md flex items-center gap-4 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors" to={s.link} key={s.title}>
                  <span className="menu-icon flex-grow-0">
                    <s.icon />
                  </span>
                  <span className="text-box flex-grow text-sm">{s.title}</span>
                  <Icon icon="heroicons:chevron-right" />
                </NavLink>
              ))}
              <div className="w-full mt-4 px-2 py-2 flex flex-row justify-between border-t border-slate-200 dark:border-slate-700">
                <span className="text-box text-sm text-slate-500 dark:text-slate-400">@monstruocreativo</span>
                <span className="text-box text-sm text-slate-500 dark:text-slate-400">2025</span>
              </div>
            </>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
