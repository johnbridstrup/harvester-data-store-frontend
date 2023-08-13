import { FormEvent } from "react";
import { toast } from "react-toastify";
import { User } from "@/features/auth/authTypes";
import { SUCCESS } from "@/features/base/constants";
import { HarvesterCodeRelease } from "@/features/harvdeploy/harvdeployTypes";
import harvjobService, {
  JOBSCHEMAS_URL,
} from "@/features/harvjob/harvjobService";
import { createJob } from "@/features/harvjob/harvjobSlice";

export const handleReleaseFormSubmit = (
  releaseObj: HarvesterCodeRelease | null,
  selectedHarvId: any,
  user: User | null,
  token: string,
  dispatch: Function,
) => {
  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const data: Record<string, any> = {
      payload: {},
    };

    if (!user?.is_superuser) {
      toast.error("Permissions denied!");
      return;
    }

    if (selectedHarvId && selectedHarvId.hasOwnProperty("value")) {
      data["target"] = selectedHarvId.value;
    }
    let jobtype = "install_release";
    try {
      let res = await harvjobService.factoryQuery(
        JOBSCHEMAS_URL,
        {
          jobtype__name: jobtype,
          limit: 1,
        },
        token,
      );
      data["schema_version"] = res.results[0]?.version;
      data["payload"]["run_state"] = ["updating"];
      data["payload"]["targets"] = ["master"];
      data["payload"]["release"] = releaseObj?.release;
      data["jobtype"] = jobtype;

      res = await dispatch(createJob(data));
      if (res.payload?.status === SUCCESS) {
        toast.success(res.payload?.message);
      } else {
        toast.error(res?.payload);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  return handleFormSubmit;
};
