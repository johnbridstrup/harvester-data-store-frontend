import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  createJobSchema,
  queryJobSchema,
  updateJobSchema,
} from "@/features/harvjob/harvjobSlice";
import { SUCCESS } from "@/features/base/constants";
import { handleSelectFactory, transformJobTypeOptions } from "@/utils/utils";
import JobSchemaModal from "@/components/modals/JobSchemaModal";
import JobSchemaTable from "@/components/tables/JobSchemaTable";
import { LoaderDiv } from "@/components/styled";
import { Loader } from "@/components/common";
import { JobSchema } from "@/features/harvjob/harvjobTypes";

interface FieldData {
  version: string;
  comment: string;
  mode: string;
  schema: Record<string, any>;
  id: number | null;
}

function JobSchemaList() {
  const [fieldData, setFieldData] = useState<FieldData>({
    version: "",
    comment: "",
    mode: "add",
    schema: {},
    id: null,
  });
  const [schemaData, setSchemaData] = useState<string>("");
  const [selectedJobType, setSelectedJobType] = useState<any>(null);
  const { jobschemas, jobtypes, loading } = useAppSelector(
    (state) => state.harvjob,
  );
  const { theme } = useAppSelector((state) => state.home);
  const jobSchemaRef = useRef<HTMLButtonElement | null>(null);
  const dispatch = useAppDispatch();
  const jobtypeOptions = transformJobTypeOptions(jobtypes);

  const handleFieldChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFieldData((current) => {
      return { ...current, [e.target.name]: e.target.value };
    });
  };

  const handleSchemaChange = (value?: string) => {
    setSchemaData(value as string);
  };

  const handleJobTypeSelect = handleSelectFactory(setSelectedJobType);

  const callback = async (res: any) => {
    if (res.payload?.status === SUCCESS) {
      await dispatch(queryJobSchema({}));
      toast.success(res.payload?.message);
      addPopUp();
      setFieldData((current) => {
        return {
          ...current,
          version: "",
          comment: "",
          mode: "add",
          id: null,
        };
      });
      setSelectedJobType(null);
    } else {
      toast.error(res?.payload);
    }
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const data: Record<string, any> = {};
    let schema: Record<string, any> = {};

    if (selectedJobType && selectedJobType.hasOwnProperty("value")) {
      data["jobtype"] = selectedJobType.value;
    }
    try {
      schema = JSON.parse(schemaData);
    } catch (error) {
      schema = {};
    }
    data["version"] = fieldData.version;
    data["comment"] = fieldData.comment;
    data["schema"] = schema;
    data["id"] = fieldData.id;

    if (fieldData.mode === "add") {
      const res = await dispatch(createJobSchema(data));
      callback(res);
    } else if (fieldData.mode === "edit") {
      const res = await dispatch(updateJobSchema(data));
      callback(res);
    }
  };

  const addPopUp = (mode?: string) => {
    if (typeof mode === "string" && mode === "add") {
      setFieldData((current) => {
        return {
          ...current,
          mode: "add",
          comment: "",
          version: "",
          id: null,
        };
      });
      setSelectedJobType(null);
    }
    jobSchemaRef.current?.click();
  };

  const handleJSUpdateClick = (schemaObj: JobSchema) => {
    setFieldData((current) => {
      return {
        ...current,
        version: schemaObj.version,
        comment: schemaObj.comment,
        schema: schemaObj.schema,
        mode: "edit",
        id: schemaObj.id,
      };
    });
    let jobtype = { label: schemaObj.jobtype, value: schemaObj.jobtype };
    setSelectedJobType(jobtype);
    addPopUp();
  };

  return (
    <>
      <div className="flex-right mt-4 mb-4">
        <button onClick={() => addPopUp("add")} className="btn btn-primary">
          Add New Job Schema
        </button>
        <button
          ref={jobSchemaRef}
          data-bs-toggle="modal"
          data-bs-target="#jobSchemaModal"
          style={{ display: "none" }}
        >
          Add New Job Schema
        </button>
      </div>
      {loading ? (
        <LoaderDiv>
          <Loader size={50} />
        </LoaderDiv>
      ) : (
        <JobSchemaTable
          jobschemas={jobschemas}
          handleJSUpdateClick={handleJSUpdateClick}
          theme={theme as string}
        />
      )}
      <JobSchemaModal
        fieldData={fieldData}
        handleFieldChange={handleFieldChange}
        handleSchemaChange={handleSchemaChange}
        handleSubmit={handleFormSubmit}
        handleJobTypeSelect={handleJobTypeSelect}
        selectedJobType={selectedJobType}
        jobtypeOptions={jobtypeOptions}
        theme={theme as string}
      />
    </>
  );
}

export default JobSchemaList;
