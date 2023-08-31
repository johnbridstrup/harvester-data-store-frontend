import { useState, ReactNode } from "react";
import { useDispatch } from "react-redux";
import useThemeSetter from "@/hooks/useThemeSetter";
import { isBrowserDefaultDark } from "@/utils/utils";
import { setAppTheme } from "@/features/home/homeSlice";
import Navbar from "../navbar";
import SideBar from "../sidebar";

interface MainLayoutProps {
  children: ReactNode;
}

function MainLayout(props: MainLayoutProps) {
  const [openSideBar, setOpenSideBar] = useState(false);
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

  const handleOpenSide = () => setOpenSideBar(true);
  const handleCloseSide = () => setOpenSideBar(false);

  return (
    <>
      <Navbar
        handleThemeChange={handleThemeChange}
        openSideBar={handleOpenSide}
      />
      <SideBar openSideBar={openSideBar} closeSideBar={handleCloseSide} />
      <div className="main-layout">{props.children}</div>
    </>
  );
}

export default MainLayout;
