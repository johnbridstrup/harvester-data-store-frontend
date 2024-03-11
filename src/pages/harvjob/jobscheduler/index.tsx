import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  cacheSelectOptions,
  queryJobType,
  resetSelectOptions,
} from "@/features/harvjob/harvjobSlice";
import {
  getJobTypeSchema,
  getScheduledJobForm,
  queryScheduledJob,
} from "@/features/jobscheduler/jobschedulerSlice";
import MainLayout from "@/components/layout/main";
import { Header } from "@/components/common";
import { MAX_LIMIT } from "@/features/base/constants";
import JobTypeSelect from "@/components/harvjob/jobscheduler/JobTypeSelect";
import JobSchemaSelect from "@/components/harvjob/jobscheduler/JobSchemaSelect";
import JobScheduled from "@/components/harvjob/jobscheduler/JobScheduled";
import { objectKeys } from "@/utils/utils";
import "./styles.css";

function JobSchedulerView() {
  const [selectedJobType, setSelectedJobType] = useState<any>(null);
  const [selectedJobSchema, setSelectedJobSchema] = useState<any>(null);
  const [schemaOptions, setSchemaOptions] = useState<any>([]);
  const {
    internal: { jtype, schema, cacheSchemaOptions },
  } = useAppSelector((state) => state.harvjob);
  const { jobtypeschema, formbuilder, scheduledjobs } = useAppSelector(
    (state) => state.jobscheduler,
  );
  const { theme } = useAppSelector((state) => state.home);
  const dispatch = useAppDispatch();
  const jobtypeOptions = objectKeys(jobtypeschema?.jobs).map((x) => {
    return { label: x, value: x };
  });

  useEffect(() => {
    dispatch(queryJobType({ limit: MAX_LIMIT }));
    dispatch(getJobTypeSchema());
  }, [dispatch]);

  useEffect(() => {
    (async () => {
      if (jtype && schema) {
        setSelectedJobType(jtype);
        setSelectedJobSchema(schema);
        setSchemaOptions(cacheSchemaOptions);
        const url =
          jobtypeschema?.jobs?.[jtype?.value]?.[schema?.value]?.["url"];
        if (url) dispatch(getScheduledJobForm(url));
        dispatch(
          queryScheduledJob({
            jobtype: jtype?.value,
            schema_version: schema?.value,
          }),
        );
      }
    })();
  }, [dispatch, jobtypeschema, jtype, schema, cacheSchemaOptions]);

  const handleJobTypeSelect = async (newValue: any) => {
    setSelectedJobType(newValue);
    if (newValue && newValue.hasOwnProperty("value")) {
      const options = objectKeys(jobtypeschema?.jobs[newValue.value]).map(
        (x) => {
          return { label: `version ${x}`, value: x };
        },
      );
      setSchemaOptions(options);
      setSelectedJobSchema(options[0]);
      const url =
        jobtypeschema?.jobs?.[newValue.value]?.[options[0]?.value]?.["url"];
      dispatch(getScheduledJobForm(url));
      dispatch(
        cacheSelectOptions({
          jtype: newValue,
          schema: options[0],
          schemaOptions: options,
        }),
      );
      dispatch(
        queryScheduledJob({
          jobtype: newValue.value,
          schema_version: options[0]?.value,
        }),
      );
    } else {
      setSelectedJobSchema(null);
      dispatch(resetSelectOptions());
      dispatch(cacheSelectOptions({}));
    }
  };

  const handleJobSchemaSelect = async (newValue: any) => {
    setSelectedJobSchema(newValue);
    if (newValue && newValue.hasOwnProperty("value")) {
      const url =
        jobtypeschema?.jobs?.[selectedJobType?.value]?.[newValue?.value]?.[
          "url"
        ];
      dispatch(getScheduledJobForm(url));
      dispatch(
        queryScheduledJob({
          jobtype: selectedJobType?.value,
          schema_version: newValue.value,
        }),
      );
      dispatch(
        cacheSelectOptions({
          jtype: selectedJobType,
          schema: newValue,
          schemaOptions,
        }),
      );
    }
  };

  return (
    <MainLayout>
      <div className="container">
        <Header title={"HDS Job Scheduler"} className={`display-6 mt-4 mb-4`} />
        <div className="row mb-4">
          <div className="col-lg-3 col-md-4 col-sm-12">
            <JobTypeSelect
              jobtypeOptions={jobtypeOptions}
              handleJobTypeSelect={handleJobTypeSelect}
              selectedJobType={selectedJobType}
              theme={theme as string}
            />
          </div>
          <div className="col-lg-9 col-md-8 col-sm-12">
            <JobSchemaSelect
              schemaOptions={schemaOptions}
              handleJobSchemaSelect={handleJobSchemaSelect}
              selectedJobSchema={selectedJobSchema}
              theme={theme as string}
              url={
                jobtypeschema?.jobs?.[selectedJobType?.value]?.[
                  selectedJobSchema?.value
                ]?.["url"]
              }
            />
          </div>
        </div>
        <div className="row mb-4">
          <JobScheduled
            jobs={scheduledjobs}
            jobschema={formbuilder.form}
            theme={theme as string}
          />
        </div>
      </div>
    </MainLayout>
  );
}

export default JobSchedulerView;
