import { useState, ReactNode } from "react";
import { useDispatch } from "react-redux";
import useThemeSetter from "@/hooks/useThemeSetter";
import { isBrowserDefaultDark } from "@/utils/utils";
import { setAppTheme } from "@/features/home/homeSlice";
import Navbar from "../navbar";

interface MainLayoutProps {
  children: ReactNode;
}

function MainLayout(props: MainLayoutProps) {
  const dispatch = useDispatch();
  const [_, setTheme] = useState<string>(() => {
    let mode = localStorage.getItem("theme");
    if (mode === "auto" && isBrowserDefaultDark()) {
      return "dark";
    }
    if (mode === "auto") {
      return mode;
    } else {
      return "light";
    }
  });

  useThemeSetter((themeMode) => {
    setTheme(themeMode);
    dispatch(setAppTheme(themeMode));
  });

  const handleThemeChange = (mode: string) => {
    setTheme(mode);
    localStorage.setItem("theme", mode);
  };

  return (
    <>
      <Navbar handleThemeChange={handleThemeChange} />
      <div className="main-layout">{props.children}</div>
    </>
  );
}

MainLayout.propTypes = {};

export default MainLayout;
