import { useState } from "react";
import { useAppSelector } from "@/app/hooks";
import { ClipboardDiv } from "../styled";
import { darkThemeClass } from "@/utils/utils";
import { API_URL } from "@/features/base/constants";

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
