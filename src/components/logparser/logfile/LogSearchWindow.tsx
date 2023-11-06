import { useState } from "react";
import { useAppSelector } from "@/app/hooks";
import { darkThemeClass } from "@/utils/utils";
import { ActionTypesEnum, Content } from "@/features/logparser/logparserTypes";

interface LogProps {
  dispatchAction: (args0: any) => void;
  virtuoso: any;
  internal: {
    search: {
      currentIndex: number | null;
      content: Content[];
      countIndex: number;
      searchText: string | null;
    };
  };
}

function LogSearchWindow(props: LogProps) {
  const [search, setSearch] = useState("");
  const [borderEffect, setBorderEffect] = useState({
    up: false,
    down: false,
    exit: false,
  });
  const {
    search: { currentIndex, content, countIndex, searchText },
  } = props.internal;
  const { theme } = useAppSelector((state) => state.home);
  const currIndex = content.length > 0 ? countIndex + 1 : countIndex;
  const inputdark = darkThemeClass("dt-log-search", theme);
  const btn = darkThemeClass("btn-dark", theme);

  const handleKeyDown = async (e: any) => {
    if (e.key === "Enter") {
      if (search !== searchText) {
        props.dispatchAction({ type: ActionTypesEnum.ON_CLEAR_SEARCH });
        props.dispatchAction({
          type: ActionTypesEnum.ON_LOG_SEARCH,
          payload: search,
        });
        await scrollToIndex();
      } else if (searchText) {
        await scrollToLogIndex("down", true);
      } else {
        return;
      }
    }
  };

  const scrollToIndex = () => {
    return new Promise((resolve, _) => {
      props.virtuoso?.current?.scrollToIndex({
        index: currentIndex,
        align: "start",
        behavior: "auto",
      });
      resolve(currentIndex);
    });
  };

  const scrollToLogIndex = async (
    direction: string,
    ignore: boolean = false,
  ) => {
    props.dispatchAction({
      type: ActionTypesEnum.ON_SCROLL_INDEX,
      payload: direction,
    });
    borderVisual(direction, ignore);
    await scrollToIndex();
  };

  const exitSearch = () => {
    setSearch("");
    props.dispatchAction({ type: ActionTypesEnum.ON_CLEAR_SEARCH });
    borderVisual("exit");
  };

  const borderVisual = (direction: string, ignore: boolean = false) => {
    if (direction === "up" && !ignore) {
      setBorderEffect((current) => {
        return { ...current, up: true };
      });
      setTimeout(() => {
        setBorderEffect((current) => {
          return { ...current, up: false };
        });
      }, 100);
    } else if (direction === "down" && !ignore) {
      setBorderEffect((current) => {
        return { ...current, down: true };
      });
      setTimeout(() => {
        setBorderEffect((current) => {
          return { ...current, down: false };
        });
      }, 100);
    } else if (direction === "exit" && !ignore) {
      setBorderEffect((current) => {
        return { ...current, exit: true };
      });
      setTimeout(() => {
        setBorderEffect((current) => {
          return { ...current, exit: false };
        });
      }, 100);
    } else {
      return;
    }
  };

  return (
    <div className="nav-wrap mb-4">
      <div className="nav-body">
        <div className="nav-search">
          <div className="find-bar">
            <div className="find-bar-text">
              <input
                type="text"
                name="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                className={`${inputdark}`}
              />
              <span>
                {currIndex}/{content.length}
              </span>
            </div>
            <div className="find-bar-icons">
              <span
                onClick={() => scrollToLogIndex("up")}
                className={`btn ${borderEffect.up && "bordered-btn"} ${btn}`}
              >
                <i className="las la-arrow-up"></i>
              </span>
              <span
                onClick={() => scrollToLogIndex("down")}
                className={`btn ${borderEffect.down && "bordered-btn"} ${btn}`}
              >
                <i className="las la-arrow-down"></i>
              </span>
              <span
                className={`btn ${borderEffect.exit && "bordered-btn"} ${btn}`}
                onClick={exitSearch}
              >
                <i className="las la-times"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LogSearchWindow;
