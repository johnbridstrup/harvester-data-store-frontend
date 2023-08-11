import { useEffect, useReducer } from "react";
import moment from "moment";
import VSCodeEditor from "@monaco-editor/react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { LoaderDiv, NavTabItem, NavTabs, NavTabSpan } from "../styled";
import { FULLFILLED_PROMISE, THEME_MODES } from "@/features/base/constants";
import { Harvester } from "@/features/harvester/harvesterTypes";
import { fullConfigReport } from "@/features/aftconfig/aftconfigSlice";
import {
  objectKeys,
  monacoOptions,
  titleCase,
  transformConfig,
} from "@/utils/utils";
import { Loader } from "../common";

interface SchemaState {
  activetab: string;
  configtab: string;
  configsubtab: string;
  schema: any;
  configObj: any;
  fetching: boolean;
  subtabkeys: Array<string>;
}

interface ActionPayload {
  type: string;
  payload: any;
}

const initialState: SchemaState = {
  activetab: "release",
  configtab: "0",
  configsubtab: "overlay_diff",
  schema: null,
  configObj: null,
  fetching: false,
  subtabkeys: [],
};

interface TabsProps {
  harvester: Harvester | null;
  theme: string;
}

function reducer(state: SchemaState, action: ActionPayload) {
  switch (action.type) {
    case "RELEASE_TAB":
      return { ...state, activetab: "release", schema: action.payload };
    case "VERSION_TAB":
      return { ...state, activetab: "version", schema: action.payload };
    case "AFTCONFIG_TAB":
      return { ...state, activetab: "aftconfig" };
    case "AFTCONFIG_KEY_TAB":
      const { tab, subtab, obj, subtabkeys } = action.payload;
      return {
        ...state,
        configtab: tab,
        configsubtab: subtab,
        configObj: obj ? obj : state.configObj,
        subtabkeys: subtabkeys,
      };
    case "AFTCONFIG_SUB_TAB":
      return {
        ...state,
        configsubtab: action.payload.tab,
        configObj: action.payload.obj,
      };
    case "AFTCONFIG_FETCH":
      return {
        ...state,
        fetching: action.payload,
      };
    default:
      return state;
  }
}

