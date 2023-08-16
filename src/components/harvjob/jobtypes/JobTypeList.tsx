import { ChangeEvent, FormEvent, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { SUCCESS } from "@/features/base/constants";
import {
  createJobType,
  queryJobType,
  updateJobType,
} from "@/features/harvjob/harvjobSlice";
import { JobType } from "@/features/harvjob/harvjobTypes";
import { Loader } from "@/components/common";
import JobTypeModal from "@/components/modals/JobTypeModal";
import { LoaderDiv } from "@/components/styled";
import JobTypeTable from "@/components/tables/JobTypeTable";

interface FieldData {
  name: string;
  mode: string;
  id: number | null;
}

function ListJobTypes() {
  const [fieldData, setFieldData] = useState<FieldData>({
    name: "",
    mode: "add",
    id: null,
  });
  const { jobtypes, loading } = useAppSelector((state) => state.harvjob);
  const { theme } = useAppSelector((state) => state.home);
  const jobTypeRef = useRef<HTMLButtonElement | null>(null);
  const dispatch = useAppDispatch();

  const handleFieldChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFieldData((current) => {
      return { ...current, [e.target.name]: e.target.value };
    });
  };

  const callback = async (res: any) => {
    if (res.payload?.status === SUCCESS) {
      await dispatch(queryJobType({}));
      toast.success(res?.payload?.message);
      addPopUp();
      setFieldData((current) => {
        return { ...current, name: "", mode: "add", objId: null };
      });
    } else {
      toast.error(res?.payload);
    }
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (fieldData.mode === "add") {
      const res = await dispatch(createJobType(fieldData));
      callback(res);
    } else if (fieldData.mode === "edit") {
      const res = await dispatch(updateJobType(fieldData));
      callback(res);
    }
  };

  const addPopUp = (mode?: string) => {
    if (typeof mode === "string" && mode === "add") {
      setFieldData((current) => {
        return { ...current, name: "", mode: "add", objId: null };
      });
    }
    jobTypeRef.current?.click();
  };

  const handleJTUpdateClick = (jobObj: JobType) => {
    setFieldData((current) => {
      return {
        ...current,
        name: jobObj.name,
        mode: "edit",
        objId: jobObj.id,
      };
    });
    addPopUp();
  };

  return (
    <>
      <div className="flex-right mb-4 mt-4">
        <button onClick={() => addPopUp("add")} className="btn btn-primary">
          Add New Job Type
        </button>
        <button
          ref={jobTypeRef}
          data-bs-toggle="modal"
          data-bs-target="#jobTypeModal"
          style={{ display: "none" }}
        >
          Add New Job Type
        </button>
      </div>
      {loading ? (
        <LoaderDiv>
          <Loader size={50} />
        </LoaderDiv>
      ) : (
        <JobTypeTable
          jobtypes={jobtypes}
          handleJTUpdateClick={handleJTUpdateClick}
          theme={theme as string}
        />
      )}
      <JobTypeModal
        fieldData={fieldData}
        handleChange={handleFieldChange}
        handleSubmit={handleFormSubmit}
        theme={theme as string}
      />
    </>
  );
}

export default ListJobTypes;
