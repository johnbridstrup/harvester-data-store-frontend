import { Link } from "react-router-dom";
import { darkThemeClass, imagePath } from "@/utils/utils";

interface MenuProps {
  theme: string | null;
  icon: string;
  href: string;
  name: string;
  description: string;
}

function AllMenuItem(props: MenuProps) {
  const spancolor = darkThemeClass("dt-span-color", props.theme);

  return (
    <div className="all-menu-item hover1">
      <img src={imagePath(props.icon)} alt="menu" />
      <Link to={props.href} className="all-menu-col">
        <span className={`all-menu-col-first ${spancolor}`}>{props.name}</span>
        <span className={`all-menu-col-last`}>{props.description}</span>
      </Link>
    </div>
  );
}

export default AllMenuItem;
