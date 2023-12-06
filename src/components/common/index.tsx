import { MutableRefObject } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Oval } from "react-loader-spinner";
import { axiosService } from "@/features/base/services";
import { darkThemeClass } from "@/utils/utils";

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

interface CustomBackProps {
  routeTo: string;
  paramsObj: Record<string, any>;
  theme: string;
  mb?: string;
  mt?: string;
}

interface DownloadProps {
  popUp: () => void;
  downloadRef: MutableRefObject<HTMLButtonElement | null>;
  theme: string;
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

export const handleDownload = async (
  fileObj: { url: string },
  token: string,
) => {
  try {
    const response = await axiosService.download(fileObj.url, token);

    const contentDisposition = response.headers["content-disposition"];

    const lastModified = response.headers["last-modified"];

    const match =
      contentDisposition && contentDisposition.match(/filename="(.+?)"/);
    const timestamp = lastModified
      ? new Date(lastModified).getTime()
      : new Date().getTime();
    const filename = match ? match[1] : timestamp;

    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });

    const link = document.createElement("a");
    const objectUrl = URL.createObjectURL(blob);

    link.href = objectUrl;
    link.download = filename;
    link.setAttribute("target", `_blank`);
    link.setAttribute("rel", "noopener");
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(objectUrl);
  } catch (error) {
    console.log("error downloading file", error);
  }
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

export const CustomBackButton = (props: CustomBackProps) => {
  const navigate = useNavigate();
  const goBack = () => {
    let params = new URLSearchParams(props.paramsObj);
    navigate(`/${props.routeTo}/?${params.toString()}`);
  };
  const btn = darkThemeClass("btn-dark", props.theme);
  return (
    <div className={`${props.mt} ${props.mb}`}>
      <span className={`btn btn-default ${btn}`} onClick={goBack}>
        <i className="las la-arrow-left"></i> Back
      </span>
    </div>
  );
};

export const HarvesterLink = (props: {
  harvester?: { id: number; harv_id: number };
}) => {
  return (
    <Link to={`/harvesters/${props.harvester?.id}`}>
      {props.harvester?.harv_id}
    </Link>
  );
};

export const DownloadButton = (props: DownloadProps) => {
  const btn = darkThemeClass("btn-dark", props.theme);
  return (
    <div className="flex-right mb-2">
      <span onClick={props.popUp} className={`btn btn-default mx-2 ${btn}`}>
        Get Files
      </span>
      <button
        ref={props.downloadRef}
        data-bs-toggle="modal"
        data-bs-target="#downloadModal"
        style={{ display: "none" }}
      >
        Get Files
      </button>
    </div>
  );
};
