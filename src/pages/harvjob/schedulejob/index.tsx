import { ChangeEvent, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Theme, toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import MainLayout from "@/components/layout/main";
import {
  getJobTypeSchema,
  getScheduledJobForm,
  createScheduledJob,
  getScheduledJob,
} from "@/features/jobscheduler/jobschedulerSlice";
import { queryLocation } from "@/features/location/locationSlice";
import {
  queryFruit,
  queryHarvester,
} from "@/features/harvester/harvesterSlice";
import {
  ClockedData,
  CrontabData,
  IntervalData,
  ScheduleCase,
  ScheduleData,
  ScheduleStepForm,
  TargetCase,
} from "@/features/jobscheduler/jobschedulerTypes";
import {
  FULLFILLED_PROMISE,
  MAX_LIMIT,
  THEME_MODES,
} from "@/features/base/constants";
import { handleSelectFactory, paramsToObject } from "@/utils/utils";
import { Header, BackButton } from "@/components/common";
import { DynamicFormStep, StaticFormStep } from "@/components/harvjob/helpers";
import "./styles.css";

interface FormData {
  url: string;
  data: ScheduleData;
}

function ScheduleJobView() {
  const [step, setStep] = useState<string>(ScheduleStepForm.StaticForm);
  const [scheduleCase, setScheduleCase] = useState<string>("");
  const [targetCase, setTargetCase] = useState<string>("");
  const [fleet, setFleet] = useState<boolean>(false);
  const [selectedPeriod, setSelectedPeriod] = useState<any>(null);
  const [selectedRanch, setSelectedRanch] = useState<any>(null);
  const [selectedHarv, setSelectedHarv] = useState<any>(null);
  const [selectedFruit, setSelectedFruit] = useState<any>(null);
  const [fieldData, setFieldData] = useState<{ max_runs: number }>({
    max_runs: 10,
  });
  const [intervalData, setIntervalData] = useState<IntervalData>({
    every: 1,
    period: "",
  });
  const [crontabData, setCrontabData] = useState<CrontabData>({
    timezone: "UTC",
    minute: "",
    hour: "",
    day_of_week: "",
    day_of_month: "",
    month_of_year: "",
  });
  const [clockedData, setClockedData] = useState<ClockedData>({
    clocked_time: "",
  });
  const { formbuilder, scheduledjob } = useAppSelector(
    (state) => state.jobscheduler,
  );
  const { harvesters, fruits } = useAppSelector((state) => state.harvester);
  const { locations } = useAppSelector((state) => state.location);
  const { theme } = useAppSelector((state) => state.home);
  const dispatch = useAppDispatch();
  const { search } = useLocation();
  const navigate = useNavigate();
  const paramsObj = paramsToObject(search);

  useEffect(() => {
    (async () => {
      const res = await dispatch(getJobTypeSchema());
      if (res.type === FULLFILLED_PROMISE.jobtypeschema) {
        const url =
          res.payload?.jobs?.[paramsObj.jobtype]?.[paramsObj.schema_version]?.[
            "url"
          ];
        if (url) dispatch(getScheduledJobForm(url));
      }
      if (paramsObj.job) dispatch(getScheduledJob(paramsObj.job as number));
      await Promise.all([
        dispatch(queryLocation({ limit: MAX_LIMIT })),
        dispatch(queryHarvester({ limit: MAX_LIMIT })),
        dispatch(queryFruit({ limit: MAX_LIMIT })),
      ]);
    })();
  }, [dispatch]);

  useEffect(() => {
    if (scheduledjob) {
      let schedule: Record<string, any> = scheduledjob.job_def.schedule;
      let targets: Record<string, any> = scheduledjob.job_def.targets;

      if (schedule?.interval) {
        setScheduleCase(ScheduleCase.Interval);
        setIntervalData((current) => {
          return {
            ...current,
            every: schedule.interval?.every,
            period: schedule.interval?.period,
          };
        });
        let period = {
          label: schedule.interval?.period,
          value: schedule.interval?.period,
        };
        setSelectedPeriod(period);
      }
      if (schedule?.crontab) {
        setScheduleCase(ScheduleCase.Crontab);
        setCrontabData((current) => {
          return {
            ...current,
            timezone: schedule.crontab?.timezone,
            minute: schedule.crontab?.minute,
            hour: schedule.crontab?.hour,
            day_of_week: schedule.crontab?.day_of_week,
            day_of_month: schedule.crontab?.day_of_month,
            month_of_year: schedule.crontab?.month_of_year,
          };
        });
      }
      if (schedule?.clocked) {
        setScheduleCase(ScheduleCase.Clocked);
        setClockedData((current) => {
          return { ...current, clocked_time: schedule.clocked?.clocked_time };
        });
      }

      if (targets?.ranches) {
        setTargetCase(TargetCase.Ranch);
        let ranches = targets.ranches?.map((x: string) => ({
          label: x,
          value: x,
        }));
        setSelectedRanch(ranches);
      }
      if (targets?.fruits) {
        setTargetCase(TargetCase.Fruit);
        let fruits = targets.fruits?.map((x: string) => ({
          label: x,
          value: x,
        }));
        setSelectedFruit(fruits);
      }
      if (targets?.harvesters) {
        setTargetCase(TargetCase.Harvester);
        let harvs = targets.harvesters?.map((x: string) => ({
          label: x,
          value: x,
        }));
        setSelectedHarv(harvs);
      }
      if (targets?.all) {
        setTargetCase(TargetCase.Fleet);
        setFleet(Boolean(targets.all));
      }
    }
  }, [scheduledjob]);

  const periodOptions = [
    { label: "seconds", value: "seconds" },
    { label: "minutes", value: "minutes" },
    { label: "hours", value: "hours" },
    { label: "days", value: "days" },
  ];
  const ranchOptions = locations.map((x) => {
    return { label: x.ranch, value: x.ranch };
  });
  const harvesterOptions = harvesters.map((x) => {
    return { label: x.name, value: x.name };
  });
  const fruitOptions = fruits.map((x) => {
    return { label: x.name, value: x.name };
  });
  const handlePeriodSelect: any = handleSelectFactory(setSelectedPeriod);
  const handleRanchSelect: any = handleSelectFactory(setSelectedRanch);
  const handleHarvSelect: any = handleSelectFactory(setSelectedHarv);
  const handleFruitSelect: any = handleSelectFactory(setSelectedFruit);

  const schema = formbuilder.form.properties.payload || {
    properties: {},
    required: [],
    title: "Schedule A Job",
  };

  const handleScheduleJob = async (payload: Record<string, any>) => {
    const data: FormData = {
      url: formbuilder.submit,
      data: {
        jobtype: paramsObj.jobtype,
        schema_version: paramsObj.schema_version,
        max_runs: fieldData.max_runs,
        schedule: {},
        targets: {},
        payload: {
          payload: {
            targets: [],
          },
        },
      },
    };

    if (scheduleCase === ScheduleCase.Interval) {
      data["data"]["schedule"]["interval"] = {
        every: intervalData.every,
        period: selectedPeriod.value,
      };
    }
    if (scheduleCase === ScheduleCase.Crontab) {
      data["data"]["schedule"]["crontab"] = {
        timezone: crontabData.timezone,
        minute: crontabData.minute,
        hour: crontabData.hour,
        day_of_week: crontabData.day_of_week,
        day_of_month: crontabData.day_of_month,
        month_of_year: crontabData.month_of_year,
      };
    }
    if (scheduleCase === ScheduleCase.Clocked) {
      data["data"]["schedule"]["clocked"] = {
        clocked_time: clockedData.clocked_time,
      };
    }

    if (targetCase === TargetCase.Ranch) {
      data["data"]["targets"]["ranches"] = selectedRanch.map(
        (x: { label: string; value: string }) => x.value,
      );
    }
    if (targetCase === TargetCase.Fruit) {
      data["data"]["targets"]["fruits"] = selectedFruit.map(
        (x: { label: string; value: string }) => x.value,
      );
    }
    if (targetCase === TargetCase.Harvester) {
      data["data"]["targets"]["harvesters"] = selectedHarv.map(
        (x: { label: string; value: string }) => x.value,
      );
    }
    if (targetCase === TargetCase.Fleet) {
      data["data"]["targets"]["all"] = fleet;
    }

    data.data.payload = payload.formData;
    const res = await dispatch(createScheduledJob(data));
    if (res.type === FULLFILLED_PROMISE.schedulejob) {
      toast.success(res.payload?.message, {
        theme: theme === THEME_MODES.AUTO_THEME ? "colored" : (theme as Theme),
      });
      setTimeout(() => {
        navigate("/jobscheduler");
      }, 3000);
    } else {
      toast.error(res?.payload, {
        theme: theme === THEME_MODES.AUTO_THEME ? "colored" : (theme as Theme),
      });
    }
  };

  const handleScheduleCase = (e: ChangeEvent<HTMLInputElement>) => {
    setScheduleCase(e.target.value);
  };
  const handleTargetCase = (e: ChangeEvent<HTMLInputElement>) => {
    setTargetCase(e.target.value);
  };
  const handleFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFieldData((current) => {
      return { ...current, [e.target.name]: e.target.value };
    });
  };
  const handleIntervalChange = (e: ChangeEvent<HTMLInputElement>) => {
    setIntervalData((current) => {
      return { ...current, [e.target.name]: e.target.value };
    });
  };
  const handleCrontabChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCrontabData((current) => {
      return { ...current, [e.target.name]: e.target.value };
    });
  };
  const handleClockedChange = (e: ChangeEvent<HTMLInputElement>) => {
    setClockedData((current) => {
      return { ...current, [e.target.name]: e.target.value };
    });
  };
  const handleFleetChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFleet(e.target.checked);
  };
  const takeSteps = (position: string) => {
    if (position === ScheduleStepForm.DynamicForm) {
      if (scheduleCase === ScheduleCase.Interval) {
        if (!intervalData.every || !selectedPeriod) {
          toast.error(
            JSON.stringify({ every: "is required", period: "is required" }),
            {
              theme:
                theme === THEME_MODES.AUTO_THEME ? "colored" : (theme as Theme),
            },
          );
          return;
        }
      }
      if (scheduleCase === ScheduleCase.Crontab) {
        if (
          !crontabData.minute ||
          !crontabData.hour ||
          !crontabData.day_of_week ||
          !crontabData.day_of_month ||
          !crontabData.month_of_year
        ) {
          toast.error(
            JSON.stringify({
              minute: "is required",
              hour: "is required",
              day_of_week: "is required",
              day_of_month: "is required",
              month_of_year: "is required",
            }),
            {
              theme:
                theme === THEME_MODES.AUTO_THEME ? "colored" : (theme as Theme),
            },
          );
          return;
        }
      }
      if (scheduleCase === ScheduleCase.Clocked) {
        if (!clockedData.clocked_time) {
          toast.error(JSON.stringify({ clocked_time: "is required" }), {
            theme:
              theme === THEME_MODES.AUTO_THEME ? "colored" : (theme as Theme),
          });
          return;
        }
      }

      if (targetCase === TargetCase.Ranch) {
        if (!selectedRanch) {
          toast.error(JSON.stringify({ ranches: "is required" }), {
            theme:
              theme === THEME_MODES.AUTO_THEME ? "colored" : (theme as Theme),
          });
          return;
        }
      }
      if (targetCase === TargetCase.Fruit) {
        if (!selectedFruit) {
          toast.error(JSON.stringify({ fruits: "is required" }), {
            theme:
              theme === THEME_MODES.AUTO_THEME ? "colored" : (theme as Theme),
          });
          return;
        }
      }
      if (targetCase === TargetCase.Harvester) {
        if (!selectedHarv) {
          toast.error(JSON.stringify({ harvesters: "is required" }), {
            theme:
              theme === THEME_MODES.AUTO_THEME ? "colored" : (theme as Theme),
          });
          return;
        }
      }
      if (targetCase === TargetCase.Fleet) {
        if (!fleet) {
          toast.error(JSON.stringify({ fleet: "is required" }), {
            theme:
              theme === THEME_MODES.AUTO_THEME ? "colored" : (theme as Theme),
          });
          return;
        }
      }
      if (!scheduleCase) {
        toast.error(JSON.stringify({ schedule: "is required" }), {
          theme:
            theme === THEME_MODES.AUTO_THEME ? "colored" : (theme as Theme),
        });
        return;
      }
      if (!targetCase) {
        toast.error(JSON.stringify({ target: "is required" }), {
          theme:
            theme === THEME_MODES.AUTO_THEME ? "colored" : (theme as Theme),
        });
        return;
      }
      setStep(position);
    } else {
      setStep(position);
    }
  };

  return (
    <MainLayout>
      <div className="container">
        <Header title={"HDS Schedule Job"} className={`display-6 mt-4 mb-4`} />
        <BackButton theme={theme} mb={"mb-4"} />
        <div className="flex-vh text-2x">{formbuilder.form.title}</div>
        {step === ScheduleStepForm.StaticForm ? (
          <StaticFormStep
            clockedData={clockedData}
            crontabData={crontabData}
            fieldData={fieldData}
            fleet={fleet}
            fruitOptions={fruitOptions}
            handleClockedChange={handleClockedChange}
            handleCrontabChange={handleCrontabChange}
            handleFieldChange={handleFieldChange}
            handleFleetChange={handleFleetChange}
            handleFruitSelect={handleFruitSelect}
            handleHarvSelect={handleHarvSelect}
            handleIntervalChange={handleIntervalChange}
            handlePeriodSelect={handlePeriodSelect}
            handleRanchSelect={handleRanchSelect}
            handleScheduleCase={handleScheduleCase}
            handleTargetCase={handleTargetCase}
            harvesterOptions={harvesterOptions}
            intervalData={intervalData}
            periodOptions={periodOptions}
            ranchOptions={ranchOptions}
            scheduleCase={scheduleCase}
            selectedFruit={selectedFruit}
            selectedHarv={selectedHarv}
            selectedPeriod={selectedPeriod}
            selectedRanch={selectedRanch}
            takeSteps={takeSteps}
            targetCase={targetCase}
            theme={theme as string}
          />
        ) : (
          <DynamicFormStep
            handleScheduleJob={handleScheduleJob}
            scheduledjob={scheduledjob}
            schema={schema}
            takeSteps={takeSteps}
            theme={theme as string}
          />
        )}
      </div>
    </MainLayout>
  );
}

export default ScheduleJobView;
