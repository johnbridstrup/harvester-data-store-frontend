import { useState } from "react";
import { useAppSelector } from "@/app/hooks";
import { ClipboardDiv } from "../styled";
import { darkThemeClass } from "@/utils/utils";
import { API_URL } from "@/features/base/constants";

interface ConfigProps {
  paretoArr: Array<{
    id: string;
    paretos: { xlabels: Array<string>; ydata: Array<number> };
    aggregate_query: string;
    chart_title: string;
  }>;
  paramsObj: Record<string, any>;
  theme: string;
}

export function CopyToClipboard() {
  const [copied, setCopied] = useState(false);
  const { queryUrl } = useAppSelector((state) => state.errorreport);
  const { theme } = useAppSelector((state) => state.home);
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch (error) {
      console.log("error", error);
    }
    setTimeout(function () {
      setCopied(false);
    }, 3000);
  };
  const copyURL = async () => {
    if (typeof queryUrl === "string" && queryUrl.length > 0) {
      await copy(queryUrl);
    } else {
      await copy(API_URL + "/errorreports");
    }
  };
  const btn = darkThemeClass("btn-dark", theme);
  return (
    <ClipboardDiv>
      <button onClick={copyURL} className={`btn ${btn}`}>
        {copied ? (
          <span className="las la-check-double text-success">copied</span>
        ) : (
          "copy query"
        )}
      </button>
    </ClipboardDiv>
  );
}

export const CopyBuildConfig = (props: ConfigProps) => {
  const [copied, setCopied] = useState(false);
  const btn = darkThemeClass("btn-dark", props.theme);
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch (error) {
      console.log("error", error);
    }
    setTimeout(function () {
      setCopied(false);
    }, 3000);
  };

  const buildConfig = async () => {
    let config = props?.paretoArr.slice().map((pareto) => {
      return pareto.aggregate_query;
    });
    props.paramsObj["configs"] = config;
    let params = new URLSearchParams(props.paramsObj);
    let public_url =
      process.env.REACT_APP_HOSTED_URL || "http://localhost:3000";
    let configUrl = `/errorreports/view/pareto/?${params.toString()}`;
    await copy(public_url + configUrl);
  };

  return (
    <button onClick={buildConfig} className={`btn mx-2 ${btn}`}>
      {copied ? (
        <span className="las la-check-double text-success">copied</span>
      ) : (
        "copy config"
      )}
    </button>
  );
};
