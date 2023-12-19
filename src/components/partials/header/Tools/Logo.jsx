import React from "react";
import useDarkMode from "@/hooks/useDarkMode";
import { Link } from "react-router-dom";
import useWidth from "@/hooks/useWidth";

import MainLogo from "@/assets/images/logo/sidebar-logo.webp";
import LogoWhite from "@/assets/images/logo/sidebar-logo.webp";
import MobileLogo from "@/assets/images/logo/sidebar-logo.webp";
import MobileLogoWhite from "@/assets/images/logo/sidebar-logo.webp";
const Logo = () => {
  const [isDark] = useDarkMode();
  const { width, breakpoints } = useWidth();

  return (
    <div>
      <Link to="/servicios-activos">
        {width >= breakpoints.xl ? (
          <img  className="w-6 h-6" src={isDark ? LogoWhite : MainLogo} alt="" />
        ) : (
          <img className=" w-6 h-6" src={isDark ? MobileLogoWhite : MobileLogo} alt="" />
        )}
      </Link>
    </div>
  );
};

export default Logo;