function SchemaTabsView({ harvester, theme }: TabsProps) {
  const [state, dispatchAction] = useReducer(reducer, initialState);
  const {
    configkeys,
    aftconfig,
    transformed: { configs, errored },
  } = useAppSelector((state) => state.aftconfig);
  const dispatch = useAppDispatch();
  const {
    activetab,
    schema,
    configtab,
    configsubtab,
    configObj,
    fetching,
    subtabkeys,
  } = state;

  const handleTabChange = async (tab: string, category: string, obj: any) => {
    if (category === "maintabs") {
      const dispatchObj: { [key: string]: string } = {
        release: "RELEASE_TAB",
        version: "VERSION_TAB",
        aftconfig: "AFTCONFIG_TAB",
      };
      dispatchAction({ type: dispatchObj[tab], payload: obj });
      if (tab === "aftconfig") {
        dispatchAction({
          type: "AFTCONFIG_FETCH",
          payload: true,
        });
        const res = await dispatch(fullConfigReport(harvester?.id as number));
        if (res.type === FULLFILLED_PROMISE.aftconfig) {
          const { errored, obj } = transformConfig(res.payload.report?.data);
          const keys = objectKeys(obj);
          if (errored) {
            dispatchAction({
              type: "AFTCONFIG_KEY_TAB",
              payload: { tab: keys[0], obj: obj[keys[0]], subtabkeys: [] },
            });
          } else {
            const subkeys = objectKeys(obj[keys[0]]);
            dispatchAction({
              type: "AFTCONFIG_KEY_TAB",
              payload: { tab: keys[0], obj: undefined, subtabkeys: subkeys },
            });
            dispatchAction({
              type: "AFTCONFIG_SUB_TAB",
              payload: {
                tab: subkeys[0],
                obj: obj[keys[0]]?.[subkeys[0]],
              },
            });
          }
        }
        dispatchAction({
          type: "AFTCONFIG_FETCH",
          payload: false,
        });
      }
    } else if (category === "keytabs") {
      if (errored) {
        dispatchAction({
          type: "AFTCONFIG_KEY_TAB",
          payload: {
            tab,
            subtab: undefined,
            obj: configs[tab],
            subtabkeys: [],
          },
        });
      } else {
        const keys = objectKeys(configs[tab]);
        dispatchAction({
          type: "AFTCONFIG_KEY_TAB",
          payload: {
            tab,
            subtab: keys[0],
            obj: configs[tab]?.[keys[0]],
            subtabkeys: keys,
          },
        });
      }
    } else if (category === "subtabs") {
      dispatchAction({
        type: "AFTCONFIG_SUB_TAB",
        payload: { tab, obj: configs[configtab]?.[tab] },
      });
    }
  };

  useEffect(() => {
    dispatchAction({ type: "RELEASE_TAB", payload: harvester?.release });
  }, [harvester?.release]);

  return (
    <div className="mb-4 mt-3">
      <NavTabs>
        <NavTabItem>
          <NavTabSpan
            onClick={() =>
              handleTabChange("release", "maintabs", harvester?.release)
            }
            activetab={activetab}
            navto={"release"}
            theme={theme}
            robocolor=""
          >
            Release
          </NavTabSpan>
        </NavTabItem>
        <NavTabItem>
          <NavTabSpan
            onClick={() =>
              handleTabChange("version", "maintabs", harvester?.version)
            }
            activetab={activetab}
            navto={"version"}
            theme={theme}
            robocolor=""
          >
            Version
          </NavTabSpan>
        </NavTabItem>
        <NavTabItem>
          <NavTabSpan
            onClick={() => handleTabChange("aftconfig", "maintabs", undefined)}
            activetab={activetab}
            navto={"aftconfig"}
            theme={theme}
            robocolor=""
          >
            AFTConfig
          </NavTabSpan>
        </NavTabItem>
      </NavTabs>
      {activetab === "aftconfig" && (
        <NavTabs>
          {configkeys.map((item, index) => (
            <NavTabItem key={index}>
              <NavTabSpan
                onClick={() => handleTabChange(item, "keytabs", undefined)}
                activetab={configtab}
                navto={item}
                theme={theme}
                robocolor=""
              >
                {item}
              </NavTabSpan>
            </NavTabItem>
          ))}
        </NavTabs>
      )}
      {activetab === "aftconfig" && configObj && (
        <NavTabs>
          {subtabkeys.map((item: string, index: number) => (
            <NavTabItem key={index}>
              <NavTabSpan
                onClick={() => handleTabChange(item, "subtabs", undefined)}
                activetab={configsubtab}
                navto={item}
                theme={theme}
                robocolor=""
              >
                {titleCase(item, "_")}
              </NavTabSpan>
            </NavTabItem>
          ))}
        </NavTabs>
      )}
      {(activetab === "release" || activetab === "version") && (
        <VSCodeEditor
          height="40vh"
          language="json"
          value={JSON.stringify(schema, null, 2)}
          theme={theme === THEME_MODES.DARK_THEME ? "vs-dark" : "light"}
          options={{ ...monacoOptions, readOnly: true } as any}
        />
      )}
      {activetab === "aftconfig" && (
        <>
          {fetching ? (
            <LoaderDiv>
              <Loader size={25} />
            </LoaderDiv>
          ) : (
            <>
              <div className="pt-2 pb-2">
                ReportTime: {moment(aftconfig?.reportTime).format("LLLL")}
              </div>
              {errored ? (
                <VSCodeEditor
                  height="40vh"
                  language="python"
                  value={configObj}
                  theme={theme === THEME_MODES.DARK_THEME ? "vs-dark" : "light"}
                  options={{ ...monacoOptions, readOnly: true } as any}
                />
              ) : (
                <VSCodeEditor
                  height="40vh"
                  language="json"
                  value={JSON.stringify(configObj, null, 2)}
                  theme={theme === THEME_MODES.DARK_THEME ? "vs-dark" : "light"}
                  options={{ ...monacoOptions, readOnly: true } as any}
                />
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default SchemaTabsView;
