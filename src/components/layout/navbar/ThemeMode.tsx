import AutoMode from "@/assets/svg/automode";
import DarkMode from "@/assets/svg/darkmode";
import LightMode from "@/assets/svg/lightmode";
import { darkThemeClass } from "@/utils/utils";

interface ThemeModeProps {
  theme: string | null;
  handleChange: (theme: string) => void;
}

function ThemeMode(props: ThemeModeProps) {
  const { handleChange, theme } = props;
  const darktheme = darkThemeClass("dt-theme-mode", theme);
  const svgcolor = darkThemeClass("#fff", theme);
  return (
    <div className={`theme-mode ${darktheme}`}>
      <div
        className="theme-groups cursor hover3"
        onClick={() => handleChange("auto")}
      >
        <AutoMode color={svgcolor} /> <span> OS Default</span>
      </div>
      <div
        className="theme-groups cursor hover3"
        onClick={() => handleChange("light")}
      >
        <LightMode color={svgcolor} /> <span> Light</span>
      </div>
      <div
        className="theme-groups cursor hover3"
        onClick={() => handleChange("dark")}
      >
        <DarkMode color={svgcolor} /> <span> Dark</span>
      </div>
    </div>
  );
}

export default ThemeMode;
