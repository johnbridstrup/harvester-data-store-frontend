import { darkThemeClass } from "@/utils/utils";
import { Oval } from "react-loader-spinner";
import { Link } from "react-router-dom";

interface LoaderProps {
  size: number;
}

interface HeaderProps {
  className: string;
  title: string;
  id?: string;
}

interface BackProps {
  theme: string | null;
  mb?: string;
  mt?: string;
}

export const Loader = ({ size }: LoaderProps) => {
  return <Oval color="#00BFFF" height={size} width={size} />;
};

export const Header = (props: HeaderProps) => {
  return (
    <div className={props.className}>
      {props.title} {props.id}
    </div>
  );
};

export const handleDownload = async (fileObj: { url: string }) => {
  const link = document.createElement("a");
  link.href = fileObj.url;
  link.setAttribute("target", `_blank`);
  link.setAttribute("rel", "noopener");
  document.body.appendChild(link);
  link.click();
};

export function BackButton(props: BackProps) {
  const goBack = (e: any) => {
    e.preventDefault();
    window.history.back();
  };
  const btn = darkThemeClass("btn-dark", props.theme);
  return (
    <div className={`${props.mb ? props.mb : ""} ${props.mt ? props.mt : ""}`}>
      <Link to={``} className={`btn ${btn}`} onClick={goBack}>
        <i className="las la-arrow-left"></i>Back
      </Link>
    </div>
  );
}
