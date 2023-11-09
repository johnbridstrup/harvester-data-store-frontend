import { ChangeEvent, useState } from "react";
import { ActionCreatorWithoutPayload } from "@reduxjs/toolkit";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  searchLog,
  clearSearch,
  scrollUpIndex,
  scrollDownIndex,
} from "@/features/logparser/logparserSlice";
import { ActionTypesEnum } from "@/features/logparser/logparserTypes";
import { LogComponent } from "@/features/base/constants";
import { darkThemeClass } from "@/utils/utils";

interface LogProps {
  rate?: number;
  dispatchAction: (args0: any) => void;
  virtuoso: any;
  component: LogComponent;
}

function LogSearch(props: LogProps) {
  const [search, setSearch] = useState("");
  const [borderEffect, setBorderEffect] = useState({
    up: false,
    down: false,
    exit: false,
  });
  const {
    internal: {
      search: { currentIndex, content, countIndex, searchText },
    },
  } = useAppSelector((state) => state.logparser);
  const { theme } = useAppSelector((state) => state.home);
  const dispatch = useAppDispatch();
  const currIndex = content.length > 0 ? countIndex + 1 : countIndex;
  const inputdark = darkThemeClass("dt-log-search", theme);
  const btn = darkThemeClass("btn-dark", theme);

  const handleKeyDown = async (e: any) => {
    if (e.key === "Enter") {
      if (search !== searchText) {
        dispatch(clearSearch());
        dispatch(searchLog(search));
        await scrollToIndex();
      } else if (searchText) {
        await scrollToLogIndex("down", true);
      } else {
        return;
      }
    }
  };

  const handleRateChange = (e: ChangeEvent<HTMLInputElement>) => {
    props.dispatchAction({
      type: ActionTypesEnum.ON_PLAY_BACK_RATE,
      payload: Number(e.target.value),
    });
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
    const scrollAction: { [key: string]: ActionCreatorWithoutPayload } = {
      up: scrollUpIndex,
      down: scrollDownIndex,
    };
    dispatch(scrollAction[direction]());
    borderVisual(direction, ignore);
    await scrollToIndex();
  };

  const exitSearch = () => {
    setSearch("");
    dispatch(clearSearch());
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
        {props.component === LogComponent.logwithvideo && (
          <div className="nav-icon-prog">
            <label htmlFor="playback">Playback Rate</label>
            <input
              type="range"
              value={props.rate}
              min={0.5}
              max={2.5}
              step={0.5}
              id="playback"
              onChange={handleRateChange}
            />
            <span>{props.rate}x</span>
          </div>
        )}
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

export default LogSearch;
