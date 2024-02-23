import {
  useState,
  useEffect,
  lazy,
  Suspense,
  useRef,
  ChangeEvent,
} from "react";
import { useLocation } from "react-router-dom";
import { Theme, toast } from "react-toastify";
import Editor from "@monaco-editor/react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { handleDownload, Loader } from "../common";
import {
  buildQueryObj,
  handleSelectFactory,
  mapParamsObject,
  monacoOptions,
  paramsToObject,
  robotInError,
  timeStampFormat,
  transformCodeOptions,
  transformFruitOptions,
  transformHarvOptions,
  transformLocOptions,
  transformTzOptions,
  transformUserOptions,
  translateUserOptions,
  validateQueryObj,
} from "@/utils/utils";
import DownloadModal from "../modals/DownloadModal";
import {
  Container,
  LoaderDiv,
  NavMainTabSpan,
  NavTabItem,
  NavTabs,
  NavTabSpan,
  TabContent,
} from "../styled";
import ErrorReportTable from "../tables/ErrorReportTable";
import ServiceTable from "../tables/ServiceTable";
import TimeTable from "../tables/Timetable";
import {
  ExceptTabular,
  ImageViewer,
  QueryObject,
  RightButtonGroup,
} from "./ErrorHelpers";
import CreateNotifModal from "../modals/CreateNotifModal";
import timezones from "@/utils/timezones";
import {
  queryFruit,
  queryHarvester,
} from "@/features/harvester/harvesterSlice";
import { queryLocation } from "@/features/location/locationSlice";
import { queryExceptionCode } from "@/features/exception/exceptionSlice";
import { queryUsers } from "@/features/users/usersSlice";
import {
  ErrorReportEnum,
  MAX_LIMIT,
  SUCCESS,
  THEME_MODES,
  TZ,
} from "@/features/base/constants";
import { createNotification } from "@/features/notification/notificationSlice";
import { SysmonKey } from "@/features/errorreport/errorreportTypes";
import { TransformException } from "@/features/exception/exceptionTypes";
import { cacheService } from "@/features/errorreport/errorreportSlice";
const ChronyInfoPlot = lazy(() => import("../plotly/ChronyInfoPlot"));
const ErrorReportJson = lazy(() => import("./ErrorReportJson"));

interface ActiveTab {
  exception: string;
  sysmon: string;
  subtabs: string;
  traceback: string;
  extrainfo: string;
}

interface SysmonObj {
  sysmonKeys: Array<SysmonKey>;
  sysmonObj: Record<string, any>;
}

function ErrorReportDetail() {
  const [activeTab, setActiveTab] = useState<ActiveTab>({
    exception: "",
    sysmon: "Master",
    subtabs: "NUC",
    traceback: "Traceback",
    extrainfo: "ChronyPlot",
  });
  const [sysmonObj, setSysmonObj] = useState<SysmonObj>({
    sysmonKeys: [],
    sysmonObj: {},
  });
  const [sysmonReport, setSysmonReport] = useState<Record<string, any>>({});
  const [subTabObj, setSubTabObj] = useState<any>(null);
  const [robocolor, setRoboColor] = useState<{ main: string; arm: string }>({
    main: "",
    arm: "",
  });
  const {
    timezone,
    transformed: {
      sysmonreport,
      sysmonkeys,
      reportobj,
      erroredservices,
      exceptions,
    },
    internal: { service, timestamp, extrainfo },
  } = useAppSelector((state) => state.errorreport);
  const { token } = useAppSelector((state) => state.auth);
  const { theme } = useAppSelector((state) => state.home);
  const { locations } = useAppSelector((state) => state.location);
  const { fruits, harvesters } = useAppSelector((state) => state.harvester);
  const { exceptioncodes } = useAppSelector((state) => state.exception);
  const { users } = useAppSelector((state) => state.user);

  const [selectedHarvId, setSelectedHarvId] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedTimezone, setSelectedTimezone] = useState(null);
  const [selectedFruit, setSelectedFruit] = useState(null);
  const [selectedCode, setSelectedCode] = useState(null);
  const [selectedRecipient, setSelectedRecipient] = useState<any>(null);
  const [fieldData, setFieldData] = useState<QueryObject>({
    start_time: "",
    end_time: "",
    traceback: "",
    generic: "",
    is_emulator: "0",
    handled: "",
    primary: true,
  });

  const exceptObj = exceptions.find(
    (x) => x.exec_label === activeTab.exception,
  );
  const dispatch = useAppDispatch();
  const { search } = useLocation();
  const downloadRef = useRef<HTMLButtonElement | null>(null);
  const createNotifRef = useRef<HTMLButtonElement | null>(null);

  const harvesterOptions = transformHarvOptions(harvesters);
  const locationOptions = transformLocOptions(locations);
  const timezoneOptions = transformTzOptions(timezones);
  const fruitOptions = transformFruitOptions(fruits);
  const codeOptions = transformCodeOptions(exceptioncodes);
  const usersOptions = transformUserOptions(users);

  useEffect(() => {
    setSysmonReport(sysmonreport);
    setSysmonObj((current) => {
      return {
        ...current,
        sysmonKeys: sysmonkeys,
        sysmonObj: sysmonreport[activeTab.sysmon],
      };
    });
  }, [activeTab.sysmon, sysmonkeys, sysmonreport]);

  useEffect(() => {
    setActiveTab((current) => {
      return { ...current, extrainfo };
    });
  }, [extrainfo]);

  const handleTabChange = (
    tab: string | TransformException,
    category: string,
    obj?: Record<string, any>,
  ) => {
    if (category === ErrorReportEnum.exception) {
      if (!(tab instanceof Object)) return;
      setActiveTab((current) => {
        return { ...current, exception: tab.exec_label };
      });
      let robot = robotInError(tab, sysmonReport);
      setTimeout(() => {
        setActiveTab((current) => {
          return { ...current, sysmon: robot.robot, subtabs: robot.arm };
        });
        setRoboColor((current) => {
          return { ...current, main: robot.robot };
        });
        if (robot.arm) {
          setRoboColor((current) => {
            return { ...current, main: robot.robot, arm: robot.arm };
          });
          setSubTabObj(sysmonReport[robot.robot][robot.arm]);
        }
      }, 500);
      dispatch(
        cacheService({
          service: `${tab.service}.${tab.robot}`,
          timestamp: new Date(
            new Date(tab.timestamp).toLocaleDateString("en-US", {
              timeZone: timezone || TZ,
            }),
          ).getTime(),
        }),
      );
    } else if (category === ErrorReportEnum.sysmon) {
      setActiveTab((current) => {
        return { ...current, sysmon: tab as string };
      });
      setSysmonObj((current) => {
        return { ...current, sysmonObj: sysmonReport[tab as string] };
      });
      if (tab !== ErrorReportEnum.Master) {
        setActiveTab((current) => {
          return { ...current, subtabs: ErrorReportEnum.NUC };
        });
        setSubTabObj(sysmonReport[tab as string][ErrorReportEnum.NUC]);
        setRoboColor((current) => {
          return { ...current, arm: "" };
        });
      }
    } else if (category === ErrorReportEnum.subtabs) {
      setActiveTab((current) => {
        return { ...current, subtabs: tab as string };
      });
      if (tab === ErrorReportEnum.NUC) {
        setSubTabObj(obj?.NUC);
      } else {
        setSubTabObj(obj?.JETSON);
      }
    } else if (category === ErrorReportEnum.traceback) {
      setActiveTab((current) => {
        return { ...current, traceback: tab as string };
      });
    } else if (category === ErrorReportEnum.extrainfo) {
      setActiveTab((current) => {
        return { ...current, extrainfo: tab as string };
      });
    }
  };

  const downloadPopUp = () => {
    downloadRef.current?.click();
  };

  const handleDownloadFiles = async (fileObj: { url: string }) => {
    await handleDownload(fileObj, token as string);
  };

  const createNotifPopUp = async () => {
    const paramsObj = paramsToObject(search);
    mapParamsObject(
      paramsObj,
      exceptioncodes,
      setSelectedHarvId,
      setSelectedLocation,
      setSelectedFruit,
      setSelectedCode,
      setFieldData,
      setSelectedTimezone,
      () => {},
    );
    createNotifRef.current?.click();
    await Promise.all([
      dispatch(queryHarvester({ limit: MAX_LIMIT })),
      dispatch(queryLocation({ limit: MAX_LIMIT })),
      dispatch(queryFruit({ limit: MAX_LIMIT })),
      dispatch(queryExceptionCode({ limit: MAX_LIMIT })),
      dispatch(queryUsers({ limit: MAX_LIMIT })),
    ]);
  };

  const handleFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFieldData((current) => {
      return { ...current, [e.target.name]: e.target.value };
    });
  };
  const handleCreateNotification = async () => {
    let queryObj = buildQueryObj(
      fieldData,
      selectedHarvId,
      selectedLocation,
      selectedTimezone,
      selectedFruit,
      selectedCode,
    );
    delete queryObj["start_time"];
    delete queryObj["end_time"];
    if (selectedRecipient && selectedRecipient.length > 0) {
      queryObj["recipients"] = translateUserOptions(selectedRecipient);
    }
    let isValid = validateQueryObj(queryObj);
    if (!isValid) {
      toast.error(
        "You must include at least one query to create a notification",
        {
          theme:
            theme === THEME_MODES.AUTO_THEME ? "colored" : (theme as Theme),
        },
      );
      return;
    }
    const res = await dispatch(createNotification(queryObj));
    if (res?.payload?.status === SUCCESS) {
      toast.success(res?.payload?.message, {
        theme: theme === THEME_MODES.AUTO_THEME ? "colored" : (theme as Theme),
      });
      createNotifRef.current?.click();
    } else {
      toast.error(res?.payload, {
        theme: theme === THEME_MODES.AUTO_THEME ? "colored" : (theme as Theme),
      });
    }
  };
  const handleHarvestSelect = handleSelectFactory(setSelectedHarvId);
  const handleLocationSelect = handleSelectFactory(setSelectedLocation);
  const handleTimezoneSelect = handleSelectFactory(setSelectedTimezone);
  const handleFruitSelect = handleSelectFactory(setSelectedFruit);
  const handleCodeSelect = handleSelectFactory(setSelectedCode);
  const handleRecipientSelect = handleSelectFactory(setSelectedRecipient);

  return (
    <>
      <RightButtonGroup
        createNotifPopUp={createNotifPopUp}
        createNotifRef={createNotifRef}
        downloadRef={downloadRef}
        popUp={downloadPopUp}
        theme={theme as string}
        eventObj={reportobj?.event}
        service={service}
        ts={timestamp}
      />
      <ErrorReportTable
        reportObj={reportobj}
        timezone={timezone as string}
        theme={theme as string}
      />
      <div className="row">
        <div className="col-md-7">
          <Container>
            <NavTabs>
              {exceptions.map((exec, _) => (
                <NavTabItem key={exec.id}>
                  <NavTabSpan
                    onClick={() =>
                      handleTabChange(
                        exec,
                        ErrorReportEnum.exception,
                        undefined,
                      )
                    }
                    activetab={activeTab.exception}
                    navto={exec.exec_label}
                    robocolor=""
                    theme={theme as string}
                  >
                    {exec.exec_label}
                    {exec.primary && <sup className="text-danger">*</sup>}
                  </NavTabSpan>
                </NavTabItem>
              ))}
            </NavTabs>

            {exceptObj && (
              <TabContent>
                <NavTabs>
                  <NavTabItem>
                    <NavTabSpan
                      onClick={() =>
                        handleTabChange(
                          ErrorReportEnum.Traceback,
                          ErrorReportEnum.traceback,
                          undefined,
                        )
                      }
                      activetab={activeTab.traceback}
                      navto={ErrorReportEnum.Traceback}
                      robocolor=""
                      theme={theme as string}
                    >
                      Traceback
                    </NavTabSpan>
                  </NavTabItem>
                  <NavTabItem>
                    <NavTabSpan
                      onClick={() =>
                        handleTabChange(
                          ErrorReportEnum.Info,
                          ErrorReportEnum.traceback,
                          undefined,
                        )
                      }
                      activetab={activeTab.traceback}
                      navto={ErrorReportEnum.Info}
                      robocolor=""
                      theme={theme as string}
                    >
                      Info
                    </NavTabSpan>
                  </NavTabItem>
                </NavTabs>
                <ExceptTabular
                  exceptName={exceptObj.code.name}
                  timestamp={timeStampFormat(
                    new Date(exceptObj.timestamp),
                    timezone as string,
                  )}
                  theme={theme as string}
                />
                <Editor
                  height="90vh"
                  language="python"
                  value={
                    activeTab.traceback === ErrorReportEnum.Traceback
                      ? exceptObj.traceback
                      : exceptObj.info
                  }
                  theme={theme === THEME_MODES.DARK_THEME ? "vs-dark" : "light"}
                  options={{ ...monacoOptions, readOnly: true } as any}
                />
              </TabContent>
            )}
          </Container>
        </div>
        <div className="col-md-5">
          <Container>
            <NavTabs>
              {sysmonObj.sysmonKeys.map((key, index) => (
                <NavTabItem key={index}>
                  <NavMainTabSpan
                    onClick={() =>
                      handleTabChange(
                        key.robot,
                        ErrorReportEnum.sysmon,
                        sysmonObj.sysmonObj,
                      )
                    }
                    activetab={activeTab.sysmon}
                    robocolor={robocolor.main}
                    navto={key.robot}
                    errored={String(key.error)}
                    theme={theme as string}
                  >
                    {key.robot}
                  </NavMainTabSpan>
                </NavTabItem>
              ))}
            </NavTabs>

            {activeTab.sysmon !== ErrorReportEnum.Master && (
              <NavTabs>
                <NavTabItem>
                  <NavTabSpan
                    onClick={() =>
                      handleTabChange(
                        ErrorReportEnum.NUC,
                        ErrorReportEnum.subtabs,
                        sysmonObj.sysmonObj,
                      )
                    }
                    activetab={activeTab.subtabs}
                    robocolor={robocolor.arm}
                    navto={ErrorReportEnum.NUC}
                    theme={theme as string}
                  >
                    NUC
                  </NavTabSpan>
                </NavTabItem>
                <NavTabItem>
                  <NavTabSpan
                    onClick={() =>
                      handleTabChange(
                        ErrorReportEnum.JETSON,
                        ErrorReportEnum.subtabs,
                        sysmonObj.sysmonObj,
                      )
                    }
                    activetab={activeTab.subtabs}
                    robocolor={robocolor.arm}
                    navto={ErrorReportEnum.JETSON}
                    theme={theme as string}
                  >
                    JETSON
                  </NavTabSpan>
                </NavTabItem>
              </NavTabs>
            )}

            {activeTab.sysmon === ErrorReportEnum.Master
              ? sysmonObj.sysmonObj && (
                  <Container>
                    <div className="row">
                      <div className="col-xl-12 col-md-12 col-sm-12">
                        <NavTabs>
                          <NavTabItem>
                            <NavTabSpan
                              onClick={() =>
                                handleTabChange(
                                  ErrorReportEnum.ChronyPlot,
                                  ErrorReportEnum.extrainfo,
                                  undefined,
                                )
                              }
                              activetab={activeTab.extrainfo}
                              navto={ErrorReportEnum.ChronyPlot}
                              robocolor=""
                              theme={theme as string}
                            >
                              Chrony Plot
                            </NavTabSpan>
                          </NavTabItem>
                          <NavTabItem>
                            <NavTabSpan
                              onClick={() =>
                                handleTabChange(
                                  ErrorReportEnum.Images,
                                  ErrorReportEnum.extrainfo,
                                  undefined,
                                )
                              }
                              activetab={activeTab.extrainfo}
                              navto={ErrorReportEnum.Images}
                              robocolor=""
                              theme={theme as string}
                            >
                              Images
                            </NavTabSpan>
                          </NavTabItem>
                        </NavTabs>
                        {activeTab.extrainfo === ErrorReportEnum.ChronyPlot && (
                          <Suspense
                            fallback={
                              <LoaderDiv>
                                <Loader size={25} />
                              </LoaderDiv>
                            }
                          >
                            <ChronyInfoPlot
                              robot={ErrorReportEnum.Master}
                              chronyInfo={sysmonObj.sysmonObj?.chrony_info}
                              theme={theme as string}
                            />
                          </Suspense>
                        )}
                        {activeTab.extrainfo === ErrorReportEnum.Images && (
                          <ImageViewer
                            related_images={
                              reportobj?.event.related_images || []
                            }
                            theme={theme as string}
                          />
                        )}
                      </div>
                      <div className="col-xl-12 col-md-12 col-sm-12">
                        <TimeTable
                          sysmonObj={sysmonObj.sysmonObj}
                          theme={theme as string}
                        />
                      </div>
                    </div>
                    <ServiceTable
                      services={sysmonObj.sysmonObj?.services}
                      errors={erroredservices}
                      theme={theme as string}
                    />
                  </Container>
                )
              : subTabObj && (
                  <Container>
                    <div className="row">
                      <div className="col-xl-12 col-md-12 col-sm-12">
                        <NavTabs>
                          <NavTabItem>
                            <NavTabSpan
                              onClick={() =>
                                handleTabChange(
                                  ErrorReportEnum.ChronyPlot,
                                  ErrorReportEnum.extrainfo,
                                  undefined,
                                )
                              }
                              activetab={activeTab.extrainfo}
                              navto={ErrorReportEnum.ChronyPlot}
                              robocolor=""
                              theme={theme as string}
                            >
                              Chrony Plot
                            </NavTabSpan>
                          </NavTabItem>
                          <NavTabItem>
                            <NavTabSpan
                              onClick={() =>
                                handleTabChange(
                                  ErrorReportEnum.Images,
                                  ErrorReportEnum.extrainfo,
                                  undefined,
                                )
                              }
                              activetab={activeTab.extrainfo}
                              navto={ErrorReportEnum.Images}
                              robocolor=""
                              theme={theme as string}
                            >
                              Images
                            </NavTabSpan>
                          </NavTabItem>
                        </NavTabs>
                        {activeTab.extrainfo === ErrorReportEnum.ChronyPlot && (
                          <Suspense
                            fallback={
                              <LoaderDiv>
                                <Loader size={25} />
                              </LoaderDiv>
                            }
                          >
                            <ChronyInfoPlot
                              robot={ErrorReportEnum.Robot}
                              chronyInfo={subTabObj?.chrony_info}
                              theme={theme as string}
                            />
                          </Suspense>
                        )}
                        {activeTab.extrainfo === ErrorReportEnum.Images && (
                          <ImageViewer
                            related_images={
                              reportobj?.event.related_images || []
                            }
                            theme={theme as string}
                          />
                        )}
                      </div>
                      <div className="col-xl-12 col-md-12 col-sm-12">
                        <TimeTable
                          sysmonObj={subTabObj}
                          theme={theme as string}
                        />
                      </div>
                    </div>
                    <ServiceTable
                      services={subTabObj?.services}
                      errors={erroredservices}
                      theme={theme as string}
                    />
                  </Container>
                )}
          </Container>
        </div>
      </div>
      <Container>
        <Suspense
          fallback={
            <LoaderDiv>
              <Loader size={25} />
            </LoaderDiv>
          }
        >
          <ErrorReportJson reportObj={reportobj} theme={theme as string} />
        </Suspense>
      </Container>
      <DownloadModal
        eventObj={reportobj?.event}
        handleDownload={handleDownloadFiles}
        theme={theme as string}
      />
      <CreateNotifModal
        codeOptions={codeOptions}
        fieldData={fieldData}
        fruitOptions={fruitOptions}
        handleCodeSelect={handleCodeSelect}
        handleFieldChange={handleFieldChange}
        handleFruitSelect={handleFruitSelect}
        handleHarvestSelect={handleHarvestSelect}
        handleLocationSelect={handleLocationSelect}
        handleRecipientSelect={handleRecipientSelect}
        handleSubmit={handleCreateNotification}
        handleTimezoneSelect={handleTimezoneSelect}
        harvesterOptions={harvesterOptions}
        locationOptions={locationOptions}
        selectedCode={selectedCode}
        selectedFruit={selectedFruit}
        selectedHarvId={selectedHarvId}
        selectedLocation={selectedLocation}
        selectedRecipient={selectedRecipient}
        selectedTimezone={selectedTimezone}
        theme={theme as string}
        timezoneOptions={timezoneOptions}
        usersOptions={usersOptions}
      />
    </>
  );
}

export default ErrorReportDetail;
